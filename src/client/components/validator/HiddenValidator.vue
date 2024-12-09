<script setup>
import { addMonacoStyles, setupPlayground, overlay, getPlaygroundState, getDSLWrapper } from "../../libs/worker/common.js";
import { buildWorkerDefinition } from "../../libs/monaco-editor-workers/index.js";
import { onMounted, watch } from "vue";

const props = defineProps({
    model: {
        type: Object,
        required: true,
    },
    refSignal: {
        type: Boolean,
        required: true,
    },
});

const emit = defineEmits(["validate", "loaded", "refresh"]);

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
        const langiumEditor = res.langiumWrapper.editorApp.editor;

        // set the initial grammar
        langiumEditor.getModel().setValue(props.model.definition);

        setTimeout(() => {
            // set the listener for the DSL editor
            const wrapper = getDSLWrapper();
            wrapper.getLanguageClient().onNotification("browser/DocumentChange", (params) => {
                const { content, diagnostics } = params;
                emit("validate", { diagnostics, self: wrapper });
            });

            emit("loaded", res.dslWrapper);
        }, 3000);
    });
}

watch(() => props.refSignal, (value) => {
    if (value) {
        emit("refresh", getDSLWrapper());
    }
});
</script>
<template>
    <div v-show="false">
        <div id="monaco-editor-root">
            <div class="flex flex-col gap-2">
                <div id="grammar-body" class=" relative border border-gray-300">
                    <div id="grammar-root" class="h-full absolute top-0 left-0 w-full"></div>
                </div>
            </div>
        </div>
        <div id="content-body" class=" relative border border-gray-300 mt-2">
            <div id="overlay" class="h-full absolute top-0 left-0 w-full bg-black" style="z-index: 100000">
                <div class="block absolute" style="top: 50%; left: 50%; transform: translate(-50%, -50%)">
                    <div class="hint text-xs text-center w-48 font-mono" style="color: rgba(212, 212, 212, 1)">
                        Loading...
                    </div>
                </div>
            </div>
            <div id="content-root" class="h-full absolute top-0 left-0 w-full"></div>
        </div>
    </div>
</template>


<style></style>