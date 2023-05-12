import { reactive } from "vue";
import { io } from "socket.io-client";
import Cookies from "js-cookie";
import { useChatStore } from "./stores/chat";

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

const joinToQueueEvent = async (userId) => {
  console.log("joinToQueue: ", userId);
  socket.emit("joinToQueue", { userId });
};

const findRoomEvent = async (data) => {
  console.log("findRoomEvent: ", data);
  socket.emit("findRoom", data);
};

export const findNewRoom = async (data) => {
  state.loading = true;
  state.searching = true;
  
  await joinToQueueEvent(data.userId);

  setTimeout(() => {
    findRoomEvent(data);
  }, 1000);

  socket.on("onException", (data) => {
    state.searching = false;
    state.loading = false;
    console.log(data);
  });
};

socket.on("onFindRoom", async (data) => {
  const chatStore = useChatStore();

  await chatStore.createOffer(data.roomId)

  console.log(data);
});

socket.on("onJoinToQueue", (data) => {
  console.log(data);
});
