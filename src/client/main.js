import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import "material-design-icons-iconfont/dist/material-design-icons.css";
// Vuetify
import "vuetify/styles";
import vuetify from "./plugins/vuetify";
// Router
import router from "./router";

createApp(App).use(router).use(vuetify).mount("#app");
