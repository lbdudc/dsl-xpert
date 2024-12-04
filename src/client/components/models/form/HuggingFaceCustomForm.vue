<script setup>
import { onMounted, reactive, ref } from "vue";
import { fetchModels, fetchModelDetails } from "@services/huggingFaceService";

// WebSocket related variables and functions
const socket = ref(null);
const wsMessage = ref(""); // Store real-time messages
const isConnected = ref(false); // Track WebSocket connection state

// Props and other variables
const props = defineProps({
    model: {
        type: Object,
        required: true
    }
});

const loadingModels = ref(false);
const model = reactive(props.model);

const hfModelSelected = ref(null);
const hfModels = ref(null);
const hfModelDialog = ref(false);
const hfModelName = ref("");
const hfModelAuthor = ref("");
const hfToken = ref("");
const hfModelFilter = ref("");
const hfModelSort = ref("");

// WebSocket functions
const connectWebSocket = () => {
    socket.value = new WebSocket("ws://127.0.0.1:8000/ws/chat"); // Update with actual WebSocket endpoint

    socket.value.onopen = () => {
        isConnected.value = true;
        console.log("WebSocket connected");
    };

    socket.value.onmessage = (event) => {
        wsMessage.value += "\n"+event.data; // Update message with incoming data
    };

    socket.value.onclose = () => {
        isConnected.value = false;
        console.log("WebSocket disconnected");
    };

    socket.value.onerror = (error) => {
        console.error("WebSocket error:", error);
    };
};

const sendCustomRequest = () => {
    if (socket.value && socket.value.readyState === WebSocket.OPEN) {
        const requestPayload = {
            prompt: "Your custom prompt here",
            model_name: "distilgpt2",
            model_tag: "text-generation",
            temperature: 0.7,
            max_length: 100
        };

        socket.value.send(JSON.stringify(requestPayload));
    }
};

const fetchModelsClient = async () => {
    loadingModels.value = true;
    const queryParamsObj = {};

    if (hfModelName.value != "") {
        queryParamsObj.search = hfModelName.value;
    }
    if (hfModelAuthor.value != "") {
        queryParamsObj.author = hfModelAuthor.value;
    }
    if (hfModelSort.value != "") {
        queryParamsObj.sort = hfModelSort.value;
    }

    const data = await fetchModels(queryParamsObj, hfToken.value);
    hfModels.value = data;
    loadingModels.value = false;
};

const fetchModelDetailClient = async (modelId) => {
    const res = await fetchModelDetails(modelId, hfToken.value);
    hfModelSelected.value = res;
};

const openModelDialog = (item) => {
    fetchModelDetailClient(item.id);
    hfModelDialog.value = true;
};

const selectHfModel = () => {
    if (hfModelSelected.value) {
        model.modelType = hfModelSelected.value.modelId;
        hfModelDialog.value = false;
    }
};

onMounted(() => {
    fetchModelsClient();
    connectWebSocket(); // Connect to WebSocket when the component is mounted
});
</script>

<template>
    <section class="text-surface-500 dark:text-surface-400 mb-4 hover:cursor-pointer p-2" @click="hfModelDialog = true">
        <label class="text-lg font-semibold" :class="!model.modelType ? 'text-red-500' : 'text-green-500'">
            Model Selected:
        </label>
        <span v-if="model.modelType" class="ml-4">{{ model.modelType }}</span>
        <span v-else>No model selected</span>
    </section>

    <Divider />

    <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <FloatLabel class="flex flex-col gap-4" variant="on">
            <InputText size="small" name="hfModelName" id="hfModelName" v-model="hfModelName" label="Search Model Name" />
            <label for="hfModelName">Model Name</label>
        </FloatLabel>

        <FloatLabel class="flex flex-col gap-4" variant="on">
            <InputText size="small" name="hfModelAuthor" id="hfModelAuthor" v-model="hfModelAuthor" label="Search Model Author" />
            <label for="hfModelAuthor">Model Author</label>
        </FloatLabel>

        <FloatLabel class="flex flex-col gap-4" variant="on">
            <InputText size="small" name="hfModelFilter" id="hfModelFilter" v-model="hfModelFilter" label="Search Model Filter" />
            <label for="hfModelFilter">Model Filter</label>
        </FloatLabel>

        <div class="flex flex-row items-center justify-between">
            <FloatLabel class="flex flex-col gap-4 flex-1" variant="on">
                <InputText size="small" name="hfModelSort" id="hfModelSort" v-model="hfModelSort" label="Search Model Sort" />
                <label for="hfModelSort">Model Sort</label>
            </FloatLabel>
        </div>

        <FloatLabel class="flex flex-col gap-4" variant="on">
            <Password size="small" v-model="hfToken" name="hfToken" label="HuggingFace Token" placeholder="" autocomplete="off" :feedback="false" fluid toggleMask />
            <label for="hfToken">HuggingFace Token</label>
        </FloatLabel>

        <Button @click="fetchModelsClient">Search</Button>
    </section>

    <Divider />

    <section class="max-h-[370px] overflow-hidden">
        <VirtualScroller v-if="!loadingModels && hfModels?.length != 0" :items="hfModels" :itemSize="5" class="flex flex-col items-center justify-center" style="height: 370px">
            <template v-slot:item="{ item, options }">
                <div class="grid grid-cols-4 gap-2 w-full hover:bg-gray-100 hover:cursor-pointer hover:text-slate-950" @click="openModelDialog(item)">
                    <div class="flex items-center justify-start truncate ...">{{ item.id }}</div>
                    <div class="flex items-center justify-start">
                        <i class="pi pi-thumbs-up mr-1" /> {{ item.likes }}
                    </div>
                    <div class="flex items-center justify-start">
                        <i v-if="item.private" class="pi pi-unlock" />
                        <i v-else class="pi pi-unlock" />
                    </div>
                    <div class="flex items-center justify-start">
                        <i class="pi pi-download mr-1" /> {{ item.downloads }}
                    </div>
                </div>
            </template>
        </VirtualScroller>
        <div v-else-if="hfModels?.length == 0" class="flex items-center justify-center mt-10 h-full text-2xl">No models found</div>
        <ProgressSpinner v-else="hfModels?.length == 0" />
    </section>

    <Dialog v-model:visible="hfModelDialog" maximizable modal header="HuggingFace Model" :style="{ width: '80vw' }">
        <span class="text-surface-500 dark:text-surface-400 block mb-8">This is the model information.</span>
        <div class="overflow-auto min-w-screen pb-20">
            <pre>{{ hfModelSelected }}</pre>
        </div>
        <div class="absolute bottom-0 right-0 p-4 gap-4 w-full">
            <div class="p-4 rounded-lg shadow-lg flex items-center justify-end gap-4">
                <Button type="button" label="Select" @click="selectHfModel" />
                <Button type="button" label="Cancel" severity="secondary" @click="hfModelDialog = false" />
            </div>
        </div>
    </Dialog>

    <!-- Section for real-time WebSocket message display -->
    <section class="mt-6">
        <Button @click="sendCustomRequest" :disabled="!isConnected">Send Custom Request</Button>
        <div v-if="wsMessage" class="mt-4 p-4 bg-gray-100 border border-gray-300 text-red-500">
            <h3 class="font-semibold">Real-time Response:</h3>
            <pre>{{ wsMessage }}</pre>
        </div>
    </section>
</template>

<style>
/* Additional styles for WebSocket message display */
section {
    margin-top: 20px;
}
</style>
