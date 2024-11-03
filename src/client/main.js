import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";

// PrimeVue
import Aura from '@primevue/themes/aura';
import PrimeVue from "primevue/config";
import 'primeicons/primeicons.css'
import { Tooltip } from "primevue";
import { definePreset } from "@primevue/themes";
import customTheme from "./plugins/primevue.js"

const Noir = definePreset(Aura, customTheme);


createApp(App)
    .use(router)
    .use(
        PrimeVue,
        {
            theme: {
                preset: Noir,
                options: {
                    prefix: 'p',
                    darkModeSelector: 'system',
                    cssLayer: false
                }
            },
        }
    ).directive(
        'tooltip',
        Tooltip
    ).mount("#app");
