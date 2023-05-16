import { reactive } from "vue";
import { io } from "socket.io-client";
import Cookies from "js-cookie";
import { useChatStore } from "./stores/chat";
import { useToast } from "vue-toastification";

const toast = useToast();

export const state = reactive({
  connected: false,
  fooEvents: [],
  barEvents: [],
  inRoom: false,
  searching: false,
  loading: false,
});
const URL = import.meta.env.DEV
  ? import.meta.env.VITE_SERVER_HOST_DEV
  : import.meta.env.VITE_SERVER_HOST_PROD;
export const socket = io(URL, {
  extraHeaders: {
    Authorization: `Bearer ${Cookies.get("accessToken")}`,
  },
});

socket.on("connect", (s) => {
  state.connected = true;
});

socket.on("disconnect", () => {
  state.connected = false;
});

export const findNewRoom = async (data) => {
  try {
    state.loading = true;
    state.searching = true;

    socket.emit("joinToQueue", { userId: data.userId });

    setTimeout(() => {
      socket.emit("findRoom", data);
    }, 1000);
  } catch (error) {
    console.log(error);
    toast.error(error.message);
    state.loading = false;
    state.searching = false;
  }
};

socket.on("onFindRoom", async (data) => {
  try {
    const chatStore = useChatStore();
    await chatStore.createOffer(data.roomId);
    toast.success(`You connected with ${data.partner.id}`);
    await chatStore.updateRoom("connected", true);
    await chatStore.updateRoom("id", data.roomId);
    await chatStore.updateRoom("partner", data.partner.id);

    state.loading = false;
    state.searching = false;

    console.log(chatStore.roomDetails);
  } catch (error) {
    state.loading = false;
    state.searching = false;
    console.log(error);
    toast.error(error.message);
  }
});

socket.on("onOffer", async (data) => {
  try {
    const chatStore = useChatStore();

    await chatStore.createAnswer(data.offer, data.roomId);

    console.log(data);
  } catch (error) {
    console.log(error);
    toast.error(error.message);
    state.loading = false;
    state.searching = false;
  }
});

socket.on("onAnswer", async (data) => {
  const chatStore = useChatStore();

  await chatStore.addAnswer(data.answer);

  console.log(data);
});

socket.on("onJoinToQueue", (data) => {
  console.log(data);
});

socket.on("onException", (data) => {
  state.searching = false;
  state.loading = false;
  console.log(data);
});

socket.on("onNewMessage", async (data) => {
  const chatStore = useChatStore()

  await chatStore.pushMessage(data)

  console.log(chatStore.messages);
});
