import axios from "axios";
import Cookies from "js-cookie";

export const auth = axios.create({
  baseURL: "http://45.147.177.43:3000/api/auth",
  method: "*",
});

export const global = axios.create({
  baseURL: "http://45.147.177.43:3000/api/",
  headers: {
    Authorization: Cookies.get("accessToken"),
  },
});
