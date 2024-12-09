<script setup>
import { onMounted, ref, computed } from "vue";
import ModelCardVue from "./ModelCard.vue";
import { useRouter } from "vue-router";
import { fetchModels } from "@services/modelService";

const router = useRouter();

// computed models based on search
const search = ref("");

const modelsSearch = computed(() => {

  // multiply the models to simulate a bigger list
  return models.value.filter((model) =>
    model.name.toLowerCase().includes(search.value.toLowerCase())
  );
});

const models = ref([]);

const modelCreateItems = [
  // add to query params ?m=template
  { label: "OpenAI", command: () => router.push({ name: "ModelCreate", query: { m: "openai" } }) },
  { label: "Hugging Face Inference", command: () => router.push({ name: "ModelCreate", query: { m: "huggingface-inference" } }) },
  { label: "Hugging Face Custom Model", command: () => router.push({ name: "ModelCreate", query: { m: "huggingface-custom" } }) },
  { label: "Web Llm", command: () => router.push({ name: "ModelCreate", query: { m: "webllm" } }) },
  { label: "Curl Custom", command: () => router.push({ name: "ModelCreate", query: { m: "curl" } }) },
];


onMounted(async () => {
  fetchModels().then((data) => {
    models.value = data;
  });
});
</script>
<template>
  <section class="flex flex-col gap-4 mt-0 py-4 items-center overflow-x-hidden">
    <!-- HEADER -->
    <section class=" flex flex-col gap-2 items-center">
      <h1 class="text-3xl font-bold tracking-tighter sm:text-4xl">Models</h1>
      <p class="text-gray-500 leading-loose sm:text-xl/relaxed">
        Create a new model or manage existing ones.
      </p>
      <div class="flex gap-4 flex-col w-screen px-8 md:px-0 md:w:full md:flex-row md:justify-center">

        <SplitButton fluid label="New Model" @click="router.push({ name: 'ModelCreate', query: { m: 'openai' } })"
          :model="modelCreateItems" class="w-full md:w-auto" severity="success" icon="pi pi-plus" />

        <IconField>
          <InputIcon class="pi pi-search" />
          <InputText fluid v-model="search" placeholder="Search models" />
        </IconField>

      </div>
    </section>

    <!-- CARDS -->
    <section class="grid grid-cols-1  gap-4 w-full pt-8 px-8 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
      <ModelCardVue v-for="model in modelsSearch" :key="model.id" :model="model" />
    </section>
  </section>
</template>

<style lang="scss" scoped></style>
