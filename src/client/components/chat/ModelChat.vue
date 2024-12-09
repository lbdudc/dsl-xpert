<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { fetchModel } from "@services/modelService";
import ChatVue from "./components/Chat.vue";
import ModelDetailVue from "./components/ModelDetail.vue";
import HiddenValidator from "@/components/validator/HiddenValidator.vue";

const route = useRoute();
const router = useRouter();

const model = reactive({});
const isSmallScreen = ref(window.innerWidth < 768);
const visibleSidebar = ref(false);

const loading = ref(true);
const loadingValidator = ref(true);

const chatMessage = ref({});

onMounted(async () => {
  if (!route.params.id) {
    router.push({ name: "NotFound" });
    return;
  }

  try {
    const res = await fetchModel(route.params.id);
    Object.assign(model, res);
  } catch (err) {
    router.push({ name: "NotFound" });
    return;
  }

  loading.value = false;

  if (model.grammarType.code == "no-grammar-validator") {
    loadingValidator.value = false;
  }

  window.addEventListener("resize", () => {
    isSmallScreen.value = window.innerWidth < 768;
  });
});
const visible = ref(false);

let langiumEditor;
const textMessage = ref();
const textIndex = ref();

const addMessage = (res) => {
  const { text, index } = res;

  textMessage.value = text;
  textIndex.value = index;

  // validate the message
  if (model.grammarType.code == "langium") {
    refreshDSL();
  }
};

const outputValidation = (res) => {
  const { diagnostics, self } = res;
  langiumEditor = self;
  // Get the validation errors from the hidden component component
  if (!textMessage.value || !textIndex.value) return;

  chatMessage.value = {
    errors: diagnostics,
    text: textMessage.value,
    index: textIndex.value,
  }
};

const validatorLoaded = (res) => {
  langiumEditor = res;
  loadingValidator.value = false;
};


const refDSL = ref(false);

const refreshDSL = () => {
  refDSL.value = !refDSL.value;

  setTimeout(() => {
    langiumEditor.editorApp.editor.getModel().setValue(textMessage.value);
  }, 1000);
};

const forceRefresh = (res) => {
  langiumEditor = res;
};

</script>

<template>
  <div class="flex flex-col h-full">
    <Sidebar v-model:visible="visibleSidebar" @hide="visible = false" class="w-full">
      <template #header>
        <h2 class="text-xl font-bold">Model Details</h2>
      </template>
      <ModelDetailVue :model="model" />
    </Sidebar>

    <div v-if="!loading && !loadingValidator" class="w-screen h-screen overflow-hidden flex flex-row">
      <div v-if="!isSmallScreen" class="model-container w-1/3 h-full">
        <ModelDetailVue :model="model" />
      </div>
      <div v-else>
        <!-- Absolute position at the left middle screen -->
        <Button @click="visibleSidebar = true" rounded severity="secondary" icon="pi pi-arrow-right"
          class="fixed top-1/2 left-1 transform -translate-y-1/2" />
      </div>
      <ChatVue :model="model" class="flex flex-grow w-2/3" @add:message="addMessage" :chatMessage="chatMessage" />
    </div>
    <div v-else class="flex items-center justify-center h-full">
      <ProgressSpinner />
    </div>
    <!-- Hidden model validator -->
    <div v-if="model?.grammarType?.code == 'langium'">
      <HiddenValidator v-show="false" :model="model" @validate="outputValidation" @loaded="validatorLoaded"
        :refSignal="refDSL" @refresh="forceRefresh" />
    </div>
  </div>
</template>

<style scoped>
.model-container {
  height: 100%;
  overflow-y: auto;
}
</style>
