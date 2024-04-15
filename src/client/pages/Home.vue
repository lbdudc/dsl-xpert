<script setup>
import ModelListVue from "@/components/models/ModelList.vue";
</script>

<template>
  <section
    class="flex flex-col gap-10 justify-center items-center bg-white dark:bg-gray-900"
  >
    <ModelListVue />
  </section>
</template>

<style lang="css" scoped>
#dropzone {
  animation: spin 40s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
