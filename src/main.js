import { createApp } from "vue";
import { createPinia } from "pinia";
import "https://yastatic.net/s3/passport-sdk/autofill/v1/sdk-suggest-latest.js";

import vue3GoogleLogin from "vue3-google-login";

import App from "./App.vue";
import router from "./router";

import "./assets/index.css";

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.use(vue3GoogleLogin, {
  clientId:
    "306600705829-i4lqm7n3b577bk5bufjlenokpsmha64p.apps.googleusercontent.com",
});

YaAuthSuggest.init(
  {
    client_id: "24441ebc87f343c89d27a3835a18f790",
    response_type: "token",
    redirect_uri: "http://localhost:5173",
  },
  "http://localhost:5173"
)
  .then(({ handler }) => handler())
  .then((data) => console.log("Message with the token", data))
  .catch((error) => console.log("Error processing", error));

app.mount("#app");
