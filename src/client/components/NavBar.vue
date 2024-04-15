<script setup>
const baseURL = import.meta.env.BASE_URL;
</script>

<template>
  <header class="flex h-16 w-full items-center text-black px-4 md:px-6">
    <router-link class="flex items-center" :to="baseURL">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="h-6 w-6 mr-6"
      >
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
      <h1 class="text-left text-xl font-bold">LLM DSL Oracle</h1>
    </router-link>
  </header>
</template>

<style lang="scss" scoped></style>
