<script setup>
import { reactive } from 'vue';
import ExampleTabs from './ExampleTabs.vue';

const props = defineProps({
    model: {
        type: Object,
        required: true
    },
    errors: {
        type: Object,
        required: true
    },
    exampleErrorTabs: {
        type: Object,
        required: true
    }
});

const model = reactive(props.model);
const errors = reactive(props.errors);


</script>

<template>
    <section v-if="model" class="flex flex-col space-y-4">
        <Textarea v-model="model.definition" label="Definition" placeholder="Enter the definition of the language"
            rows="10" auto-grow></Textarea>
        <Message v-if="props.errors.definition" severity="error">
            {{ props.errors.definition[0].message }}
        </Message>

        <!-- Trick to appear the form the model content -->
        <InputText name="definition" id="definition" v-show="false" v-model="model.definition" label="Model definition"
            fluid>
        </InputText>
        <Message v-if="errors.definition?.invalid" severity="error" size="small" variant="simple">{{
            errors.definition.error?.message }}
        </Message>

        <ExampleTabs v-if="props.model" :exampleErrorTabs="props.exampleErrorTabs" :model="model" :errors="errors" />
    </section>
</template>


<style></style>