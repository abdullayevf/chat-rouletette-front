import { reactive, computed, ref } from "vue";
import { defineStore } from "pinia";
import Cookies from "js-cookie";

export const useUserStore = defineStore("userStore", () => {
  const user = reactive({
    details: Cookies.get("user") ? JSON.parse(Cookies.get("user")) : {},
    accessToken: Cookies.get("accessToken") ? Cookies.get("accessToken") : "",
    refreshToken: Cookies.get("refreshToken") ? Cookies.get("accessToken") : "",
  });

  async function setUser(payload) {
    user.details = payload;
    if (Cookies.get("user")) {
      Cookies.remove("user");
      Cookies.set("user", JSON.stringify(payload));
    } else {
      Cookies.set("user", JSON.stringify(payload));
    }
  }

  async function updateUser(key, value) {
    user.details[key] = value;

    Cookies.remove("user");
    Cookies.set("user", JSON.stringify(user));
  }

  async function setToken(payload, exp, type) {
    if (type === "acc") {
      user.accessToken = payload;
      if (Cookies.get("accessToken")) {
        Cookies.remove("accessToken");
        Cookies.set("accessToken", payload, { expires: exp });
      } else {
        Cookies.set("accessToken", payload);
      }
    } else {
      user.refreshToken = payload;
      if (Cookies.get("refreshToken")) {
        Cookies.remove("refreshToken");
        Cookies.set("refreshToken", payload, { expires: exp });
      } else {
        Cookies.set("refreshToken", payload);
      }
    }
  }

  return {
    user,
    setUser,
    setToken,
    updateUser,
  };
});
