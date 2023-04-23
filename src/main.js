import { createApp } from "vue";
import { createPinia } from "pinia";

import vue3GoogleLogin from "vue3-google-login";

import App from "./App.vue";
import router from "./router";

import "./assets/index.css";

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.use(vue3GoogleLogin, {
  clientId:
    "331406513168-1j16qlitd93hjkmbocqu4ugavhgno036.apps.googleusercontent.com",
});

app.mount("#app");
