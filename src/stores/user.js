import { reactive, computed, ref } from "vue";
import { defineStore } from "pinia";
import Cookies from "js-cookie";

export const useUserStore = defineStore("userStore", () => {
  const user = reactive(
    Cookies.get("user") ? JSON.parse(Cookies.get("user")) : {}
  );
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

  async function updateUser(key, value) {
    user[key] = value;

    Cookies.remove("user");
    Cookies.set("user", user);
  }

  async function setToken(payload, exp) {
    token = payload;
    if (Cookies.get("accessToken")) {
      Cookies.remove("accessToken");
      Cookies.set("accessToken", payload, { expires: exp });
    } else {
      Cookies.set("accessToken", payload);
    }
  }

  return {
    user,
    setUser,
    token,
    setToken,
    updateUser,
  };
});
