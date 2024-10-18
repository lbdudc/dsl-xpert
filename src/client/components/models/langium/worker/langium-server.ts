/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2018-2022 TypeFox and others.
 * Licensed under the MIT License. See LICENSE in the package root for license information.
 * ------------------------------------------------------------------------------------------ */
/// <reference lib="WebWorker" />

import { EmptyFileSystem } from 'langium';
import { DefaultSharedModuleContext, startLanguageServer } from 'langium/lsp';
import { createLangiumGrammarServices } from 'langium/grammar';
import { BrowserMessageReader, BrowserMessageWriter, createConnection } from 'vscode-languageserver/browser.js';

const messageReader = new BrowserMessageReader(self as DedicatedWorkerGlobalScope);
const messageWriter = new BrowserMessageWriter(self as DedicatedWorkerGlobalScope);

// Create the connection
const connection = createConnection(messageReader, messageWriter);


connection.onInitialize((params) => {
    console.log("Langium Server: Initialize", params);
    return { capabilities: {} }; // Return actual server capabilities
});

connection.onCompletion((params) => {
    console.log("Langium Server: Completion request", params);
    return [];
});

// Setup Langium services
const { shared } = createLangiumGrammarServices({
    connection,
    ...EmptyFileSystem
});

// Start the language server
startLanguageServer(shared);
