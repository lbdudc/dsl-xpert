<script setup>
import { Menubar } from "primevue";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const baseURL = import.meta.env.BASE_URL;

const items = ref([]);
</script>

<template>
  <Menubar :model="items">
    <template #start @click="router.push({ name: 'Home' })">
      <router-link class="flex items-center" :to="baseURL">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6 mr-6">
          <rect width="16" height="20" x="4" y="2" rx="2" ry="2"></rect>
          <path d="M9 22v-4h6v4"></path>
          <path d="M8 6h.01"></path>
          <path d="M16 6h.01"></path>
          <path d="M12 6h.01"></path>
          <path d="M12 10h.01"></path>
          <path d="M12 14h.01"></path>
          <path d="M16 10h.01"></path>
          <path d="M16 14h.01"></path>
          ç
          <path d="M8 10h.01"></path>
          <path d="M8 14h.01"></path>
        </svg>
        <h1 class="text-left text-xl font-bold">DSL-Xpert</h1>
      </router-link>
    </template>
    <template #end>
      <div class="flex items-center gap-4 mr-2">
        <Button label="about" variant="text" @click="router.push({ name: 'About' })" />
        <a href="https://github.com/lbdudc/dsl-xpert" target="_blank">
          <i class="pi pi-github"></i>
        </a>
      </div>
    </template>
  </Menubar>
</template>

<style scoped>
.p-menubar {
  background-color: var(--p-primary-color);
  color: var(--p-surface-100);
  border-color: var(--p-primary-color);
  border: 0;
  border-radius: 0px;
}

@media (prefers-color-scheme: dark) {
  .p-menubar {
    background-color: var(--p-card-background);
    color: var(--p-card-color);
    border-color: var(--p-card-background);
    border: 0;
    border-radius: 0px;
  }
}
</style>
