import { createRouter, createWebHistory } from "vue-router";

//import Login from "./views/Login.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  // routes: [
  //   {
  //     path: "/",
  //     alias: "/home",
  //     name: "home",
  //     component: Hogin,
  //   },
  // ],
});

export default router;
