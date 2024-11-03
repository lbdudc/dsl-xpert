<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  grammarType: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["updateContent"]);
const monaco = ref(null);

const loadClient = async (grammarType) => {
  if (grammarType === "no grammar validator") {
    grammarType = "no-grammar-validator";
  }
  try {
    const module = await import(`../../grammars/${grammarType}/wrapperLangium.js`);
    const startClient = module.startLangiumClientClassic;

    if (startClient) {
      return startClient(monaco.value);
    }
  } catch (error) {
    console.error(`Error loading module for ${grammarType}:`, error);
    return null;
  }
};

const emitContent = () => {
  const content = monaco.value.innerText;
  const filteredContent = content
    .split("\n")
    .filter((line) => isNaN(line.trim()))
    .join("\n");
  emit("updateContent", filteredContent);
};

watch(
  () => props.grammarType,
  (newValue) => {
    loadClient(newValue);
  },
  { immediate: true }
);
</script>

<template>
  <div>
    <h1>Model grammar definition</h1>
    <div ref="monaco" id="monaco-editor-root" @focusout="emitContent"></div>
  </div>
</template>

<style scoped>
#monaco-editor-root {
  width: 100%;
  height: 50vh;
  border: 1px solid grey;
}

h1 {
  margin-left: 10px;
  color: gray;
}
</style>
