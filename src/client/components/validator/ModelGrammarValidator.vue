<script setup>
import LangiumGrammarValidator from "@components/validator/LangiumGrammarValidator.vue";
import NoGrammarValidator from "@components/validator/NoGrammarValidator.vue";

const props = defineProps({
  grammarType: {
    type: Object,
    required: true,
  },
  model: {
    type: Object,
    required: true,
  },
  errors: {
    type: Object,
    required: true,
  },
  exampleErrorTabs: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["updateContent"]);
</script>

<template>
  <section v-if="props.model" class="mt-0 pt-0">
    <NoGrammarValidator v-if="props.grammarType.code == 'no-grammar-validator'" :model="props.model"
      :exampleErrorTabs="props.exampleErrorTabs" :errors="props.errors" />
    <LangiumGrammarValidator v-else-if="props.grammarType.code == 'langium'" :model="props.model"
      :exampleErrorTabs="props.exampleErrorTabs" :errors="props.errors" />
  </section>
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
