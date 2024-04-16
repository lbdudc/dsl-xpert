<script setup>
</script>
<template>
  <div
    class="w-1/2 bg-gray-00 border-gray-200 flex flex-col items-center justify-center pb-2"
  >
    <div class="flex flex-col items-center justify-center w-full h-full">
      <!-- Component Start -->
      <div
        class="flex flex-col flex-grow w-full bg-slate-200 shadow-xl rounded-lg overflow-hidden"
      >
        <div class="flex flex-col flex-grow h-0 p-4 overflow-auto">
          <!-- Render chat messages dynamically -->
          <div
            v-for="(message, index) in conversation"
            :key="index"
            :class="{ 'ml-auto justify-end': message.isUser }"
            class="flex w-full mt-2 space-x-3 max-w-xs"
          >
            <div
              v-if="!message.isUser"
              class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 items-center justify-center flex"
            >
              <!-- Image centered -->
              <img width="30" height="30" alt="" />
            </div>
            <div :class="{ 'ml-0': !message.isUser, 'mr-0': message.isUser }">
              <div
                :class="{
                  'bg-blue-600 text-white align-end': message.isUser,
                  'bg-gray-300': !message.isUser,
                }"
                class="p-3 rounded-lg relative"
              >
                <p class="text-sm">{{ message.text }}</p>
                <!-- Add copy to clipboard button -->
                <button
                  v-if="!message.isUser"
                  class="absolute top-1/2 transform -translate-y-1/2 left-full mt-0 ml-0 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M13 2H6a3 3 0 00-3 3v10a3 3 0 003 3h7a3 3 0 003-3V5a3 3 0 00-3-3zm0 2a1 1 0 011 1v10a1 1 0 01-1 1H6a1 1 0 01-1-1V5a1 1 0 011-1h7z"
                      clip-rule="evenodd"
                    />
                    <path
                      d="M8 5a1 1 0 011-1h5a1 1 0 011 1v10a1 1 0 01-1 1h-5a1 1 0 01-1-1V5z"
                    />
                  </svg>
                </button>
              </div>
              <span class="text-xs text-gray-500 leading-none">{{
                message.timestamp
              }}</span>
            </div>
            <div
              v-if="message.isUser"
              class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"
            ></div>
          </div>
        </div>

        <div v-if="loadingResponse" class="flex flex-col items-center mb-3">
          <v-progress-circular indeterminate></v-progress-circular>
        </div>

        <div class="flex flex-row items-center pr-5">
          <v-textarea
            bg-color="grey-lighten-2"
            color="cyan"
            row-height="15"
            rows="3"
            placeholder="Type your message…"
            v-model="message"
          ></v-textarea>
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