<script setup>
import { useRouter } from "vue-router";

const props = defineProps({
  model: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["delete"]);

const router = useRouter();

const goToDetail = () => {
  router.push({ name: "ModelChat", params: { id: props.model.name } });
};

const goToForm = () => {
  router.push({ name: "ModelForm", params: { id: props.model.name }, query: { m: "openai" } });
};

const sendDelete = () => {
  emit("delete", props.model);
};

</script>
<template>
  <Card @click="goToDetail()" class="flex flex-col hover:cursor-pointer 
  justify-between
  min-h-[300px] bg-gradient-to-tr from-zinc-900" :class="{
    '!to-green-700': props.model.developer === 'openai',
    '!to-yellow-700': props.model.developer === ('huggingface-inference' || 'huggingface-vustom'),
    '!to-indigo-700': props.model.developer === 'webllm',
    '!to-red-700': props.model.developer === 'curl',
  }" :pt="{
    body: {
      class: [
        'h-full',
      ]
    },
    content: {
      class: [
        'flex-1',
      ]
    }
  }">
    <template #title>
      <h2 class=" text-lg font-bold text-white">
        {{ props.model.name }}
      </h2>
    </template>

    <template #subtitle>
      <div class="flex flex-wrap gap-2">
        <Chip :label="props.model.developer" icon="pi pi-user" class="text-xs" />
        <Chip :label="props.model.modelType" icon="pi pi-desktop" class="text-xs text-ellipsis overflow-hidden ..." />
        <Chip :label="props.model.grammarType.code" icon="pi pi-book"
          class="text-xs text-ellipsis overflow-hidden ..." />
      </div>
    </template>

    <template #content>
      <!-- Max 3 lines of text -->
      <span class="text-sm  line-clamp-3  h-full">
        {{ props.model.description }}
      </span>
    </template>

    <!-- always at the bottom -->
    <template #footer class="flex justify-between items-center flex-1">
      <div class="flex gap-4">
        <ConfirmPopup></ConfirmPopup>
        <Button label="Chat" class="w-full" @click.stop="goToDetail()" icon="pi pi-comments" />
        <Button @click.stop="goToForm()" rounded variant="text" severity="warn" icon="pi pi-pencil" />
        <Button @click.stop="sendDelete()" rounded variant="text" severity="danger" icon="pi pi-trash" />
      </div>
    </template>
  </Card>
</template>

<style scoped></style>
