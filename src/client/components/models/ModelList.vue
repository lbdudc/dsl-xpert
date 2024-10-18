  <script setup>
import { onMounted, ref } from "vue";
import { startLangiumClientClassic } from "./langium/wrapperLangium.js";

const monaco = ref(null);
onMounted(() => {
  startLangiumClientClassic(monaco.value);
});
</script>
<template>
  <div>
    <h1>Model List</h1>

    <div ref="monaco" id="monaco-editor-root"></div>
  </div>
</template>


<style>
#monaco-editor-root {
  width: 80vw;
  height: 80vh;
  border: 1px solid grey;
}
</style>