<script setup>
import { onMounted } from "vue";
import axios from "axios";
import { useSearchPartner } from "./stores/searchPartner";
import Cookies from "js-cookie";
import countries from "./storage/countries.json";

const searchPartner = useSearchPartner();

onMounted(async () => {
  if (Cookies.get("country")) {
     return;
  } else {
    try {
      await searchPartner.setLoading(true);
      const res = await axios.get(
        "https://api.ipgeolocation.io/ipgeo?apiKey=1c9dee18518d4b55becc6cee7bf6ccf8"
      );
      const data = await res.data;

      searchPartner.setCountry(data.country_code2);
      searchPartner.getCountryIndexAndSet(data.country_code2);
      await searchPartner.setLoading(false);
    } catch (error) {
      await searchPartner.setLoading(false);
    }
  }
});
</script>

<template>
  <div class="min-h-screen app bg-sky-100">
    <routerView />
  </div>
</template>

<style scoped></style>
