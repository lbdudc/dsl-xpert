
<script setup>
import { onMounted, ref } from "vue";
import ModelCardVue from "./ModelCard.vue";

const SERVER_URL = `${import.meta.env.SERVER_URL || "http://localhost:5000"}`;

const modelCardExamples = ref([]);

onMounted(() => {
  fetchModels();
});

const fetchModels = async () => {
  const res = await fetch(`${SERVER_URL}/api/models`);

  if (!res.ok) {
    console.error("Failed to fetch models");
    return;
  }

  const data = await res.json();
  modelCardExamples.value = data;
};
</script>
<template>
  <div class="container px-4 md:px-6">
    <div class="flex flex-col gap-6">
      <div class="grid gap-2">
        <h1 class="text-3xl font-bold tracking-tighter sm:text-4xl">Models</h1>
        <p
          class="text-gray-500 leading-loose sm:text-xl/relaxed dark:text-gray-400"
        >
          Create a new model or manage existing ones.
        </p>
      </div>
      <div
        class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between lg:gap-4"
      >
        <a
          href="#"
          class="inline-flex h-10 p-3 items-center justify-center rounded-md border border-gray-200 bg-white text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
        >
          New Model
        </a>
        <div
          class="flex items-center space-x-2 text-sm/relaxed md:space-x-4 lg:space-x-6"
        >
          <div class="flex items-center space-x-1">
            <label for="search" class="text-sm">Search</label>
            <input
              id="search"
              type="text"
              placeholder="Search models"
              class="border rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
          </div>
        </div>
      </div>

      <!-- CARDS -->
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <ModelCardVue
          v-for="model in modelCardExamples"
          :key="model.id"
          :model="model"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
</style>