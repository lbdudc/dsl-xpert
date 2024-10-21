<script setup>
import { ref, defineProps, watch, defineEmits } from "vue";

const props = defineProps({
  grammarType: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['updateContent']);
const monaco = ref(null);
let editorInstance = null; // Variable para almacenar la instancia del editor

const loadLangiumClient = async (grammarType) => {
  const modulePath = `./${grammarType}/wrapperLangium.js`;

  try {
    const module = await import(modulePath);
    const startLangiumClient = module.startLangiumClientClassic;

    if (startLangiumClient) {
      editorInstance = startLangiumClient(monaco.value); // Asigna la instancia del editor
    }
  } catch (error) {
    console.error(`Error loading module for ${grammarType}:`, error);
  }
};

const emitContent = () => {
  const content = monaco.value.innerText; 
  const filteredContent = content
    .split('\n') 
    .filter(line => isNaN(line.trim())) 
    .join('\n');
  emit('updateContent', filteredContent);
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
    <div 
        ref="monaco" 
        id="monaco-editor-root"
        @focusout="emitContent">
    </div>
  </div>
</template>

<style>
#monaco-editor-root {
  width: 80vw;
  height: 50vh;
  border: 1px solid grey;
}
h1{
    margin-left: 10px;
    color: gray;
}
</style>
