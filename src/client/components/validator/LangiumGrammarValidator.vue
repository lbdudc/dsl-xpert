<script setup>
import { onMounted, ref, reactive } from 'vue';
import { addMonacoStyles, setupPlayground, overlay, getPlaygroundState, getDSLWrapper } from "../../libs/worker/common.js";
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

const init = () => {
    // get a handle to our various interactive buttons
    const grammarRoot = document.getElementById('grammar-root');
    const contentRoot = document.getElementById('content-root');

    setupPlayground(
        grammarRoot,
        contentRoot,
        overlay
    ).then((res) => {
        console.log(res);
        // langiumWrapper = res.langiumWrapper.editorApp.editor;

        const langiumEditor = res.langiumWrapper.editorApp.editor;
        const dslEditor = res.dslWrapper.editorApp.editor;

        // // set the initial text for the editors;

        // set the listeners for the editors
        langiumEditor.onDidChangeModelContent(() => {
            const { grammar, grammarErrors } = getPlaygroundState();
            model.definition = grammar;
            model.grammarErrors = grammarErrors;
        });

        if (model.definition != null && model.definition != "") {
            langiumEditor.getModel().setValue(model.definition);
        }

        refreshListener();

        // set the initial text for the editors;
        if (model.definitionExamples.length > 0) {
            refreshDSLDefinition(0);
        }

        loading.value = false;
    });
}

const activeTab = ref(0);

const refreshDSLDefinition = (exampleIndex) => {
    if (exampleIndex == null) return;
    const exampleContent = model.definitionExamples[exampleIndex].modelAnswer;
    getDSLWrapper().getModel().setValue(exampleContent);
    activeTab.value = exampleIndex;
};

const refreshListener = () => {
    const wrapper = getDSLWrapper();
    wrapper.editorApp.editor.onDidChangeModelContent(() => {
        const { content, dslErrors } = getPlaygroundState();
        if (activeTab.value == null) return;
        if (model.definitionExamples[activeTab.value] == null) return;
        model.definitionExamples[activeTab.value].modelAnswer = content;
        model.definitionErrors = dslErrors;
    });
};

const emitContent = () => {
    refreshListener();
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