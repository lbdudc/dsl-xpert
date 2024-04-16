<script setup>
import { ref } from "vue";

defineProps({
  model: {
    type: Object,
    required: true,
  },
});
</script>
<template>
  <v-card class="flexcard">
    <v-card-title>
      <h1
        class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
      >
        Model: {{ model.name }}
      </h1>
    </v-card-title>

    <v-card-subtitle class="py-4"> {{ model.description }} </v-card-subtitle>

    <v-card-text>
      <div>Developer: {{ model.developer }}</div>
      <div>Model Type: {{ model.modelType }}</div>
      <div>Temperature: {{ model.temperature }}</div>
      <div>Seed: {{ model.seed }}</div>

      <div class="mt-10">Definition: {{ model.definition }}</div>
    </v-card-text>

    <v-card-actions class="flex justify-start">
      <v-btn color="orange" variant="text">Edit</v-btn>
      <v-btn color="red" variant="text">Delete</v-btn>
    </v-card-actions>
  </v-card>
</template>


<style scoped>
.flexcard {
  display: flex;
  flex-direction: column;
}

.flexcard .v-toolbar {
  flex: 0;
}
</style>