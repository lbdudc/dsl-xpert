<script setup>
import { onMounted, ref, watch } from 'vue';
import { addMonacoStyles, setupPlayground, overlay, getPlaygroundState } from "../../libs/worker/common.js";
import { buildWorkerDefinition } from "../../libs/monaco-editor-workers/index.js";

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
        const langiumEditor = res.langiumWrapper.editorApp.editor;
        const dslEditor = res.dslWrapper.editorApp.editor;
        // AQUI SETEAMOS LA GRAMATICA INICIAL
        // dslEditor.getModel().setValue("dasñlkdañlskd");
        // langiumEditor.getModel().setValue("asotro");
    });
}


const emitContent = () => {
    // Cada vez que se hace un focus out marcaremos con errores
    console.log(getPlaygroundState());
};

</script>


<template>
    <div x-data="{ isOpen: false }" class="relative bg-white flex flex-col h-full dark:bg-gray-900">
        <div class="relative bg-white flex flex-col h-full dark:bg-gray-900">
            <div class="dark:bg-gray-900 flex-grow" ref="monaco" id="monaco-editor-root" @focusout="emitContent">
                <div id="grid" class="without-tree">
                    <div id="grammar-header" class="border-solid border flex items-center p-2 text-white font-mono">
                        Grammar
                    </div>
                    <div id="content-header"
                        class="border-solid border flex items-center p-2 text-white font-mono relative">
                        <span>Content</span>
                    </div>
                    <div id="grammar-body" class="border-solid border relative">
                        <div id="grammar-root" class="h-full absolute top-0 left-0 w-full"></div>
                    </div>
                    <div id="content-body" class="border-solid border relative">
                        <div id="overlay" class="h-full absolute top-0 left-0 w-full bg-black" style="z-index: 100000">
                            <div class="block absolute" style="top: 50%; left: 50%; transform: translate(-50%, -50%)">
                                <div class="hint text-xs text-center w-48 font-mono"
                                    style="color: rgba(212, 212, 212, 1)">
                                    Loading...
                                </div>
                            </div>
                        </div>
                        <div id="content-root" class="h-full absolute top-0 left-0 w-full"></div>
                    </div>
                    <div id="ast-header">
                        Syntax tree
                    </div>
                    <div id="ast-body"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
#grid {
    display: grid;
    grid-template-rows: 3rem auto;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    position: relative;
    height: 100%;
}

#grammar-header,
#content-header,
#ast-header {
    border-color: rgba(38, 136, 140, 1);
    background-color: rgba(38, 136, 140, 0.33);
}

#grammar-body,
#content-body,
#ast-body {
    border-color: rgba(38, 136, 140, 1);
    min-height: 50vh;
}

#grammar-header {
    grid-column-start: 1;
    grid-column-end: 2;
    grid-row-start: 1;
    grid-row-end: 2;
}

#grammar-body {
    grid-column-start: 1;
    grid-column-end: 2;
    grid-row-start: 2;
    grid-row-end: 3;
}

#content-header {
    grid-column-start: 2;
    grid-column-end: 3;
    grid-row-start: 1;
    grid-row-end: 2;
}

#content-body {
    grid-column-start: 2;
    grid-column-end: 3;
    grid-row-start: 2;
    grid-row-end: 3;
}

#ast-header {
    grid-column-start: 3;
    grid-column-end: 4;
    grid-row-start: 1;
    grid-row-end: 2;
}

#ast-body {
    grid-column-start: 3;
    grid-column-end: 4;
    grid-row-start: 2;
    grid-row-end: 3;
}

#grid.without-tree #ast-header,
#grid.without-tree #ast-body {
    display: none;
}

#grid.without-tree {
    grid-template-columns: repeat(2, minmax(0, 1fr));
}

@media screen and (max-width: 600px),
screen and (max-height: 400px) {
    #website-header {
        max-height: 33vh;
        padding: 0 12px 0 0;
    }

    #website-logo {
        max-height: 33vh;
        padding: 3px;
    }

    #website-footer {
        display: none;
    }

    #grid {
        display: grid;
        grid-template-rows: repeat(3, 3rem auto);
        grid-template-columns: repeat(1, minmax(0, 1fr));
        position: relative;
        height: 100%;
    }

    #grid.without-tree {
        grid-template-columns: repeat(1, minmax(0, 1fr));
        grid-template-rows: repeat(2, 3rem auto);
    }

    #grammar-body,
    #content-body,
    #ast-body {
        min-height: 20vh;
    }

    #grammar-header {
        grid-column-start: 1;
        grid-column-end: 2;
        grid-row-start: 1;
        grid-row-end: 2;
    }

    #grammar-body {
        grid-column-start: 1;
        grid-column-end: 2;
        grid-row-start: 2;
        grid-row-end: 3;
    }

    #content-header {
        grid-column-start: 1;
        grid-column-end: 2;
        grid-row-start: 3;
        grid-row-end: 4;
    }

    #content-body {
        grid-column-start: 1;
        grid-column-end: 2;
        grid-row-start: 4;
        grid-row-end: 5;
    }

    #ast-header {
        grid-column-start: 1;
        grid-column-end: 2;
        grid-row-start: 5;
        grid-row-end: 6;
    }

    #ast-body {
        grid-column-start: 1;
        grid-column-end: 2;
        grid-row-start: 6;
        grid-row-end: 7;
    }
}

#ast-body {
    position: absolute;
    right: 0;
    height: 100%;
    width: 100%;
    padding: 0.5rem;
    background-color: #1e1e1e;
    z-index: 1000000;
    overflow-y: scroll;
}

#ast-body>ul {
    cursor: default;
    box-sizing: border-box;
    font-family: monospace;
    flex: 1;
    margin: 0;
    padding-left: 0px;
    overflow: auto;
}

.entry {
    margin: 0;
    list-style: none;
    padding: 0px;
    position: relative;
}

.object-body>.entry {
    padding-left: 0px;
}

.entry>.value {
    list-style: none;
}

.property {
    color: #d4d4d4;
    cursor: pointer;
}

.opening-brace,
.closing-brace,
.colon,
.comma {
    color: #d4d4d4;
}

.literal {
    color: #ce9178;
}

.undefined {
    color: #ce9178;
}

.object-body {
    width: -webkit-fit-content;
    width: -moz-fit-content;
    width: fit-content;
    margin: 0;
    overflow: auto;
}

.link {
    color: white
}

.object-body {
    padding-left: 20px;
}
</style>