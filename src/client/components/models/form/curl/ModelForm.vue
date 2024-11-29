<script setup>
import { reactive, ref } from "vue";
import { testCurl } from "./modelService.js";


const props = defineProps({
    model: {
        type: Object,
        required: true
    }
});
const SERVER_URL = `${import.meta.env.VITE_SERVER_URL || "http://localhost:5000"}`;

const model = reactive(props.model);
const result = ref(null);


const submitCurl = async () => {
    testCurl(SERVER_URL, model.curlDefinition)
        .then((response) => {
            result.value = response;
        })
        .catch((error) => {
            result.value = error;
        });
}
</script>

<template>
    <section>
        <Textarea v-model="model.curlDefinition" rows="5" cols="30" />
        <span>
            <pre>{{ result }}</pre>
        </span>
        <Button @click="submitCurl" class="bg-blue-500 text-white">Test</Button>
    </section>
</template>


<style></style>