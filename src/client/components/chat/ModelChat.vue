<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import NotFoundVue from "../404.vue";
import ChatVue from "./components/Chat.vue";
import ModelDetailVue from "./components/ModelDetail.vue";
import { fetchModel } from "@services/modelService";

const route = useRoute();
const show404 = ref(false);

const model = ref(null);
const isSmallScreen = ref(window.innerWidth < 768);
const visibleSidebar = ref(false);

onMounted(async () => {
  const res = await fetchModel(route.params.id);
  model.value = res;

  window.addEventListener("resize", () => {
    isSmallScreen.value = window.innerWidth < 768;
  });
});

</script>

<template>
  <Sidebar v-model:visible="visibleSidebar" @hide="visible = false" class="w-full">
    <template #header>
      <h2 class="text-xl font-bold">Model Details</h2>
    </template>
    <ModelDetailVue :model="model" />
  </Sidebar>

  <div v-if="model" class="w-screen h-[calc(100vh-44px)] flex flex-row">
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
  <div v-else>
    <div v-if="show404">
      <NotFoundVue />
    </div>
    <div v-else>Loading...</div>
  </div>
</template>

<style scoped>
.model-container {
  height: 100%;
  overflow-y: auto;
}
</style>
