<script setup>
import { onMounted, ref, reactive } from 'vue';
import { addMonacoStyles, setupPlayground, overlay, getPlaygroundState } from "../../libs/worker/common.js";
import { buildWorkerDefinition } from "../../libs/monaco-editor-workers/index.js";
import ExampleTabs from './ExampleTabs.vue';

const props = defineProps({
    model: {
        type: Object,
        required: true
    },
    errors: {
        type: Object,
        required: true
    }
});

const loading = ref(true);

onMounted(() => {
    addMonacoStyles('monaco-styles-helper');
    buildWorkerDefinition(
        "../../libs/monaco-editor-workers/workers",
        new URL("", window.location.href).href,
        false
    );
    init();
});

let dslWrapper = null;

const init = () => {
    // get a handle to our various interactive buttons
    const grammarRoot = document.getElementById('grammar-root');
    const contentRoot = document.getElementById('content-root');

    setupPlayground(
        grammarRoot,
        contentRoot,
        overlay
    ).then((res) => {
        dslWrapper = res.dslWrapper.editorApp.editor;
        const langiumEditor = res.langiumWrapper.editorApp.editor;
        // const dslEditor = res.dslWrapper.editorApp.editor;
        // const setupDSLWrapper = res.setupDSLWrapper;

        if (model.definition != null && model.definition != "") {
            langiumEditor.getModel().setValue(model.definition);
        }

        if (model.definitionExamples.length > 0
            && model.definitionExamples[0].modelAnswer != null
            && model.definitionExamples[0].modelAnswer != ""
        ) {
            dslWrapper.getModel().setValue(model.definitionExamples[0].modelAnswer);
        }

        loading.value = false;
    });
}

const activeTab = ref(0);

const refreshDSLDefinition = (exampleIndex) => {
    if (exampleIndex == null) return;
    const exampleContent = model.definitionExamples[exampleIndex].modelAnswer;
    dslWrapper.getModel().setValue(exampleContent);
    activeTab.value = exampleIndex;
};

const emitContent = () => {
    const content = dslWrapper.getModel().getValue();
    model.definitionExamples[activeTab.value].modelAnswer = content;
    // TODO: checkear el contenido de los 
};

const model = reactive(props.model);
const errors = reactive(props.errors);
</script>


<template>
    <section v-show="props.model && !loading">
        <div id="monaco-editor-root" @focusout="emitContent">
            <div class="flex flex-col gap-2">
                <div id="grammar-body" class=" relative border border-gray-300">
                    <div id="grammar-root" class="h-full absolute top-0 left-0 w-full"></div>
                </div>
            </div>
        </div>
        <ExampleTabs v-if="props.model" :model="model" :errors="errors" @update:activeTab="refreshDSLDefinition"
            @focusout="emitContent" />
    </section>
    <ProgressSpinner v-if="loading" class="flex justify-center items-center h-96 overflow-hidden" />
</template>

<style scoped>
#grammar-body,
#content-body {
    min-height: 30vh;
}
</style>