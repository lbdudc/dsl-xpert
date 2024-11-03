<script setup>
import { ProgressSpinner } from "primevue";
import { onMounted, ref, reactive } from "vue";
import { useRoute } from "vue-router";

const SERVER_URL = `${import.meta.env.VITE_SERVER_URL || "http://localhost:5000"
  }`;

let message = ref("");
let conversation = reactive([]);
let nTokensConversation = 0;
const loadingResponse = ref(false);
const route = useRoute();
const id = ref(null);
onMounted(() => {
  if (route.params.id) {
    fetch(`${SERVER_URL}/api/models/${route.params.id}`).then((res) => {
      res.json().then((res) => {
        id.value = res._id;
      });
    });
  }
});

// Counts the approximate number of tokens in the input while adding the total number for the whole conversation
async function tokenCounter(text) {
  const words = text.split(/\s+/);
  const nWords = words.length;
  const tokenCount = nWords * 2 + nTokensConversation; // The number of words is doubled to take into account the possible response as well

  return tokenCount;
}

const getModelOutput = async () => {
  if (loadingResponse.value) return;

  try {
    const userMessage = message.value;

    // Add the new message to the chat messages array
    if (userMessage != "") {
      conversation.push({
        text: userMessage,
        timestamp: new Date().toLocaleTimeString(),
        isUser: true,
      });
      message.value = "";
    }

    // Check that the amount of tokens does not exceed the maximum number of 4096 (as the counting is approximate we use 4000 instead)
    if (tokenCounter(userMessage) > 4000) {
      console.log(
        'The amount of tokens in the conversation will exceed the maximum limit for the specified model. You need to start a new conversation. To do so, just write "Reset".'
      );
      process.exit(1);
    }

    // Send petition with the user input
    loadingResponse.value = true;
    const response = await fetch(`${SERVER_URL}/api/models/${id.value}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: userMessage,
      }),
    });
    if (!response.ok) {
      const error = await response.text();
      loadingResponse.value = false;
      throw new Error(JSON.stringify(JSON.parse(error), null, 4));
    }

    // Get response and update conversation and number of tokens
    const openAIData = await response.json();
    const lastMessage = openAIData.messagesHistory.slice(-1)[0];
    if (lastMessage) {
      conversation.push({
        text: lastMessage.content,
        timestamp: new Date().toLocaleTimeString(),
        isUser: false,
      });
    }
    nTokensConversation = openAIData.nTokens;
    loadingResponse.value = false;
  } catch (error) {
    let errorMessage = error.message;
    try {
      const parsedError = JSON.parse(errorMessage);
      errorMessage = parsedError.error || "An unexpected error occurred";
    } catch (parseError) {
      errorMessage = error.message;
    }
    conversation.push({
      text: errorMessage,
      timestamp: new Date().toLocaleTimeString(),
      isUser: false,
    });
    loadingResponse.value = false;
  }
};

// Copy to clipboard the model output
const copyToClipboard = (text) => {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      console.log("Text copied to clipboard:", text);
    })
    .catch((error) => {
      console.error("Error copying text to clipboard:", error);
    });
};

// Replace newline characters with <br> and tab characters with spaces
const formatText = (text) => {
  return text.replace(/\n/g, "<br>").replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;");
};
</script>

<template>
  <div class="w-1/2 bg-gray-00 border-gray-200 flex flex-col items-center justify-center pb-2">
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
                <button v-if="!message.isUser" @click="copyToClipboard(message.text)"
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
      <!-- Component End  -->
    </div>
  </div>
</template>

<style coped>
.v-input__details {
  display: none;
}
</style>
