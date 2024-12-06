<script setup>
import { ProgressSpinner } from "primevue";
import { ref, reactive, onMounted } from "vue";
import { ServerSelectorService } from "@services/chat/chatService.js";
import { tokenCounter, createChat, } from "@services/chat/contextUtils.js";
import { copyToClipboard, formatText } from "../utils/chatUtils.js";
import { useToast } from "primevue/usetoast";

const toast = useToast();
const MAX_TOKENS = 4000;

const message = ref("");
const conversation = reactive([]);
const nTokensConversation = ref(0);
const loadingResponse = ref(false);
const settingUpModel = ref(false);

const props = defineProps({
  model: {
    type: Object,
    required: true,
  },
});

const copyAndShowMessage = async (message) => {
  const res = await copyToClipboard(navigator, message);
  if (res) toast.add({
    severity: 'success', summary: 'Success', detail: 'Copied to clipboard', life: 2500
  });
};

const addMessageToConversation = (text, isUser) => {
  conversation.push({
    text,
    timestamp: new Date().toLocaleTimeString(),
    isUser,
  });
};

const getModelOutput = async () => {

  if (loadingResponse.value) return;
  if (message.value == "") return;

  let userMessage = message.value;

  addMessageToConversation(userMessage, true);
  message.value = "";

  if (tokenCounter(userMessage, nTokensConversation.value) > MAX_TOKENS) {
    addMessageToConversation("You have reached the maximum token limit", false);
    return;
  }

  try {
    loadingResponse.value = true;
    userMessage = createChat(userMessage, props.model.definition, props.model.definitionExamples);

    // Send message to the chat service
    const serverResponse = await chatReasoner.sendMessage(props.model.developer, {
      id: props.model.id,
      modelType: props.model.modelType,
      apiKey: props.model.apiKey,
      modelName: "distilgpt2", // Needs to be set to huggingFaceModelName
      modelTag: "text-generation", // Needs to be set to huggingFaceModelTag
      temperature: props.model.temperature,
      max_tokens: props.model.maximumLength,
      repetition_penalty: props.model.repetitionPenalty,
      top_P: props.model.topP,
      stopSequences: props.model.stopSequences,
      seed: props.model.seed,
      userMessage
    },
      engine
    );

    console.log("Server response", serverResponse);

    // Add the response to the conversation
    const lastMessage = serverResponse.messagesHistory.slice(-1)[0];
    if (!lastMessage) return;

    addMessageToConversation(lastMessage.content, false);
    nTokensConversation.value = serverResponse.nTokens;

  } catch (error) {
    const errorMessage = JSON.parse(error.message).error || "An unexpected error occurred";
    addMessageToConversation(errorMessage, false);
  } finally {
    loadingResponse.value = false;
  }
};

// Model loading progress
const chatReasoner = new ServerSelectorService();
const progress = ref(0);
const progressText = ref("");
let engine = null;

// Callback function to update model loading progress
const initProgressCallback = (initProgress) => {
  progress.value = Math.round(initProgress.progress * 100);
  progressText.value = initProgress.text;
}

onMounted(async () => {
  settingUpModel.value = true;

  // Load the engine model
  engine = await chatReasoner.loadModel(props.model, initProgressCallback);

  settingUpModel.value = false;
});
</script>

<template>
  <section v-if="settingUpModel"
    class="w-1/2 bg-gray-00 border-gray-200 flex flex-col items-center justify-center mx-16 gap-8">
    <ProgressBar :value="progress" class="w-full"></ProgressBar>
    <span class="text-sm text-gray-500">
      {{ progressText }}
    </span>
  </section>

  <div v-else class="w-1/2 bg-gray-00 border-gray-200 flex flex-col items-center justify-center">
    <div class="flex flex-col items-center justify-center w-full h-full">
      <!-- Component Start -->
      <div class="flex flex-col flex-grow w-full bg-slate-200 shadow-xl rounded-lg overflow-hidden">
        <div class="flex flex-col flex-grow h-0 p-4 overflow-auto">
          <!-- Render chat messages dynamically -->
          <div v-for="(message, index) in conversation" :key="index" :class="{ 'ml-auto justify-end': message.isUser }"
            class="flex w-full mt-2 space-x-3 max-w-xs mr-4">
            <div v-if="!message.isUser"
              class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 items-center justify-center flex">
              <!-- Image centered -->
              <img width="30" height="30" alt="" src="/openailogo.webp" />
            </div>
            <div :class="{ 'ml-0': !message.isUser, 'mr-0': message.isUser }">
              <div :class="{
                'bg-blue-600 text-white align-end': message.isUser,
                'bg-gray-300 text-black': !message.isUser,
              }" class="p-3 rounded-lg relative">
                <!-- Use v-html to render formatted text -->
                <p class="text-sm" v-html="formatText(message.text)"></p>
                <!-- Add copy to clipboard button -->
                <button v-if="!message.isUser" @click="copyAndShowMessage(message.text)"
                  class="absolute top-1/2 transform -translate-y-1/2 left-full mt-0 ml-0 text-gray-500 hover:text-gray-700 focus:outline-none">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 fill-current" viewBox="0 0 20 20">
                    <path fill-rule="evenodd"
                      d="M13 2H6a3 3 0 00-3 3v10a3 3 0 003 3h7a3 3 0 003-3V5a3 3 0 00-3-3zm0 2a1 1 0 011 1v10a1 1 0 01-1 1H6a1 1 0 01-1-1V5a1 1 0 011-1h7z"
                      clip-rule="evenodd" />
                    <path d="M8 5a1 1 0 011-1h5a1 1 0 011 1v10a1 1 0 01-1 1h-5a1 1 0 01-1-1V5z" />
                  </svg>
                </button>
              </div>
              <span class="text-xs text-gray-500 leading-none">{{
                message.timestamp
                }}</span>
            </div>
          </div>
        </div>

        <div v-if="loadingResponse" class="flex flex-col items-center mb-3">
          <ProgressSpinner style="width: 30px; height: 30px" strokeWidth="6"></ProgressSpinner>
        </div>

        <div class="flex flex-row items-center">
          <TextArea row-height="15" class="flex-grow" rows="2" placeholder="Type your message…" v-model="message"
            @keydown.enter="getModelOutput">
          </TextArea>
        </div>
      </div>
    </div>
  </div>
</template>

<style coped>
.v-input__details {
  display: none;
}
</style>
