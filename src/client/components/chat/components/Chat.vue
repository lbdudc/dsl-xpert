<script setup>
import { ref, reactive, onMounted, watch } from "vue";
import { ServerSelectorService } from "@services/chat/chatService.js";
import { tokenCounter, createChat, } from "@services/chat/contextUtils.js";
import MessageVue from "./Message.vue";

const MAX_TOKENS = 4000;

const message = ref("");
const conversation = reactive([]);
const nTokensConversation = ref(0);
const loadingResponse = ref(false);
const settingUpModel = ref(false);

const emit = defineEmits(["add:message"]);

const props = defineProps({
  model: {
    type: Object,
    required: true,
  },
  chatMessage: {
    type: Object,
    required: true,
  },
});

const addMessageToConversation = (text, isUser) => {

  if (!isUser) emit("add:message", {
    text,
    index: conversation.length,
  });

  conversation.push({
    id: conversation.length,
    text,
    timestamp: new Date().toLocaleTimeString(),
    isUser,
    loading: true,
    error: false,
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


// watch the message prop
watch(() => props.chatMessage, (newVal) => {
  if (newVal) {
    const { index, errors, text } = newVal;
    // update the conversation, replacing the last message
    conversation[index].loading = false;
    conversation[index].error = errors.length > 0;
    conversation[index].text = text;
    conversation[index].grammarErrors = errors;
  }
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
            <MessageVue :message="message" />
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
