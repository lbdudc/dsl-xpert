<script setup>
import { onMounted, ref, computed } from "vue";
import ModelCardVue from "./ModelCard.vue";
import ModelListTable from "./ModelListTable.vue";
import { useRouter } from "vue-router";
import { fetchModels, deleteModel } from "@services/modelService";
import { useToast } from "primevue/usetoast";
import { modelDeveloperItems } from "@/consts/model";

const router = useRouter();
const toast = useToast();

// computed models based on search
const search = ref("");

const modelsSearch = computed(() => {

  // multiply the models to simulate a bigger list
  return models.value.filter((model) =>
    model.name.toLowerCase().includes(search.value.toLowerCase())
  ).filter(model => selectedFilter.value ? model.developer === selectedFilter.value.code : true);
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

const visible = ref(false);
const modelForDeletion = ref(null);
const selectedFilter = ref(null);

const viewSelected = ref("cards");
const selectOptions = ref([
  { icon: 'pi pi-th-large', value: 'cards' },
  { icon: 'pi pi-bars', value: 'list' },
]);


onMounted(async () => {
  fetchModels().then((data) => {
    models.value = data;
  });
});

const openDialog = (model) => {
  modelForDeletion.value = model;
  visible.value = true;
};

const deleteModelReq = async () => {
  try {
    await deleteModel(modelForDeletion.value._id)
  } catch (error) {
    console.error(error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'Could not delete model', life: 5000 });
    return;
  }
  models.value = models.value.filter((model) => model._id !== modelForDeletion.value._id);
  visible.value = false;
  toast.add({ severity: 'success', summary: 'Success', detail: 'Model deleted', life: 5000 });
};
</script>
<template>
  <section class="flex flex-col gap-4 mt-0 py-4 items-center overflow-x-hidden">
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

        <!-- FILTERS -->
        <Divider class="hidden md:block" layout="vertical" />
        <Dropdown showClear v-model="selectedFilter" :options="modelDeveloperItems" optionLabel="name"
          placeholder="Filter Model Type" class="w-full md:w-auto" />

        <!-- Button to change from cards to list -->
        <SelectButton v-model="viewSelected" :options="selectOptions" optionLabel="value" optionValue="value"
          dataKey="value" aria-labelledby="custom">
          <template #option="slotProps">
            <i :class="slotProps.option.icon"></i>
          </template>
        </SelectButton>
      </div>
    </section>

    <!-- CARDS -->
    <section v-if="viewSelected == 'cards'"
      class="grid grid-cols-1 gap-4 w-full pt-8 px-8 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
      <ModelCardVue v-for="model in modelsSearch" :key="model.id" :model="model" @delete="openDialog" />
    </section>
    <section v-else-if="viewSelected == 'list'" class="w-full px-8">
      <ModelListTable :models="modelsSearch" @delete="openDialog" />
    </section>

    <Dialog v-model:visible="visible" header="Delete Model" :style="{ width: '40vw' }">
      <div class="flex flex-col gap-4 mb-4">
        <p>
          Are you sure you want to delete the model <strong>{{ modelForDeletion.name }}</strong>?
        </p>
      </div>
      <div class="flex justify-end gap-2">
        <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
        <Button type="button" label="Delete" @click="deleteModelReq"></Button>
      </div>
    </Dialog>
  </section>
</template>

<style lang="scss" scoped></style>
