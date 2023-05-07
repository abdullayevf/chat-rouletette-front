import { reactive } from "vue";
import { io } from "socket.io-client";

export const state = reactive({
  connected: false,
  fooEvents: [],
  barEvents: [],
  inRoom: false,
  searching: false,
});
const URL = `http://api.chat-roulet.ru/`;
export const socket = io(URL);

socket.on("connect", (s) => {
  console.log("connected");
  state.connected = true;
});

socket.on("disconnect", () => {
  state.connected = false;
});

export const findNewRoom = (gender, country, userId) => {
  socket.emit("findRoom", { gender, country, userId });

  console.log(gender, country, userId);

  socket.on('onFindRoom', (data) => {
    console.log(data);
    console.log('blyat');
    console.log('data');
  })

  console.log("s");
};
