<script setup>
import { computed, ref } from "vue";
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import NotFoundVue from "../404.vue";
import ChatVue from "./components/Chat.vue";
import ModelDetailVue from "./components/ModelDetail.vue";

const SERVER_URL = `${import.meta.env.VITE_SERVER_URL || "http://localhost:5000"
  }`;

const route = useRoute();

const id = route.params.id;

const show404 = ref(false);
const model = ref(null);
const isSmallScreen = ref(window.innerWidth < 768);
const visibleSidebar = ref(false);

onMounted(() => {
  fetchModel();

  window.addEventListener("resize", () => {
    isSmallScreen.value = window.innerWidth < 768;
  });
});

const fetchModel = async () => {
  const res = await fetch(`${SERVER_URL}/api/models/${id}`);

  if (!res.ok) {
    show404.value = true;
    return;
  }

  const data = await res.json();
  model.value = data;
};

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
