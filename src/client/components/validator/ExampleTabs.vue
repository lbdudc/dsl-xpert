<script setup>
import { reactive, ref } from "vue";

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

// define emits events
const emit = defineEmits(["update:activeTab", "focusout"]);

const model = reactive(props.model);

// Examples code
const exampleActiveTab = ref(0);

const addCard = () => {
    model.definitionExamples.push({ userInstruction: "", modelAnswer: "" });
    if (model.definitionExamples.length > 1) {
        exampleActiveTab.value = model.definitionExamples.length - 1;
    } else {
        exampleActiveTab.value = 0;
    }
    updateActiveTab(exampleActiveTab.value);
    emitFocusOut();
};

const removeCard = () => {
    const cardIndex = exampleActiveTab.value;
    model.definitionExamples.splice(cardIndex, 1);
    if (model.definitionExamples.length > 1) {
        exampleActiveTab.value = model.definitionExamples.length - 1;
    } else {
        exampleActiveTab.value = 0;
    }
    updateActiveTab(exampleActiveTab.value);
    emitFocusOut();
};

const updateActiveTab = (value) => {
    exampleActiveTab.value = value;
    emit("update:activeTab", value);
};

const emitFocusOut = () => {
    emit("focusout");
};

</script>

<template>
    <Tabs v-if="model" :value="exampleActiveTab" @update:value="updateActiveTab">
        <TabList>
            <Tab v-for="(card, cardIndex) in model.definitionExamples" :key="cardIndex" :value="cardIndex">
                Example {{ cardIndex + 1 }}
            </Tab>
            <Tab @click="addCard">
                <Button label="Add Example" icon="pi pi-plus" severity="success" variant="text" />
            </Tab>
        </TabList>

        <TabPanel v-for="(card, cardIndex) in model.definitionExamples" :key="cardIndex" :value="cardIndex">
            <Textarea v-model="card.userInstruction" label="User instruction"
                placeholder="Enter an instruction for the model" rows="2" auto-grow class="w-full">
                >
            </Textarea>
        </TabPanel>
    </Tabs>
    <!-- CHECK IF HAS GRAMMAR VALIDATION OR NOT -->
    <div v-if="model.grammarType.code == 'langium'" id="content-body" @focusout="emitFocusOut"
        class=" relative border border-gray-300">
        <div id="overlay" class="h-full absolute top-0 left-0 w-full bg-black" style="z-index: 100000">
            <div class="block absolute" style="top: 50%; left: 50%; transform: translate(-50%, -50%)">
                <div class="hint text-xs text-center w-48 font-mono" style="color: rgba(212, 212, 212, 1)">
                    Loading...
                </div>
            </div>
        </div>
        <div id="content-root" class="h-full absolute top-0 left-0 w-full"></div>
    </div>
    <Button @click="removeCard()" label="Remove" icon="pi pi-times" severity="danger" variant="text">
    </Button>
</template>

<style>
#grammar-body,
#content-body {
    min-height: 30vh;
}
</style>