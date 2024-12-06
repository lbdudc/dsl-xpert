<script setup>
import { copyToClipboard, formatText } from "../utils/chatUtils.js";
import { useToast } from "primevue/usetoast";
import { ref } from "vue";

const toast = useToast();
const props = defineProps({
    message: {
        type: Object,
        required: true
    },
})

const copyAndShowMessage = async (message) => {
    const res = await copyToClipboard(navigator, message);
    if (res) toast.add({
        severity: 'success', summary: 'Success', detail: 'Copied to clipboard', life: 2500
    });
};

const visible = ref(false);

const showDialog = () => {
    visible.value = true;
}

</script>

<template>
    <div @click="showDialog" :class="{ 'ml-0': !props.message.isUser, 'mr-0': props.message.isUser }">
        <div v-if="props.message.isUser" class="flex justify-end">
            <span class="flex items-center justify-between bg-gray-300 text-slate-800 text-sm p-3 rounded-lg relative">
                {{ props.message.text }}
            </span>
        </div>
        <div v-else class="flex items-center justify-between bg-blue-600 text-white p-3 rounded-lg relative">
            <!-- Pulse animation ball in the top right corner of the message -->
            <div v-if="props.message.loading"
                class="absolute top-[-8px] right-[-4px] w-4 h-4 bg-blue-400 rounded-full animate-ping">
            </div>
            <div v-else-if="!props.message.error"
                class="absolute top-[-10px] right-[-8px] w-6 h-6 bg-green-600 rounded-full">
            </div>
            <div v-else-if="props.message.error"
                class="absolute top-[-10px] right-[-8px] w-6 h-6 bg-red-600 rounded-full">
            </div>

            <p class="text-sm" v-html="formatText(props.message.text)"></p>
            <button v-if="!props.message.isUser" @click="copyAndShowMessage(props.message.text)"
                class="absolute top-1/2 transform -translate-y-1/2 left-full mt-0 ml-0 text-gray-500 hover:text-gray-700 focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 fill-current" viewBox="0 0 20 20">
                    <path fill-rule="evenodd"
                        d="M13 2H6a3 3 0 00-3 3v10a3 3 0 003 3h7a3 3 0 003-3V5a3 3 0 00-3-3zm0 2a1 1 0 011 1v10a1 1 0 01-1 1H6a1 1 0 01-1-1V5a1 1 0 011-1h7z"
                        clip-rule="evenodd" />
                    <path d="M8 5a1 1 0 011-1h5a1 1 0 011 1v10a1 1 0 01-1 1h-5a1 1 0 01-1-1V5z" />
                </svg>
            </button>
        </div>
        <!-- Add copy to clipboard button -->
        <span class="text-xs text-gray-500 leading-none">
            {{ props.message.timestamp }}
        </span>
    </div>

    <Dialog v-model:visible="visible" header="Errors" :style="{ width: '40vw' }">
        <div v-if="props.message.error">
            <p class="text-sm">{{ props.message.error }}</p>
        </div>
        <!-- ForEach grammarErrors -->
        <div v-if="props.message.grammarErrors">
            <p class="text-sm">Grammar Errors:</p>
            <ul>
                <li v-for="error in props.message.grammarErrors" :key="error">
                    <p class="text-sm">{{ error }}</p>
                </li>
            </ul>
        </div>
    </Dialog>
</template>

<style></style>