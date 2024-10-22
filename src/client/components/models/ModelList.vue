<script setup>
import { onMounted, ref, computed } from "vue";
import ModelCardVue from "./ModelCard.vue";
import { useRouter } from "vue-router";

const router = useRouter();

const SERVER_URL = `${
  import.meta.env.VITE_SERVER_URL || "http://localhost:5000"
}`;

// computed models based on search
const search = ref("");

const modelsSearch = computed(() => {
  return models.value.filter((model) =>
    model.name.toLowerCase().includes(search.value.toLowerCase())
  );
});

const models = ref([]);

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
  models.value = data;
};
</script>
<template>
  <div class="container px-4 md:px-6 pt-10 min-h-[800px]">
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
        <v-btn
          class="text-none"
          variant="text"
          color="#2878ff"
          border
          @click="router.push({ name: 'ModelCreate' })"
        >
          New Model
        </v-btn>
        <div
          class="flex items-center space-x-2 text-sm/relaxed md:space-x-4 lg:space-x-6"
        >
          <div class="flex items-center space-x-2 min-w-96">
            <v-text-field
              v-model="search"
              placeholder="Search models"
              density="compact"
              hide-details
              variant="outlined"
              prepend-inner-icon="mdi-magnify"
              class="text-sm"
            ></v-text-field>
          </div>
        </div>
      </div>

      <!-- CARDS -->
      <div class="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-3">
        <ModelCardVue
          v-for="model in modelsSearch"
          :key="model.id"
          :model="model"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
