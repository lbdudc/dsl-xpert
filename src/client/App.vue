<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import NavBar from "@/components/NavBar.vue";
import { useToast } from "primevue/usetoast";
const toast = useToast();
</script>

<template>
  <div class="flex flex-col h-screen w-screen">
    <Toast position="bottom-left" />
    <NavBar class="flex items-center justify-between w-full" />
    <router-view class="flex-1 overflow-y-auto" />
  </div>
</template>