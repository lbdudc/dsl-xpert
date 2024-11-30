<script setup>
import { reactive } from "vue";
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

const addCard = () => {
    model.definitionExamples.push({ userInstruction: "", modelAnswer: "" });
    if (model.definitionExamples.length > 1) {
        model.activeTab = model.definitionExamples.length - 1;
    } else {
        model.activeTab = 0;
    }
};

const removeCard = (cardIndex) => {
    model.definitionExamples.splice(cardIndex, 1);
    if (model.definitionExamples.length > 1) {
        model.activeTab = model.definitionExamples.length - 1;
    } else {
        model.activeTab = 0;
    }
};
</script>

<template>
    <div class="flex flex-col gap-4">
        <Select name="grammarType" v-model="model.grammarType" optionLabel="name" :options="grammarTypeItems"
            label="Grammar type" placeholder="Select a grammar type">
        </Select>

        <ModelGrammarValidator v-if="model.grammarType" :model="model" :key="model.grammarType"
            :grammarType="model.grammarType" @updateContent="handleContentUpdate">
        </ModelGrammarValidator>

        <!-- Trick to appear the form the model content -->
        <InputText name="definition" id="definition" v-show="false" v-model="model.definition" label="Model definition"
            fluid>
        </InputText>
        <Message v-if="errors.definition?.invalid" severity="error" size="small" variant="simple">{{
            errors.definition.error?.message }}
        </Message>


        <Tabs :value="model.activeTab" scrollable>
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
    </div>
</template>


<style></style>