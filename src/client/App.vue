<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import NavBar from "@/components/NavBar.vue";
</script>

<template>
  <v-container fluid class="main-container">
    <NavBar />
    <router-view />
  </v-container>
</template>

<style scoped>
.main-container {
  min-height: 100vh;
  min-width: 100vw;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
