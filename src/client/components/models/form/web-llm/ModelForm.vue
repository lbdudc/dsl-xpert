    <script setup>
    import { reactive } from "vue";
    const props = defineProps({
        model: {
            type: Object,
            required: true
        }
    });
    const model = reactive(props.model);


</script>
<template>
    huggingface
</template>


<style></style>