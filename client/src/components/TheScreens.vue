<script setup>
import { reactive, onMounted } from "vue";
import {
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  FaceSmileIcon,
  ExclamationCircleIcon,
} from "@heroicons/vue/24/solid";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import { ref } from "vue";
import TheCountries from "./TheCountries.vue";
import { useSearchPartner } from "../stores/searchPartner";
import { useChatStore } from "../stores/chat";
import { useUserStore } from "../stores/user";
import { state, findNewRoom } from "../socket";
import TheEmojiPicker from "./TheEmojiPicker.vue";
import Cookies from "js-cookie";
import { socket } from "../socket";

const chatStore = useChatStore();
const searchPartnerStore = useSearchPartner();
const userStore = useUserStore();

const isMute = ref(false);
const volume = ref(23);
const reportVisible = ref(false);
const emojisVisible = ref(false);
const message = ref(null);
const localStreamRef = ref(null);
const remoteStreamRef = ref(null);

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

const handleEvent = (e) => {
  message.value += e;
};

const toggleEmojiVisibility = () => {
  emojisVisible.value = !emojisVisible.value;
};

const findRoomArgs = reactive({
  gender: searchPartnerStore.gender,
  country: +searchPartnerStore.countryIndex,
  userId: Cookies.get("user")
    ? JSON.parse(Cookies.get("user")).details.userId
    : "",
});

const sendMessage = async () => {
  console.log(`Message: `, message.value);
  console.log(`Room: `, chatStore.roomDetails.connected);
  if (message.value === null || !chatStore.roomDetails.connected) {
    return;
  } else {
    const text = message.value;
    const roomId = chatStore.roomDetails.id;
    const userId = Cookies.get("user")
      ? JSON.parse(Cookies.get("user")).details.userId
      : "";
    await chatStore.pushMessage({ text, roomId, userId });
    socket.emit("newMessage", { text, userId, roomId });
  }
};

onMounted(async () => {
  if (Cookies.get("accessToken") && Cookies.get("user")) {
    await chatStore.init();
    localStreamRef.value.srcObject = chatStore.localStream;
  } else {
    return;
  }
});
</script>
<template>
  <div class="wrapper">
    <div class="top-0 grid w-full grid-cols-2 screens">
      <div
        class="max-h-[682px] relative xl:h-[740px] xl:aspect-auto aspect-square screen_first bg-gray-600"
      >
        <video
          ref="remoteStreamRef"
          class="w-full h-full object-cover z-[99999]"
        ></video>
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
        class="relative max-h-[682px] xl:h-[740px] xl:aspect-auto aspect-square screen_second"
      >
        <video
          autoplay
          muted
          ref="localStreamRef"
          class="w-full h-full object-cover z-[99999]"
        ></video>
      </div>
    </div>

    <div class="flex w-full functions h-[100vh - 682px]">
      <div
        class="flex flex-col items-center flex-1 gap-2 p-2 space-x-1 text-2xl font-medium md:flex-row functions-left"
      >
        <button
          @click="findNewRoom(findRoomArgs)"
          :disabled="
            state.loading || state.inRoom || searchPartnerStore.loading
          "
          class="flex-1 w-full h-full bg-blue-400 rounded-md disabled:bg-gray-400"
        >
          {{ state.inRoom ? "Cоединенный" : "Старт" }}
        </button>
        <button
          :disabled="
            state.loading ||
            !state.inRoom ||
            state.searching ||
            searchPartnerStore.loading
          "
          class="flex-1 w-full h-full bg-red-400 rounded-md disabled:bg-gray-400"
        >
          Стоп
        </button>
        <button
          :disabled="searchPartnerStore.loading || state.loading"
          @click="searchPartnerStore.toggleCountrySearch(true)"
          class="flex items-center justify-center flex-1 w-full h-full space-x-2 bg-gray-200 rounded-md disabled:bg-gray-400"
        >
          <p v-if="searchPartnerStore.loading || state.loading">Загрузка...</p>
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
          :disabled="searchPartnerStore.loading || state.loading"
          class="flex-1 w-full h-full bg-gray-200 rounded-md disabled:bg-gray-400"
        >
          Пол: {{ searchPartnerStore.gender === "male" ? "🙍🏻‍♂️" : "🙍🏻‍♀️" }}
        </button>
      </div>

      <form
        @submit.prevent="sendMessage()"
        class="relative flex flex-1 gap-2 m-2 bg-white rounded-md"
      >
        <div class="w-full chat">
          <div class="chat_msgs">
            <p v-for="message in chatStore.messages" class="messages">
              {{ message.text }}
            </p>
          </div>
          <hr />
          <div class="absolute bottom-0 flex w-full p-2 border-t-2 chat_text">
            <input
              type="text"
              name="chat_text"
              id="chat_text"
              class="flex-1 outline-none"
              placeholder="Введите сюда текст сообщения и нажмите Enter"
              v-model="message"
            />
            <FaceSmileIcon
              @click="toggleEmojiVisibility"
              class="w-8 h-8 cursor-pointer fill-gray-300"
            ></FaceSmileIcon>
            <TheEmojiPicker v-if="emojisVisible" @emoji_click="handleEvent" />
          </div>
        </div>
      </form>
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
