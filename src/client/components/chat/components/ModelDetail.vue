<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { deleteModel } from "@services/modelService.js";

const router = useRouter();

const props = defineProps({
  model: {
    type: Object,
    required: true,
  },
});

const activeTab = ref(0);

const deleteModelCall = async () => {
  const { _id } = props.model;

  deleteModel(_id).then(() => {
    router.push({ name: "home" });
  }).catch((err) => {
    console.error(err);
  });
};

const goToForm = () => {
  router.push({ name: "ModelForm", params: { id: props.model.name } });
};
</script>
<template>
  <Card id="my-card">
    <template #title>
      <h1 class="text-xl tracking-tight">
        Model: {{ model.name }}
      </h1>
    </template>

    <template #subtitle>
      <span class="text-sm">
        {{ model.description }}
      </span>
      <div class="flex items-center gap-2">
        <Chip class="text-xs mr-2" size="small">{{ model.developer }}
        </Chip>
        <Chip class="text-xs" size="small">
          {{ model.modelType }}
        </Chip>
      </div>
    </template>

    <template #content>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <span class="text-sm">
          <span>Temperature:</span> {{ model.temperature }}
        </span>

        <span class="text-sm">
          <span>Seed:</span> {{ model.seed }}
        </span>

        <span class="text-sm">
          <span>Maximum length:</span> {{ model.maximumLength }}
        </span>

        <span class="text-sm">
          <span>Top K:</span> {{ model.topK }}
        </span>

        <span class="text-sm">
          <span>Top P:</span> {{ model.topP }}
        </span>

        <span class="text-sm">
          <span>Repetition penalty:</span> {{ model.repetitionPenalty }}
        </span>

        <span class="text-sm">
          <span>Stop sequences:</span>
          <Chip v-for="seq in model.stopSequences" class="text-xs" size="small" :label="seq" />
        </span>
      </div>

      <div class="mt-6">
        <h1 class="text-lg">
          <i class="pi pi-info-circle"></i>
          Model Definition
        </h1>
        <div class="text-sm max-w-full overflow-auto min-h-[200px]">
          {{ model.definition }}
        </div>
      </div>

      <div class="mt-4">
        <Tabs :value="activeTab" scrollable>
          <TabList>
            <Tab v-for="(example, index) in model.definitionExamples" :key="index" :value="index">
              Example {{ index + 1 }}
            </Tab>
          </TabList>
          <TabPanel v-for="(example, index) in model.definitionExamples" :key="index" :value="index">
            <div class="flex flex-col gap-4 min-h-[200px] max-w-full overflow-auto mt-4 px-1">
              <div class="text-sm">
                <strong>User Instruction:</strong>
                <div>{{ example.userInstruction }}</div>
              </div>
              <div class="text-sm">
                <strong>Model Answer:</strong>
                <div>{{ example.modelAnswer }}</div>
              </div>
            </div>
          </TabPanel>
        </Tabs>
      </div>
    </template>

    <template #footer>
      <div class="flex gap-2 flex-wrap justify-center">
        <Button @click="goToForm" icon="pi pi-pencil" class="w-full" severity="warn" label="Edit" />
        <Button @click="deleteModelCall" icon="pi pi-trash" class="w-full" severity="danger" label="Delete" />
      </div>
    </template>

  </Card>
</template>

<style scoped>
h1 {
  color: var(--p-button-success-background) !important;
}

#my-card {
  box-shadow: none !important;
}
</style>
