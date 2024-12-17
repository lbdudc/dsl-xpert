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
  <div class="min-h-[300px] rounded-md  bg-gradient-to-r  p-1" :class="{
    'from-green-500 via-emerald-500 to-teal-500': props.model.developer === 'openai',
    'from-yellow-400 via-orange-500 to-yellow-600': props.model.developer === ('huggingface-inference') || (props.model.developer === 'huggingface-custom'),
    'from-purple-500 via-indigo-500 to-blue-500': props.model.developer === 'webllm',
    'from-pink-500 via-red-500 to-orange-500': props.model.developer === 'curl',
  }">
    <Card @click="goToDetail()" class="flex flex-col hover:cursor-pointer 
  justify-between  h-full w-full rounded-md " :pt="{
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
        <h2 class=" text-lg font-bold text-black dark:text-white">
          {{ props.model.name }}
        </h2>
      </template>

      <template #subtitle>
        <div class="flex flex-col flex-wrap gap-2">
          <Chip :label="props.model.developer" icon="pi pi-user" class="text-xs  bg-gradient-to-r" :class="{
            'from-green-500 via-emerald-500 to-teal-500': props.model.developer === 'openai',
            'from-yellow-400 via-orange-500 to-yellow-600': props.model.developer === ('huggingface-inference') || (props.model.developer === 'huggingface-custom'),
            'from-purple-500 via-indigo-500 to-blue-500': props.model.developer === 'webllm',
            'from-pink-500 via-red-500 to-orange-500': props.model.developer === 'curl',
          }" />
          <Chip :label="props.model.modelType" icon="pi pi-desktop"
            class="text-xs text-ellipsis overflow-hidden ... bg-gradient-to-r" :class="{
              'from-green-500 via-emerald-500 to-teal-500': props.model.developer === 'openai',
              'from-yellow-400 via-orange-500 to-yellow-600': props.model.developer === ('huggingface-inference') || (props.model.developer === 'huggingface-custom'),
              'from-purple-500 via-indigo-500 to-blue-500': props.model.developer === 'webllm',
              'from-pink-500 via-red-500 to-orange-500': props.model.developer === 'curl',
            }" />
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
  </div>
</template>

<style scoped></style>
