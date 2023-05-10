import { reactive } from "vue";
import { io } from "socket.io-client";
import Cookies from "js-cookie";

export const state = reactive({
  connected: false,
  fooEvents: [],
  barEvents: [],
  inRoom: false,
  searching: false,
});
const URL = `http://api.chat-roulet.ru/`;
export const socket = io(URL, {
  extraHeaders: {
    Authorization: `Bearer ${Cookies.get("accessToken")}`,
  },
});

socket.on("connect", (s) => {
  console.log("connected");
  state.connected = true;
});

socket.on("disconnect", () => {
  state.connected = false;
});

const joinToQueueEvent = async (userId) => {
  console.log("joinToQueue: ", userId);
  return socket.emit("joinToQueue", { userId });
};

const findRoomEvent = async (data) => {
  console.log("findRoomEvent: ", data);

  return socket.emit("findRoom", data);
};

export const findNewRoom = async (data) => {
  await joinToQueueEvent(data.userId);
  await findRoomEvent(data);
};

socket.on("onFindRoom", (data) => {
  console.log(data);
});

socket.on("onJoinToQueue", (data) => {
  console.log(data);
});

socket.on("onException", (data) => {
  console.log(data);
});
