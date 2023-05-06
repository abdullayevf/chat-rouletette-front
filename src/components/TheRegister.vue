<script setup>
import { useSearchPartner } from "../stores/searchPartner";
import { useGoogleLogin } from "../composables/useGoogleLogin";
import { useYandexLogin } from "../composables/useYandexLogin";

const { googleLogin } = useGoogleLogin();
const { yandexLogin } = useYandexLogin();

const store = useSearchPartner();
</script>

<template>
  <div
    class="fixed inset-0 z-50 flex flex-col items-center justify-center h-screen bg-black register-comp bg-opacity-70"
  >
    <form
      @submit.prevent=""
      class="register-form bg-white rounded border p-4 w-[400px]"
    >
      <div class="flex flex-col items-center mt-3 mb-5 text-center titles">
        <img class="mb-4 w-14" src="../assets/icons/videochat.png" alt="logo" />
        <h1 class="text-2xl font-bold text-blue-500 form-title">
          Welcome to VideoCHAT
        </h1>
        <p class="mt-2 font-medium text-gray-700">Start chatting right now!</p>
      </div>
      <hr />
      <div class="mt-4 middle-group">
        <p class="mb-3 font-semibold title">Register with:</p>
        <div class="space-y-3 buttons">
          <button
            @click="googleLogin"
            :disabled="store.loading"
            class="flex items-center disabled:text-gray-500 disabled:border-gray-500 disabled:cursor-not-allowed justify-center w-full py-2 text-lg font-semibold border border-black rounded register-options"
          >
            Google
            <img
              class="w-5 ml-2"
              src="../assets/icons/google.png"
              alt="google"
            />
          </button>
          <button
            :disabled="store.loading"
            class="flex items-center justify-center w-full py-2 text-lg disabled:border-gray-500 disabled:bg-gray-500 disabled:cursor-not-allowed font-semibold border border-[#2787F5] bg-[#2787F5] text-white rounded register-options"
          >
            VKontakte
            <img
              class="w-5 ml-2"
              src="../assets/icons/vk.png"
              alt="vk"
            /></button
          ><button
            @click="yandexLogin"
            :disabled="store.loading"
            class="flex items-center justify-center w-full py-2 text-lg font-semibold border disabled:border-gray-500 disabled:bg-gray-500 disabled:cursor-not-allowed border-[#ffcc00] rounded bg-[#ffcc00] text-white register-options"
          >
            Yandex
            <img
              class="w-5 ml-2"
              src="../assets/icons/yandex.png"
              alt="yandex"
            />
          </button>
        </div>
      </div>
    </form>
    <div class="my-4 text-center text-white texts">
      <p>Я подтверждаю, что мне уже исполнилось 18 лет.</p>
      <p>
        Я принимаю
        <router-link class="underline" to="/loading"
          >Пользовательское соглашение</router-link
        >
      </p>
    </div>
  </div>
</template>

/** const yandexLogin = async () => { try { await store.setLoading(true);
window.open(
`https://oauth.yandex.com/authorize?response_type=code&client_id=${YANDEX_ID}&redirect_uri=${YANDEX_REDIRECT}`,
"targetWindow",
`toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=SomeSize,height=SomeSize`
); } catch (error) { console.log(error); } }; */

<style scoped>
@media (max-width: 437px) {
  .register-form {
    width: 100%;
  }
  .register-comp {
    padding: 0 15px;
  }
}
</style>
