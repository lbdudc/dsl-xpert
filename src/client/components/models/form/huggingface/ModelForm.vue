<script setup>
import { IconField, ProgressSpinner } from "primevue";
import { onMounted, reactive, ref } from "vue";
const props = defineProps({
    model: {
        type: Object,
        required: true
    }
});

const loadingModels = ref(false);
const model = reactive(props.model);


// HuggingFace API
const HUGGINGFACE_API_URL = "https://huggingface.co/api"

const hfModelSelected = ref(null);
const hfModels = ref(null);
const hfModelDialog = ref(false);
const hfModelName = ref("");
const hfModelAuthor = ref("");
const hfToken = ref("");
const hfModelFilter = ref("");
const hfModelSort = ref("");


const fetchModels = async () => {
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

    const response = await fetch(`${HUGGINGFACE_API_URL}/models?${new URLSearchParams(queryParamsObj).toString()}`, {
        headers: {
            Authorization: `Bearer ${hfToken}`
        }
    });
    const data = await response.json();
    hfModels.value = data;
    loadingModels.value = false;
};

const fetchModelDetail = async (modelId) => {
    const response = await fetch(`${HUGGINGFACE_API_URL}/models/${modelId}`, {
        headers: {
            Authorization: `Bearer ${hfToken}`
        }
    });
    const data = await response.json();
    hfModelSelected.value = data;
};


const openModelDialog = (item) => {
    fetchModelDetail(item.id);
    hfModelDialog.value = true;
};


const selectHfModel = () => {
    if (hfModelSelected.value) {
        // Esto seguramente no lo meta asi a pelo, llega con guardar el id del modelo
        model.modelType = hfModelSelected.value.modelId;
        hfModelDialog.value = false;
    }
};

onMounted(async () => {
    fetchModels();
});


</script>
<template>
    <section class="text-surface-500 dark:text-surface-400 mb-4 hover:cursor-pointer  p-2"
        @click="hfModelDialog = true">
        <label class="text-lg font-semibold text-green-500 ">Model Selected:</label>
        <span v-if="model.modelType" class="ml-4 ">
            {{ model.modelType }}
        </span>
        <span v-else>
            No model selected
        </span>
    </section>

    <Divider />

    <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <FloatLabel class="flex flex-col gap-4" variant="in">
            <InputText name="hfModelName" id="hfModelName" v-model="hfModelName" label="Search Model Name" fluid>
            </InputText>
            <label for="hfModelName">Model Name</label>
        </FloatLabel>

        <FloatLabel class="flex flex-col gap-4" variant="in">
            <InputText name="hfModelAuthor" id="hfModelAuthor" v-model="hfModelAuthor" label="Search Model Author"
                fluid>
            </InputText>
            <label for="hfModelAuthor">Model Author</label>
        </FloatLabel>

        <FloatLabel class="flex flex-col gap-4" variant="in">
            <InputText name="hfModelFilter" id="hfModelFilter" v-model="hfModelFilter" label="Search Model Filter"
                fluid>
            </InputText>
            <label for="hfModelFilter">Model Filter</label>
        </FloatLabel>

        <div class="flex flex-row items-center justify-between">
            <FloatLabel class=" flex flex-col gap-4 flex-1" variant="in">
                <InputText name="hfModelSort" id="hfModelSort" v-model="hfModelSort" label="Search Model Sort" fluid>
                </InputText>
                <label for="hfModelSort">Model Sort</label>
            </FloatLabel>
        </div>

        <FloatLabel class="flex flex-col gap-4" variant="in">
            <Password fluid v-model="hfToken" name="hfToken" label="HuggingFace Token" placeholder="" autocomplete="off"
                :feedback="false" toggleMask>
            </Password>
            <label for="hfToken">HuggingFace Token</label>
        </FloatLabel>

        <Button @click="fetchModels">Search</Button>
    </section>

    <Divider />

    <section>
        <VirtualScroller v-if="!loadingModels && hfModels?.length != 0" :items="hfModels" itemSize=10
            class="flex flex-col items-center justify-center" style="height: 500px">
            <template v-slot:item="{ item, options }">
                <!-- All the rows have to be the same height -->
                <div class="grid grid-cols-4 gap-2 w-full hover:bg-gray-100 hover:cursor-pointer hover:text-slate-950"
                    @click="openModelDialog(item)">

                    <div class="flex items-center justify-start truncate ...">
                        {{ item.id }}
                    </div>
                    <div class="flex items-center justify-start">
                        <i class="pi pi-thumbs-up mr-1" />
                        {{ item.likes }}
                    </div>
                    <div class="flex items-center justify-start">
                        <i v-if="item.private" class="pi pi-unlock" />
                        <i v-else class="pi pi-unlock" />
                    </div>

                    <div class="flex items-center justify-start">
                        <i class="pi pi-download mr-1" />
                        {{ item.downloads }}
                    </div>

                </div>
            </template>
        </VirtualScroller>
        <div v-else-if="hfModels?.length == 0" class="flex items-center justify-center mt-10 h-full text-2xl">
            No models found</div>
        <ProgressSpinner v-else="hfModels?.length == 0"></ProgressSpinner>
    </section>

    <Dialog v-model:visible="hfModelDialog" maximizable modal header="HuggingFace Model" :style="{ width: '80vw' }">
        <span class="text-surface-500 dark:text-surface-400 block mb-8">This is the model information.</span>
        <!-- // view thr information as a json but pretty printed -->
        <div class="overflow-auto min-w-screen pb-20">
            <pre>{{ hfModelSelected }}</pre>
        </div>

        <!-- This is always at the bottom of the screen with position fixed -->
        <div class="absolute bottom-0 right-0 p-4 gap-4 w-full">
            <!-- White background -->
            <div class=" p-4 rounded-lg shadow-lg flex items-center justify-end gap-4">
                <Button type="button" label="Select" @click="selectHfModel"></Button>
                <Button type="button" label="Cancel" severity="secondary" @click="hfModelDialog = false"></Button>
            </div>
        </div>
    </Dialog>
</template>


<style></style>