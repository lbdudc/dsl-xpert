<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import NavBar from "@/components/NavBar.vue";
import { useToast } from "primevue/usetoast";
const toast = useToast();
</script>

<template>
  <div class="main-container">
    <Toast position="bottom-left" />
    <NavBar />
    <router-view />
  </div>
</template>

<style scoped>
.main-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  overflow-x: hidden;
}
</style>
