<script setup>
import { reactive, ref } from "vue";
import { testCurl } from "@services/curlService.js";


const props = defineProps({
    model: {
        type: Object,
        required: true
    }
});

const model = reactive(props.model);
const result = ref(null);


const submitCurl = async () => {
    testCurl(model.modelType)
        .then((response) => {
            result.value = response;
        })
        .catch((error) => {
            result.value = error;
        });
}
</script>

<template>
    <section class="flex flex-col gap-4">
        <Textarea v-model="model.modelType" rows="5" cols="30" />
        <Button @click="submitCurl" class="bg-blue-500 text-white">Test</Button>
    </section>
    <section v-if="result" class="flex flex-col gap-4 mt-10">
        <Card class="border-2 w-full lg:w-1/2" :class="result.ok ? 'border-green-500' : 'border-red-500'">
            <template #title>
                <h3 class="text-lg font-semibold" :class="result.ok ? 'text-green-500' : 'text-red-500'">
                    Curl Validation Result
                </h3>
            </template>
            <template #content>
                <p>
                    <span class="font-semibold">
                        Status:
                    </span>
                    {{ result.status }}
                </p>
                <p>
                    <span class="font-semibold">
                        Message:
                    </span>
                    {{ result.text }}
                </p>
            </template>
        </Card>
    </section>
</template>


<style></style>