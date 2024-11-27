<script setup>
import { useRouter } from "vue-router";

import ModelFormOpenAiVue from "./openai/ModelForm.vue";
import ModelFormWebLlmVue from "./web-llm/ModelForm.vue";
import ModelFormHuggingFaceVue from "./huggingface/ModelForm.vue";
import NotFoundVue from "../../404.vue";
import { onMounted, ref } from "vue";

const router = useRouter();

const modelRef = ref(null);
const modelTypeItems = [
    { code: "openai", name: "OpenAI" },
    { code: "webllm", name: "WebLLM" },
    { code: "huggingface", name: "Hugging Face" },
];
onMounted(() => {
    // Check if the model type is passed in the query string and is valid
    if (
        router.currentRoute.value.query.m &&
        modelTypeItems.find((item) => item.code === router.currentRoute.value.query.m.toLowerCase())
    ) {
        modelRef.value = router.currentRoute.value.query.m;
    } else {
        router.push({ name: "404" });
    }
});
</script>
<template>
    <Tabs v-if="modelRef != null" value="0">
        <TabList class="flex justify-center">
            <Tab value="0" class="flex-1 text-center">Model Setup</Tab>
            <Tab value="1" class="flex-1 text-center">Grammar Setup</Tab>
        </TabList>
        <TabPanels>
            <TabPanel value="0">
                <section class="mt-4">
                    <FloatLabel variant=" in">
                        <Select class="w-full" name="modelType" v-model="modelRef" :options="modelTypeItems"
                            label="Model type" optionLabel="name" optionValue="code" placeholder="Select a model type"
                            inputId="in_label">
                        </Select>
                        <label for="in_label">Model Type</label>
                    </FloatLabel>
                </section>
                <Divider />
                <section>
                    <model-form-open-ai-vue v-if="modelRef === 'openai'" />
                    <model-form-web-llm-vue v-else-if="modelRef === 'webllm'" />
                    <model-form-hugging-face-vue v-else-if="modelRef === 'huggingface'" />
                </section>
            </TabPanel>
            <TabPanel value="1">
                <p class="m-0">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
                    et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                    aliquip ex ea commodo
                    consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                    nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
                    mollit anim id est laborum.
                </p>
            </TabPanel>
        </TabPanels>
    </Tabs>

    <div v-else>
        <not-found-vue />
    </div>
</template>
