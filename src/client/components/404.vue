<script setup></script>
<template>
  <div class="flex items-center justify-center min-h-full bg-white dark:bg-gray-900 py-72">
    <div class="flex flex-col">
      <!-- Error Container -->
      <div class="flex flex-col items-center">
        <div class="text-indigo-500 font-bold text-7xl">404</div>

        <div class="font-bold text-3xl xl:text-7xl lg:text-6xl md:text-5xl mt-10">
          This model does not exist
        </div>

        <div class="text-gray-400 font-medium text-sm md:text-xl lg:text-2xl mt-8">
          The page you are looking for could not be found.
        </div>
        <Button class="mt-8">
          <router-link to="/">Go back to home</router-link>
        </Button>

      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
