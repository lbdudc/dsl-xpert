<script setup>
import { onMounted, reactive, ref } from "vue";
import { CreateMLCEngine, prebuiltAppConfig } from "@mlc-ai/web-llm";

const props = defineProps({
    model: {
        type: Object,
        required: true
    }
});

const model = reactive(props.model);

// WEB LLM
const engine = ref(null);
const wllmSelectedModel = ref(null);
const modelSelectorItems = ref([]);

onMounted(async () => {
    // engine.value = await CreateMLCEngine(
    //     selectedModel,
    //     { initProgressCallback: initProgressCallback }, // engineConfig
    // );
    modelSelectorItems.value = prebuiltAppConfig.model_list.map(model => model.model_id);
});

// Callback function to update model loading progress
const initProgressCallback = (initProgress) => {
    progress.value = initProgress;
    console.log(initProgress);
}

const selectModel = (selectedModel) => {
    wllmSelectedModel.value = prebuiltAppConfig.model_list.find(model => model.model_id === selectedModel.value);
}

</script>
<template>
    <section class="flex flex-col gap-4">
        <Select @change="selectModel" name="modelType" v-model="model.modelType" :options="modelSelectorItems"
            label="Model type" placeholder="Select a model type">
        </Select>
    </section>
    <section class="flex flex-col justify-center items-center full mt-10">
        <Card v-if="wllmSelectedModel" class="border-2 border-green-500 w-full lg:w-1/2">
            <template #title>
                <h3 class="text-lg font-semibold text-green-500">
                    Selected Model Information
                </h3>
            </template>
            <template #subtitle>
                <!-- // Link to the model_url -->
                <a :href="wllmSelectedModel.model" target="_blank" class="text-blue-500 underline">
                    {{ wllmSelectedModel.model_id }}
                </a>
            </template>
            <template #content>
                <p>
                    <span class="font-semibold">
                        RAM Required:
                    </span>
                    {{ wllmSelectedModel.vram_required_MB }} Mb
                </p>
                <p v-if="wllmSelectedModel.low_resource_required">
                    Low resource model
                </p>
                <p v-else>
                    High resource model
                </p>
            </template>
        </Card>
    </section>
    <div v-if="progress">
        {{ progress }}
    </div>
</template>


<style></style>