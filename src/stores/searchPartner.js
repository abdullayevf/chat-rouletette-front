import { ref } from "vue";
import { defineStore } from "pinia";
import Cookies from "js-cookie";

export const useSearchPartner = defineStore("searchPartner", () => {
  const country = ref(Cookies.get("country") || "");
  const gender = ref(Cookies.get("gender") || "");
  const showCountrySearch = ref(false);
  const loading = ref(false);

  const toggleCountrySearch = (v) => {
    showCountrySearch.value = v;
  };

  const setCountry = (c) => {
    country.value = c;
    Cookies.set("country", c);
  };

  const setLoading = async (v) => {
    loading.value = v;
  };

  const toggleGender = () => {
    if (Cookies.get("gender")) {
      if (Cookies.get("gender") === "male") {
        Cookies.remove("gender");
        gender.value = "female";
        Cookies.set("female", "female");
      } else {
        Cookies.remove("gender");
        gender.value = "male";
        Cookies.set("male", "male");
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
  };
});
