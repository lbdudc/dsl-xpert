<script>
</script>


<template>
    <section>
        <h1>Model Selector</h1>
        <p>Choose a model to create a new model</p>
        <router-link :to="{ name: 'ModelCreate', query: { m: 'openai' } }">OpenAi Model</router-link>
        <router-link :to="{ name: 'ModelCreate', query: { m: 'huggingface' } }">Hugging Face Model</router-link>
        <router-link :to="{ name: 'ModelCreate', query: { m: 'webllm' } }">Custom Model</router-link>
    </section>
</template>


<style></style>