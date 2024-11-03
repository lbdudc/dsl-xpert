<script setup>
import { useRouter } from "vue-router";

import ModelFormOpenAiVue from "./openai/ModelForm.vue";
import ModelFormWebLlmVue from "./web-llm/ModelForm.vue";
import ModelFormHuggingFaceVue from "./huggingface/ModelForm.vue";
import NotFoundVue from "../../404.vue";

const router = useRouter();

const model = router.currentRoute.value.query.m || "404";

</script>
<template>
    <model-form-open-ai-vue v-if="model === 'openai'" />
    <model-form-web-llm-vue v-else-if="model === 'webllm'" />
    <model-form-hugging-face-vue v-else-if="model === 'huggingface'" />
    <div v-else>
        <not-found-vue />
    </div>
</template>


<style></style>
