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
};

const removeCard = (cardIndex) => {
    model.definitionExamples.splice(cardIndex, 1);
    if (model.definitionExamples.length > 1) {
        exampleActiveTab.value = model.definitionExamples.length - 1;
    } else {
        exampleActiveTab.value = 0;
    }
};

</script>

<template>
    <Tabs v-if="model" :value="exampleActiveTab" scrollable>
        <TabList>
            <Tab v-for="(card, cardIndex) in model.definitionExamples" :key="cardIndex" :value="cardIndex">
                Example {{ cardIndex + 1 }}
            </Tab>
            <Tab @click="addCard">
                <Button label="Add Example" icon="pi pi-plus" severity="success" variant="text" />
            </Tab>
        </TabList>

        <TabPanel v-for="(card, cardIndex) in model.definitionExamples" :key="cardIndex" :value="cardIndex">
            <Card>
                <template #content>
                    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 min-h-[200px]">
                        <Textarea v-model="card.userInstruction" label="User instruction"
                            placeholder="Enter an instruction for the model" rows="2" auto-grow>
                            </Textarea>
                        <Textarea v-model="card.modelAnswer" label="Model answer"
                            placeholder="Enter the desired result for that instruction" rows="2" auto-grow>
                            </Textarea>
                    </div>
                </template>

                <template #footer>
                    <Button @click="removeCard(cardIndex)" label="Remove" icon="pi pi-times" severity="danger"
                        variant="text">
                    </Button>
                </template>
            </Card>
        </TabPanel>
    </Tabs>
</template>

<style></style>