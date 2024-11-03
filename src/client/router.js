import { createRouter, createWebHistory } from "vue-router";

import Home from "./pages/Home.vue";
import ModelForm from "@/components/models/form/ModelForm.vue";
import ModelChat from "@/components/chat/ModelChat.vue";

const base = import.meta.env.BASE_URL;

const routes = [
  {
    path: base,
    name: "home",
    component: Home,
  },
  {
    path: `${base}models/new`,
    name: "ModelCreate",
    component: ModelForm,
  },
  {
    path: `${base}models/:id/chat`,
    name: "ModelChat",
    component: ModelChat,
  },
  {
    path: `${base}models/:id/edit`,
    name: "ModelForm",
    component: ModelForm,
  },
];

const history = createWebHistory();

const router = createRouter({
  history,
  routes,
});

export default router;
