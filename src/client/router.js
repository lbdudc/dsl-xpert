import { createRouter, createWebHistory } from "vue-router";

import Home from "./pages/Home.vue";

const base = import.meta.env.BASE_URL;

const routes = [
  {
    path: base,
    name: "home",
    component: Home,
  },
];

const history = createWebHistory();

const router = createRouter({
  history,
  routes,
});

export default router;
