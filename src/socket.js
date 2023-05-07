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

export const findNewRoom = (gender, country, userId) => {
  socket.emit("findRoom", {userId, country, gender});
  
  console.log(gender, country, userId);
};

socket.on("onFindRoom", (data) => {
  console.log(data);
});

socket.on("onException", (data) => {
  console.log(data);
});

