<script setup>
import { editor } from "monaco-editor";
import { onMounted, ref, watch } from "vue";
import Playground from "@/components/validator/Playground.vue";

const props = defineProps({
  grammarType: {
    type: Object,
    required: true,
  },
  model: {
    type: Object,
    required: true,
  }
});

const emit = defineEmits(["updateContent"]);
const monaco = ref(null);

const loadClient = async (grammarType) => {

  // try {
  //   const module = await import(`./${grammarType.code}/wrapperLangium.js`);
  //   const startClient = module.startLangiumClientClassic;

  //   if (startClient) {
  //     const client = await startClient(monaco.value);
  //     const editor = client.editorApp.editor;
  //     editor.trigger("keyboard",
  //       "type",
  //       { text: props.model.definition }
  //     )
  //   }
  // } catch (error) {
  //   console.error(`Error loading module for ${grammarType.code}:`, error);
  //   return null;
  // }
};


const emitContent = () => {
  const content = monaco.value.innerText;
  const filteredContent = content
    .split("\n")
    .filter((line) => isNaN(line.trim()))
    .join("\n");
  emit("updateContent", filteredContent);
};

// watch(
//   () => props.grammarType,
//   (newValue) => {
//     loadClient(newValue);
//   },
//   { immediate: true }
// );
</script>

<template>
  <div>
    <h1>Model grammar definition</h1>
    <Playground />
    <!-- <div ref="monaco" id="monaco-editor-root" @focusout="emitContent"></div> -->
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
