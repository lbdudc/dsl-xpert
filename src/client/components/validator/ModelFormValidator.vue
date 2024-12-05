<script setup>
import { reactive, ref } from "vue";
import { grammarTypeItems } from "@consts/grammar";
import ModelGrammarValidator from "./ModelGrammarValidator.vue";

const props = defineProps({
    model: {
        type: Object,
        required: true
    },
    errors: {
        type: Object,
        required: true
    }
});

const model = reactive(props.model);

const handleContentUpdate = (content) => {
    model.definition = content;
};

</script>

<template>
    <div class="flex flex-col gap-4">
        <Select name="grammarType" v-model="model.grammarType" optionLabel="name" :options="grammarTypeItems"
            label="Grammar type" placeholder="Select a grammar type">
        </Select>
        <ModelGrammarValidator v-if="model.grammarType" :model="model" :errors="props.errors" :key="model.grammarType"
            :grammarType="model.grammarType" @updateContent="handleContentUpdate">
        </ModelGrammarValidator>
    </div>
</template>


<style></style>