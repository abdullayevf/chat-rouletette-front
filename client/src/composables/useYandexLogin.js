import { computed, reactive } from "vue";
import { auth } from "../http/index";
import { useSearchPartner } from "../stores/searchPartner";
import { useUserStore } from "../stores/user";
import axios from "redaxios";

export const useYandexLogin = () => {
  // important urls to access user's info
  const tokenUrl = `https://oauth.yandex.com/authorize?response_type=token&client_id=${
    import.meta.env.VITE_YANDEX_ID
  }`;
  const getUserUrl = `https://login.yandex.ru/info?format=json`;
 
  const searchPartner = useSearchPartner();
  const userStore = useUserStore();

  // after this func runs, new window opens and user selects his account
  const yandexLogin = async () => {
    try {
      await searchPartner.setLoading(true);

      const openedWindow = window.open(
        tokenUrl,
        "targetWindow",
        `toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=SomeSize,height=SomeSize`
      );

      let timer = setInterval(() => {
        if (openedWindow.closed) {
          window.location.reload();
          clearInterval(timer);
        } else {
          return;
        }
      }, 700);
    } catch (error) {
      await searchPartner.setLoading(false);
      console.log(error);
    }
  };

  // in the opened window, this func runs.
  const getUserData = async () => {
    try {
      await searchPartner.setLoading(true);

      // parsing hashes to get access_token from url
      const hash = window.location.hash.substring(1);
      const result = computed(() => {
        return hash.split("&").reduce(function (result, item) {
          const parts = item.split("=");
          result[parts[0]] = parts[1];
          return result;
        }, {});
      });

      // send request to get userinfo
      const user = await axios.get(getUserUrl, {
        headers: {
          Authorization: `OAuth ${result.value.access_token}`,
        },
      });

      const data = await user.data;

      // making userinfo object
      const userInfo = reactive({
        username: user.login,
        email: data.default_email,
        firstname: data.first_name,
        lastname: data.last_name,
        gender: data.sex ? data.sex : "male",
        yandexId: data.id,
      });

      // added to store/cookie
      await userStore.setUser(userInfo);

      const response = await auth.post(`/yandex-oauth`, { ...userInfo });

      // set token which is from server (not from yandex)
      await userStore.setToken(
        response.data.access_token,
        response.data.expires,
        "acc"
      );

      // update user info again
      await userStore.updateUser("userId", response.data.userId);

      await searchPartner.setLoading(false);
    } catch (error) {
      await searchPartner.setLoading(false);
      console.log(error);
    } finally {
      await searchPartner.setLoading(false);
      window.close();
    }
  };

  return {
    yandexLogin,
    getUserData,
  };
};
