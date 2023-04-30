<script setup>
import { computed } from "vue";
import TheRegister from "../components/TheRegister.vue";
import Cookie from "js-cookie";
import TheScreens from "../components/TheScreens.vue";
import TheReport from "../components/TheReport.vue";
import TheCountries from "../components/TheCountries.vue";
import { ref } from "vue";

const reportVisible = ref(false);

const toggleReport = (e) => {
  reportVisible.value = e;
};

let isToken = computed(() => {
  if (Cookie.get("token")) {
    return true;
  } else {
    return false;
  }
});
</script>

<template>
  <main>
    <transition name="fade" mode="out-in">
      <TheReport @closeReport="toggleReport" v-if="reportVisible" />
    </transition>
    <transition name="fade" mode="out-in">
      <TheRegister v-if="isToken"></TheRegister>
    </transition>
    <transition name="fade" mode="out-in">
      <TheScreens @toggleReportEvent="toggleReport"></TheScreens>
    </transition>
    <transition name="fade" mode="out-in">
      <TheCountries></TheCountries>
    </transition>
  </main>
</template>

<style></style>
