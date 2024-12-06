<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import ChatVue from "./components/Chat.vue";
import ModelDetailVue from "./components/ModelDetail.vue";
import { fetchModel } from "@services/modelService";

const route = useRoute();
const router = useRouter();

const model = reactive({});
const isSmallScreen = ref(window.innerWidth < 768);
const visibleSidebar = ref(false);

const loading = ref(true);

onMounted(async () => {
  if (!route.params.id) {
    router.push({ name: "NotFound" });
    return;
  }

  try {
    const res = await fetchModel(route.params.id);
    Object.assign(model, res);
  } catch (err) {
    router.push({ name: "NotFound" });
    return;
  }

  loading.value = false;

  window.addEventListener("resize", () => {
    isSmallScreen.value = window.innerWidth < 768;
  });
});
const visible = ref(false);

</script>

<template>
  <Sidebar v-model:visible="visibleSidebar" @hide="visible = false" class="w-full">
    <template #header>
      <h2 class="text-xl font-bold">Model Details</h2>
    </template>
    <ModelDetailVue :model="model" />
  </Sidebar>

  <div v-if="!loading" class="w-screen h-[calc(100vh-44px)] flex flex-row">
    <div v-if="!isSmallScreen" class="model-container w-1/3 h-full">
      <ModelDetailVue :model="model" />
    </div>
    <div v-else>
      <!-- Absolute position at the left middle screen -->
      <Button @click="visibleSidebar = true" rounded severity="secondary" icon="pi pi-arrow-right"
        class="fixed top-1/2 left-1 transform -translate-y-1/2" />
    </div>
    <ChatVue :model="model" class="flex flex-grow w-2/3" />
  </div>
  <div v-else class="flex items-center justify-center h-full">
    <ProgressSpinner />
  </div>
</template>

<style scoped>
.model-container {
  height: 100%;
  overflow-y: auto;
}
</style>
