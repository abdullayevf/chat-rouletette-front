import { ref } from "vue";
import { defineStore } from "pinia";
import Cookies from "js-cookie";
import countries from "../storage/countries.json";

export const useSearchPartner = defineStore("searchPartner", () => {
  const country = ref(Cookies.get("country") || "");
  const countryIndex = ref(Cookies.get("countryIndex" || 0));
  const gender = ref(Cookies.get("gender") || "male");
  const showCountrySearch = ref(false);
  const loading = ref(false);

  const toggleCountrySearch = (v) => {
    showCountrySearch.value = v;
  };

  const setCountryIndex = (c) => {
    countryIndex.value = c;

    if (Cookies.get("countryIndex")) {
      Cookies.remove("countryIndex");
      Cookies.set("countryIndex", c);
    } else {
      Cookies.set("countryIndex", c);
    }
  };

  const setCountry = (c) => {
    getCountryIndexAndSet(c);
    country.value = c;
    if (Cookies.get("country")) {
      Cookies.remove("country");
      Cookies.set("country", c);
    } else {
      Cookies.set("country", c);
    }
  };

  const getCountryIndexAndSet = (alpha) => {
    const foundIndex = countries.findIndex((i) => i.alpha1 === alpha);

    setCountryIndex(foundIndex);

    return foundIndex;
  };

  const findCountryByIndex = (index) => {
    const country = countries[index];

    return country;
  };

  const setLoading = async (v) => {
    loading.value = v;
  };

  const toggleGender = () => {
    if (Cookies.get("gender")) {
      if (Cookies.get("gender") === "male") {
        Cookies.remove("gender");
        gender.value = "female";
        Cookies.set("gender", "female");
      } else {
        Cookies.remove("gender");
        gender.value = "male";
        Cookies.set("gender", "male");
      }
    } else {
      gender.value = "male";
      Cookies.set("gender", "male");
    }
  };

  return {
    country,
    gender,
    setCountry,
    toggleCountrySearch,
    showCountrySearch,
    loading,
    setLoading,
    toggleGender,
    findCountryByIndex,
    setCountryIndex,
    getCountryIndexAndSet,
    countryIndex,
  };
});
