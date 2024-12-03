import { createRouter, createWebHistory } from "vue-router";

// has to be imported here to avoid problems when loading the workers
import Playground from "@/components/validator/Playground.vue";

const base = import.meta.env.BASE_URL;

const routes = [
  {
    path: base,
    name: "home",
    component: () => import("./pages/Home.vue"),
  },
  {
    path: `${base}models/new`,
    name: "ModelCreate",
    component: () => import("@/components/models/form/ModelForm.vue"),
  },
  {
    path: `${base}models/:id/chat`,
    name: "ModelChat",
    component: () => import("@/components/chat/ModelChat.vue"),
  },
  {
    path: `${base}models/:id/edit`,
    name: "ModelForm",
    component: () => import("@/components/models/form/ModelForm.vue"),
  },
  {
    path: `${base}playground`,
    name: "Playground",
    component: Playground
  },
  {
    path: `${base}404`,
    name: "NotFound",
    component: () => import("@/components/404.vue"),
  }
];

const history = createWebHistory();

const router = createRouter({
  history,
  routes,
});

export default router;
