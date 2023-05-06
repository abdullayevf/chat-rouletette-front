import { computed, reactive } from "vue";
import { auth } from "../http/index";
import { useSearchPartner } from "../stores/searchPartner";
import { useUserStore } from "../stores/user";
import axios from "axios";

export const useGoogleLogin = () => {
  // important urls to access user's info
  const rootUrl = `https://accounts.google.com/o/oauth2/v2/auth`;
  const getUserUrl = `https://www.googleapis.com/oauth2/v3/userinfo?access_token=`;

  const searchPartner = useSearchPartner();
  const userStore = useUserStore();

  // basic configuration for request
  const options = {
    client_id: import.meta.env.VITE_GOOGLE_APP,
    redirect_uri: import.meta.env.VITE_GOOGLE_REDIRECT,
    response_type: "token",
    scope:
      "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/user.gender.read https://www.googleapis.com/auth/user.gender.read openid",

    include_granted_scopes: "true",
    state: "pass-through value",
  };

  // making full url
  const qs = new URLSearchParams(options);

  const fullUrl = computed(() => {
    return `${rootUrl}?${qs.toString()}`;
  });

  // after this func runs, new window opens and user selects his account
  const googleLogin = async () => {
    try {
      await searchPartner.setLoading(true);

      const openedWindow = window.open(
        fullUrl.value,
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

      // parsing hash to get access_token from url
      const hash = window.location.hash.substring(1);
      const result = computed(() => {
        return hash.split("&").reduce(function (result, item) {
          const parts = item.split("=");
          result[parts[0]] = parts[1];
          return result;
        }, {});
      });

      // send request to get userinfo
      const user = await axios.get(`${getUserUrl}${result.value.access_token}`);

      const data = await user.data;

      // make username by cutting email (dasturchioka@gmail.com => dasturchioka)
      const username = computed(() => {
        return data.email.substring(0, data.email.lastIndexOf("@"));
      });

      // making userinfo object
      const userInfo = reactive({
        username: username.value,
        email: data.email,
        firstname: data.given_name,
        lastname: data.family_name,
        gender: data.gender ? data.gender : "male",
        googleId: data.sub,
      });

      // added to store/cookie
      await userStore.setUser(userInfo);

      const response = await auth.post(`/google-oauth`, { ...userInfo });

      // set token which is from server (not from google)
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
    fullUrl,
    googleLogin,
    getUserData,
  };
};
