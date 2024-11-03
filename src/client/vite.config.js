import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import Components from 'unplugin-vue-components/vite';
import { PrimeVueResolver } from '@primevue/auto-import-resolver';

import path from "path";
import dotenv from "dotenv";

// get port from env file
dotenv.config();

const CLIENT_PORT = process.env.CLIENT_PORT || 5173;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [PrimeVueResolver()]
    })
  ],
  server: {
    port: CLIENT_PORT,
    hmr: {
      overlay: false,
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, ""),
    },
  },
});
