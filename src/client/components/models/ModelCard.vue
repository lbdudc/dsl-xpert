<script setup>
import { defineProps } from "vue";
// read model object from props

const props = defineProps({
  model: Object,
});
</script>
<template>
  <div
    class="bg-white rounded-lg shadow-md p-4 flex items-center justify-between space-x-4"
  >
    <img alt="Avatar" class="rounded-full h-10 w-10 object-cover" />
    <div class="space-y-1">
      <h2 class="text-base font-semibold">{{ props.model.name }}</h2>
      <p class="text-sm">
        {{ props.model.description }}
      </p>
    </div>
    <button
      class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
    >
      Edit
    </button>
  </div>
</template>


<style lang="scss" scoped>
</style>