<script setup>
const props = defineProps({
  model: {
    type: Object,
    required: true,
  },
});
</script>
<template>
  <v-card class="bg-white rounded-lg shadow-md">
    <v-card-title>
      <h2 class="text-base font-semibold">{{ props.model.name }}</h2>
    </v-card-title>

    <v-card-subtitle>
      {{ props.model.description }}
    </v-card-subtitle>

    <v-card-text>
      <v-chip class="text-xs" color="green" variant="outlined" size="small">
        {{ props.model.developer }}
      </v-chip>
      <v-chip class="text-xs" color="blue" variant="outlined" size="small">
        {{ props.model.modelType }}
      </v-chip>
    </v-card-text>
    <v-card-actions>
      <button
        class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
      >
        Chat
      </button>
    </v-card-actions>
  </v-card>
</template>


<style lang="scss" scoped>
</style>