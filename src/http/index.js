import axios from "axios";
import Cookies from "js-cookie";

export const auth = axios.create({
  baseURL: "http://api.chat-roulet.ru/api/auth",
  method: "*",
});

export const global = axios.create({
  baseURL: "http://api.chat-roulet.ru/api/",
  headers: {
    Authorization: Cookies.get("accessToken"),
  },
});
