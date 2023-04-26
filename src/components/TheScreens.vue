<script setup>
import {
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  FaceSmileIcon,
  ExclamationCircleIcon,
} from "@heroicons/vue/24/solid";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import { ref } from "vue";
import TheCountries from "./TheCountries.vue";
import { useSearchPartner } from "../stores/index";
import { socket, state } from "../socket";

const searchPartnerStore = useSearchPartner();

const isMute = ref(false);
const volume = ref(23);
const reportVisible = ref(false);

const emits = defineEmits(["toggleReportEvent"]);

const toggleReport = () => {
  reportVisible.value = !reportVisible.value;
  emits("toggleReportEvent", reportVisible.value);
};

const toggleSound = () => {
  if (!isMute.value) {
    volume.value = 0;
  } else {
    volume.value = 100;
  }
  isMute.value = !isMute.value;
};
</script>
<template>
  <div class="wrapper">
    <div class="top-0 grid w-full grid-cols-2 screens">
      <div
        class="max-h-[682px] relative xl:h-[640px] xl:aspect-auto aspect-square screen_first bg-gray-600"
      >
        <ExclamationCircleIcon
          @click="toggleReport"
          class="absolute hidden w-8 h-8 transition-all opacity-50 cursor-pointer report-icon fill-white hover:opacity-100 top-4 right-4"
        ></ExclamationCircleIcon>

        <div
          class="absolute bottom-0 flex w-full p-2 space-x-4 transition opacity-0 bg-[#0000007e] controller hover:opacity-100"
        >
          <!-- should be binded  -->
          <button @click="toggleSound()" class="">
            <SpeakerWaveIcon
              v-if="!isMute"  
              class="w-6 h-6 transition fill-gray-400 hover:fill-white"
            ></SpeakerWaveIcon>
            <SpeakerXMarkIcon
              v-else
              class="w-6 h-6 transition fill-gray-400 hover:fill-white"
            ></SpeakerXMarkIcon>
          </button>
          <input
            min="0"
            max="100"
            class="w-full cursor-pointer"
            type="range"
            v-model="volume"
            id="volume-slider"
          />
        </div>
      </div>

      <div
        class="bg-black relative max-h-[682px] xl:h-[640px] xl:aspect-auto aspect-square screen_second"
      ></div>
    </div>

    <div class="flex w-full functions h-[100vh - 682px]">
      <div
        class="flex flex-col items-center flex-1 gap-2 p-2 space-x-1 text-2xl font-medium md:flex-row functions-left"
      >
        <button
          @click="socket.connect()"
          :disabled="searchPartnerStore.loading"
          class="flex-1 w-full h-full bg-blue-400 rounded-md disabled:bg-gray-400"
        >
          {{ state.connected ? "Connected" : "Старт" }}
        </button>
        <button
          :disabled="searchPartnerStore.loading"
          class="flex-1 w-full h-full bg-red-400 rounded-md disabled:bg-gray-400"
        >
          Стоп
        </button>
        <button
          :disabled="searchPartnerStore.loading"
          @click="searchPartnerStore.toggleCountrySearch(true)"
          class="flex items-center justify-center flex-1 w-full h-full space-x-2 bg-gray-200 rounded-md disabled:bg-gray-400"
        >
          <p v-if="searchPartnerStore.loading">Загрузка...</p>
          <p v-else class="flex items-center">
            Cтрана:
            <img
              class="ml-2"
              :src="`https://flagcdn.com/w40/${searchPartnerStore.country.toLowerCase()}.webp`"
              alt=""
            />
          </p>
        </button>
        <button
          @click="searchPartnerStore.toggleGender()"
          :disabled="searchPartnerStore.loading"
          class="flex-1 w-full h-full bg-gray-200 rounded-md disabled:bg-gray-400"
        >
          Пол: {{ searchPartnerStore.gender === "male" ? "🙍🏻‍♂️" : "🙍🏻‍♀️" }}
        </button>
      </div>

      <div class="relative flex flex-1 gap-2 m-2 bg-white rounded-md">
        <div class="w-full chat">
          <div class="chat_msgs"></div>
          <hr />
          <div class="absolute bottom-0 flex w-full p-2 border-t-2 chat_text">
            <input
              type="text"
              name="chat_text"
              id="chat_text"
              class="flex-1 outline-none"
              placeholder="Введите сюда текст сообщения и нажмите Enter"
            />
            <FaceSmileIcon
              class="w-8 h-8 cursor-pointer fill-gray-300"
            ></FaceSmileIcon>
          </div>
        </div>
      </div>
    </div>
    <TheCountries />
  </div>
</template>

<style scoped>
.screen_first:hover .report-icon {
  display: block;
}
.functions-left {
  height: calc(100vh - 682px);
}

.functions-left button {
  transition: 0.3s all;
}
.functions-left button:hover {
  box-shadow: inset 0 0 10px black;
}
</style>
