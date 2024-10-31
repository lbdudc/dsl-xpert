<script setup>
import { ref } from "vue";
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import NotFoundVue from "../404.vue";
import ChatVue from "./components/Chat.vue";
import ModelDetailVue from "./components/ModelDetail.vue";

const SERVER_URL = `${
  import.meta.env.VITE_SERVER_URL || "http://localhost:5000"
}`;

const route = useRoute();

const id = route.params.id;

const show404 = ref(false);
const model = ref(null);

onMounted(() => {
  fetchModel();
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
  <div v-if="model" class="w-screen h-[calc(100vh-70px)] flex flex-row">
    <div class="model-container w-1/3 h-full">
      <ModelDetailVue :model="model" />
    </div>
    <ChatVue :model="model" class="flex flex-grow w-2/3" />
  </div>
  <div v-else>
    <div v-if="show404"><NotFoundVue /></div>
    <div v-else>Loading...</div>
  </div>
</template>

<style scoped>
.model-container {
  height: 100%;
  overflow-y: auto;
}
</style>
