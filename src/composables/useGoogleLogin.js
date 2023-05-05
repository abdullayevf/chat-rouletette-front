import { ref, computed } from "vue";
import { useSearchPartner } from "../stores/searchPartner";
import { useUserStore } from "../stores/user";

export const useGoogleLogin = () => {
  const rootUrl = `https://accounts.google.com/o/oauth2/v2/auth`;

  const searchPartner = useSearchPartner();
  const userStore = useUserStore();

  console.log(import.meta.env);

  const options = {
    client_id: import.meta.env.VITE_GOOGLE_APP,
    redirect_uri: import.meta.env.VITE_GOOGLE_REDIRECT,
    response_type: "token",
    scope:
      "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/user.gender.read openid",

    include_granted_scopes: "true",
    state: "pass-through value",
  };

  const qs = new URLSearchParams(options);

  const fullUrl = computed(() => {
    return `${rootUrl}?${qs.toString()}`;
  });

  const googleLogin = async () => {
    try {
      await searchPartner.setLoading(true);

      window.open(
        fullUrl.value,
        "targetWindow",
        `toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=SomeSize,height=SomeSize`
      );

      await searchPartner.setLoading(false);
    } catch (error) {
      await searchPartner.setLoading(false);
      console.log(error);
    }
  };

  const getUserData = async () => {
    try {
      console.log(window.location);
    } catch (error) {
      console.log(error);
    }
  };

  return {
    fullUrl,
    googleLogin,
    getUserData,
  };
};
