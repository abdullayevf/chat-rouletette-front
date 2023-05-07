<script setup>
import { onMounted } from "vue";
import { useVkLogin } from "../composables/useVkLogin";

const { getUserData } = useVkLogin();

onMounted(async () => {
  await getUserData();
});
</script>

<template></template>
