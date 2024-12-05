<script setup>
import { nextTick, reactive, ref } from "vue";
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

const render = ref(true);

const forceRender = async () => {
    render.value = false;
    await nextTick();
    render.value = true;
};

</script>

<template>
    <div class="flex flex-col gap-4">
        <div class="flex gap-4">
            <Select name="grammarType" v-model="model.grammarType" optionLabel="name" :options="grammarTypeItems"
                class="grow" label="Grammar type" placeholder="Select a grammar type">
            </Select>
            <Button size="small"
                class="p-button-rounded p-button-text p-button-icon-only p-button-outlined p-button-secondary"
                icon="pi pi-refresh" @click="forceRender"></Button>
        </div>
        <ModelGrammarValidator v-if="model.grammarType && render" :model="model" :errors="props.errors"
            :key="model.grammarType" :grammarType="model.grammarType" @updateContent="handleContentUpdate">
        </ModelGrammarValidator>
    </div>
</template>


<style></style>