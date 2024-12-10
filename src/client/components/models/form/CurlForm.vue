<script setup>
import { onMounted, reactive, ref } from "vue";
import { testCurl } from "@services/curlService.js";

const props = defineProps({
    model: {
        type: Object,
        required: true
    }
});

const model = reactive(props.model);

onMounted(() => {
    model.request = {
        method: "POST",
        url: "http://localhost:8000/api/mock",
        headers: [],
        body: ` \{ \n \t \"model\": \"${props.model.modelType || 'gpt-4o-mini'}\", \n \t \"messages\": [{"role": "user", "content": "Say this is a test!"}] \n \}`
    }
    model.modelType = "curl"
});

const result = ref(null);
const headerKey = ref("");
const headerValue = ref("");
const showDetail = ref(false);

const submitCurl = async () => {
    testCurl(model.request).then((res) => {
        result.value = res;
        if (res.ok) result.value.isFormatValid = checkOpenAICompliance(res.body);
    }).catch((error) => {
        console.log(error);
        result.value = error;
    });
}

const addHeader = () => {
    model.request.headers.push({
        key: headerKey.value,
        value: headerValue.value
    });
    headerKey.value = "";
    headerValue.value = "";
}

const checkOpenAICompliance = (response) => {
    if (!response.usage) return false;
    if (!response.choices) return false;
    if (!response.choices.length) return false;
    if (!response.model) return false;
    return true;
}
</script>

<template>
    <section v-if="model.request" class="flex flex-col md:flex-row gap-4 items-center">
        <i class="pi pi-info-circle text-blue-500 text-xl"></i>
        <div class="flex flex-col gap-2">
            <p>
                This form will allow you to test the request that will be sent to your custom server.
            </p>
            <p>
                The request must return information in a format valid for OpenAI
                <a class="text-blue-500 underline" href="https://platform.openai.com/docs/api-reference/making-requests"
                    target="_blank">
                    OpenAI API Format Reference
                </a>
            </p>
        </div>
    </section>
    <section class="flex flex-col gap-2 w-full">
        <div class="flex flex-row gap-2 w-full">
            <SelectButton v-model="model.request.method" label="Method" :options="['GET', 'POST', 'PUT']" />
            <InputText fluid v-model="model.request.url" label="URL" class="flex-1" />
        </div>
        <h3 class="text-lg font-semibold">
            Headers
        </h3>
        <InputText v-model="headerKey" label="Headers" placeholder="Authorization" />
        <InputText v-model="headerValue" label="Headers" placeholder="Bearer sk-12345678" />
        <Button @click="addHeader" variant="text" class="bg-green-500 text-white">Add Header</Button>

        <div class="flex flex-col gap-2">
            <Chip v-for="(header, index) in model.request.headers" :key="index"
                :label="`${header.key}: ${header.value}`" removable
                @click:close="model.request.headers.splice(index, 1)" />
        </div>

        <h3 class="text-lg font-semibold">
            Body
        </h3>
        <Textarea v-model="model.request.body" label="Body" placeholder="Enter the body of the request" rows="5" />
        <Button @click="submitCurl" class="bg-blue-500 text-white">Test</Button>
    </section>
    <section v-if="result" class="flex flex-col gap-4 mt-10">
        <Card class="border-2 w-full"
            :class="result.ok && result.isFormatValid ? 'border-green-500' : 'border-red-500'">
            <template #title>
                <h3 class="text-lg font-semibold"
                    :class="result.ok && result.isFormatValid ? 'text-green-500' : 'text-red-500'">
                    Curl Validation Result
                </h3>
            </template>
            <template #content>
                <div class="flex flex-col">
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
                    <p>
                        <span class="font-semibold">
                            Format Valid:
                        </span>
                        {{ result.isFormatValid ? 'Yes' : 'No' }}
                    </p>
                </div>
                <div class="mb-2">
                    <Button @click="showDetail = !showDetail" variant="text" class="text-blue-500">
                        {{ showDetail ? 'Hide' : 'Show' }} Detail
                    </Button>
                    <p v-if="showDetail" class="mt-4">
                        <span class="font-semibold">
                            Body:
                        </span>
                    </p>
                    <pre v-if="showDetail">{{ result.body }}</pre>
                </div>
            </template>
        </Card>
    </section>
</template>


<style></style>