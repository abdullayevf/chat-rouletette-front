<script setup>
import { useUserStore } from "../stores/user";
import { reactive, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";

const router = useRouter();
const route = useRoute();
const store = useUserStore();

onMounted(async () => {
  try {
    const code = route.query.code;
    const res = await axios.post(
      `https://oauth.yandex.ru/token?grant_type=authorization_code&code=${code}&client_id=${
        import.meta.env.VITE_YANDEX_ID
      }&client_secret=${import.meta.env.VITE_YANDEX_SECRET}`
    );

    console.log(res);
  } catch (error) {
    console.log(error);
  }
});
</script>

<template>
  <div class="logging-in text-center w-full pt-8 text-xl font-semibold">
    Загрузка...
  </div>
</template>
