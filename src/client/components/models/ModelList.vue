
<script setup>
import ModelCardVue from "./ModelCard.vue";
import ModelFormVue from "./ModelForm.vue";

const modelCardExamples = [
  {
    id: 1,
    name: "Marketing Campaign",
    description:
      "Models for the marketing team to predict campaign performance.",
  },
  {
    id: 2,
    name: "Support Tickets",
    description: "Models for predicting ticket volume and response times.",
  },
  {
    id: 3,
    name: "Sales Forecast",
    description: "Models for predicting future sales based on historical data.",
  },
  {
    id: 4,
    name: "Sales Forecast",
    description: "Models for predicting future sales based on historical data.",
  },
  {
    id: 5,
    name: "Sales Forecast",
    description: "Models for predicting future sales based on historical data.",
  },
];
</script>
<template>
  <ModelFormVue />
  <!-- <div class="container px-4 md:px-6">
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
  <!-- <ModelCardVue /> -->
  <!-- <div class="grid gap-4">
        <ModelCardVue
          v-for="model in modelCardExamples"
          :key="model.id"
          :model="model"
        />
      </div> -->
  <!-- </div> -->
  <!-- </div> -->
</template>

<style lang="scss" scoped>
</style>