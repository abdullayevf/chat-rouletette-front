import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import ReportView from "../components/TheReport.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/report",
      name: "report",
      component: ReportView,
    },
    {
      path: "/yandex",
      name: "yandex",
      component: () => import("../views/YandexView.vue"),
    },
    {
      path: "/google",
      name: "google",
      component: () => import("../views/GoogleView.vue"),
    },
    {
      path: "/vk",
      name: "vkontakte",
      component: () => import('../views/VkView.vue')
    },
    {
      path: "/loading",
      name: "loading",
      component: () => import("../views/LoadingView.vue"),
    },
  ],
});

export default router;
