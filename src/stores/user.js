import { reactive, computed, ref } from "vue";
import { defineStore } from "pinia";
import Cookies from "js-cookie";

export const useUserStore = defineStore("userStore", () => {
  const user = reactive({});
  const token = ref("");

  async function setUser(payload) {
    user = payload;
    if (Cookies.get("user")) {
      Cookies.remove("user");
      Cookies.set("user", JSON.stringify(payload));
    } else {
      Cookies.set("user", JSON.stringify(payload));
    }
  }

  async function setToken(payload) {
    token = payload;
    if (Cookies.get("accessToken")) {
      Cookies.remove("accessToken");
      Cookies.set("accessToken", payload);
    } else {
      Cookies.set("accessToken", payload);
    }
  }

  return {
    user,
    setUser,
    token,
    setToken
  };
});
