<script setup>
import { ref } from "vue";
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import NotFoundVue from "../404.vue";
import ChatVue from "./components/Chat.vue";
import ModelDetailVue from "./components/ModelDetail.vue";

const SERVER_URL = `${import.meta.env.SERVER_URL || "http://localhost:5000"}`;

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
  <div v-if="model" class="w-screen flex-grow flex flex-row">
    <ModelDetailVue :model="model" class="flex flex-grow w-1/3" />
    <ChatVue :model="model" class="flex flex-grow w-2/3" />
  </div>
  <div v-else>
    <div v-if="show404"><NotFoundVue /></div>
    <div v-else>Loading...</div>
  </div>
</template>


<style scoped>
</style>