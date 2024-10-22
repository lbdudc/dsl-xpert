<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  grammarType: {
    type: String,
    required: true,
  },
});

// send the content to the parent component

const emit = defineEmits(["updateContent"]);
const monaco = ref(null);

const loadLangiumClient = async (grammarType) => {
  try {
    const module = await import(`./${grammarType}/wrapperLangium.js`);
    const startLangiumClient = module.startLangiumClientClassic;

    if (startLangiumClient) {
      return startLangiumClient(monaco.value); // Asigna la instancia del editor
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
    loadLangiumClient(newValue);
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

<style>
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
