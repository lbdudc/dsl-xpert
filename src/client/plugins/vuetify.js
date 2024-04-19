import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: "light",
  },
  icons: {
    aliases,
    defaultSet: "mdi",
    sets: {
      mdi,
    },
  },
});
