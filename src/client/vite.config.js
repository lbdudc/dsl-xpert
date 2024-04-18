import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vuetify from "vite-plugin-vuetify";
import path from "path";
import dotenv from 'dotenv';

// get port from env file
dotenv.config();

const CLIENT_PORT = process.env.CLIENT_PORT || 5173;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vuetify({ autoImport: true })],
  server: {
    port: CLIENT_PORT
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, ""),
    },
  },
});
