import { reactive } from "vue";
import { io } from "socket.io-client";

export const state = reactive({
  connected: false,
  fooEvents: [],
  barEvents: [],
});

const URL = `http://45.147.177.43:3000/api`;
export const socket = {}

// socket.on("connect", (err) => {
//   state.connected = true;
// });

// socket.on("disconnect", () => {
//   state.connected = false;
// });
