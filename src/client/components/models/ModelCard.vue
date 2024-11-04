<script setup>
import { useRouter } from "vue-router";

const props = defineProps({
  model: {
    type: Object,
    required: true,
  },
});

const router = useRouter();

const goToDetail = () => {
  router.push({ name: "ModelChat", params: { id: props.model.name } });
};

const goToForm = () => {
  router.push({ name: "ModelForm", params: { id: props.model.name }, query: { m: "openai" } });
};
</script>
<template>

  <!-- Card when user hover rise te card a little -->
  <Card @click="goToDetail()"
    class="flex flex-col justify-between h-full max-h-[40vh] overflow-auto hover:cursor-pointer">
    <template #title>
      <h2 class="text-lg font-bold">
        {{ props.model.name }}
      </h2>
    </template>

    <template #subtitle>
      <div class="flex gap-2">
        <Chip :label="props.model.developer" icon="pi pi-user" class="text-xs" />
        <Chip :label="props.model.modelType" icon="pi pi-desktop" class="text-xs text-nowrap" />
      </div>
    </template>

    <template #content>
      <!-- Max 3 lines of text -->
      <span class="text-sm text-gray-500 line-clamp-3">
        {{ props.model.description }}
      </span>
    </template>

    <template #footer class="h-full">
      <div class="flex gap-4 mt-1 h-full">
        <Button @click.stop="goToForm()" label="Edit" severity="secondary" variant="text" class="w-full" />
        <Button label="Chat" class="w-full" @click.stop="goToDetail()" icon="pi pi-comments" />
      </div>

    </template>
  </Card>
</template>

<style scoped>
.p-card-body {
  height: 100% !important;
}
</style>
