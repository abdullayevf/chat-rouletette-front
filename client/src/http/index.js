import axios from "redaxios";
import Cookies from "js-cookie";

export const auth = axios.create({
  baseURL: "https://api.chat-roulet.ru/api/auth",
});

export const universal = axios.create({
  baseURL: "http://api.chat-roulet.ru/api/",
  headers: {
    Authorization: Cookies.get("accessToken"),
  },
});
