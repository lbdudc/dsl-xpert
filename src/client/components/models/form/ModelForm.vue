<script setup>
import { useRouter, useRoute } from "vue-router";
import ModelFormOpenAiVue from "./openai/ModelForm.vue";
import ModelFormWebLlmVue from "./web-llm/ModelForm.vue";
import ModelFormHuggingFaceVue from "./huggingface/ModelForm.vue";
import ModelFormValidator from "../grammars/ModelFormValidator.vue";
import { fetchModel, createModel, updateModel, assignModelProperties } from "./openai/modelService.js";
import { initialValues } from "./consts.js";

import NotFoundVue from "../../404.vue";
import { onMounted, ref, reactive } from "vue";

const SERVER_URL = `${import.meta.env.VITE_SERVER_URL || "http://localhost:5000"}`;

const route = useRoute();
const router = useRouter();

const loading = ref(false);

const model = reactive({
    id: null,
    developer: null,
    modelType: null,
    apiKey: "",
    showApiKey: false,
    name: null,
    temperature: 0.2,
    maximumLength: 4095,
    topP: 1,
    repetitionPenalty: 0,
    stopSequences: [";", "###"],
    seed: 6,
    grammarType: { name: "Langium", code: "langium" },
    description: "",
    definition: null,
    definitionExamples: [
        { "userInstruction": "", "modelAnswer": "" }
    ],
    activeTab: 0,
    singleStopSequence: ""
});


const modelDeveloperItems = [
    { code: "openai", name: "OpenAI" },
    { code: "webllm", name: "WebLLM" },
    { code: "huggingface", name: "Hugging Face" },
];

const errors = ref({});

onMounted(() => {
    // Check if the model type is passed in the query string and is valid
    if (
        router.currentRoute.value.query.m &&
        modelDeveloperItems.find((item) => item.code === router.currentRoute.value.query.m.toLowerCase())
    ) {
        model.developer = router.currentRoute.value.query.m;
    } else {
        router.push({ name: "404" });
        return;
    }

    if (route.params.id) {
        fetchModel(SERVER_URL, route.params.id).then((res) => {
            assignModelProperties(res, model);
        });
    }
});

const resolver = async (values) => {

    if (!values.values["modelName"]) {
        errors.value.modelName = [{ message: 'ModelName is required.' }];
    }

    if (!values.values["description"]) {
        errors.value.description = [{ message: 'Description is required.' }];
    }

    if (!model.definition || model.definition == "") {
        errors.value.definition = [{ message: 'Model grammar definition is required.' }];
    }

    if (!values.values["modelType"]) {
        errors.value.modelType = [{ type: 'required', message: 'Model Type is required.' }];
    }

    if (!values.values["apiKey"]) {
        errors.value.apiKey = [{ message: 'API Key is required' }];
    }
};

const onFormSubmit = async (valid) => {
    if (!valid || Object.keys(valid.errors).length > 0) {
        return;
    }

    let res;
    loading.value = true;

    if (model.id) {
        res = await updateModel(SERVER_URL, model.id, model);
    } else {
        res = await createModel(SERVER_URL, model);
    }

    loading.value = false;
    router.push({ name: "ModelChat", params: { id: res.name } });
};


</script>
<template>
    <Form v-if="model.developer != null" v-slot="$form" :initialValues :resolver @submit="onFormSubmit"
        class="flex flex-col gap-4">
        <Tabs value="0">
            <TabList class="flex justify-center">
                <Tab value="0" class="flex-1 text-center">Model Setup</Tab>
                <Tab value="1" class="flex-1 text-center">Grammar Setup</Tab>
            </TabList>
            <TabPanels>
                <TabPanel value="0">
                    <section class="mt-4">
                        <FloatLabel variant=" in">
                            <Select class="w-full" name="modelType" v-model="model.developer"
                                :options="modelDeveloperItems" label="Model type" optionLabel="name" optionValue="code"
                                placeholder="Select a model type" inputId="in_label">
                            </Select>
                            <label for="in_label">Model Type</label>
                        </FloatLabel>
                    </section>
                    <Divider />
                    <section>
                        <model-form-open-ai-vue v-if="model.developer === 'openai'" :model="model" />
                        <model-form-web-llm-vue v-else-if="model.developer === 'webllm'" :model="model" />
                        <model-form-hugging-face-vue v-else-if="model.developer === 'huggingface'" :model="model" />
                    </section>
                </TabPanel>
                <TabPanel value="1" class="mt-4">
                    <model-form-validator :model="model" :errors="errors" />
                </TabPanel>
            </TabPanels>
        </Tabs>
        <Button class="mt-[-16px]" type=" submit" :loading="loading" severity="success" icon="pi pi-check"
            :label="model.id ? 'Update' : 'Create' + ' Model'" />
    </Form>

    <div v-else>
        <not-found-vue />
    </div>
</template>
