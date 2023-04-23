<script setup>
import { computed } from "vue";
import TheRegister from "../components/TheRegister.vue";
import Cookie from "js-cookie";
import TheScreens from "../components/TheScreens.vue";

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
    <TheRegister v-if="!isToken" />
    <TheScreens></TheScreens>
    
  </main>
</template>
