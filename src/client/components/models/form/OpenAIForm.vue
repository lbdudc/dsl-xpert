<script setup>
import { reactive } from "vue";
import { modelTypeItems } from '@consts/openai';

const props = defineProps({
  model: {
    type: Object,
    required: true
  }
});
const model = reactive(props.model);
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Select name="modelType" v-model="model.modelType" :options="modelTypeItems" label="Model type"
        placeholder="Select a model type">
      </Select>
      <Password fluid v-model="model.apiKey" name="apiKey" label="OpenAI API key" placeholder="Enter OpenAI API key"
        autocomplete="off" :feedback="false" toggleMask>
      </Password>
    </div>
  </div>
</template>

<style scoped>
.flexcard {
  display: flex;
  flex-direction: column;
}

.flexcard .v-toolbar {
  flex: 0;
}

.outlined-card {
  border: 1px solid rgba(0, 0, 0, 0.12);
}

.v-card {
  background-color: var(--v-background-base) !important;
  color: var(--v-text-base) !important;
}
</style>
