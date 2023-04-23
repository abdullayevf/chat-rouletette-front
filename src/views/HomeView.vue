<script setup>
import { computed } from "vue";
import TheRegister from "../components/TheRegister.vue";
import Cookie from "js-cookie";
import TheScreens from "../components/TheScreens.vue";
import TheReport from "../components/TheReport.vue";
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
    <TheReport @closeReport="toggleReport" v-if="reportVisible" />
    <TheRegister v-if="!isToken" />
    <TheScreens @toggleReportEvent="toggleReport"></TheScreens>
  </main>
</template>

<style>

</style>
