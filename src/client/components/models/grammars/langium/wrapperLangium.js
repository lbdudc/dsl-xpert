/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2024 TypeFox and others.
 * Licensed under the MIT License. See LICENSE in the package root for license information.
 * ------------------------------------------------------------------------------------------ */

import { MonacoEditorLanguageClientWrapper } from "monaco-editor-wrapper";
import { setupLangiumClientClassic } from "./config/classicConfig.js";
import workerUrl from "./worker/langium-server?worker&url";

let wrapper;

export const startLangiumClientClassic = async (htmlElem) => {
  try {
    const config = await setupLangiumClientClassic();
    wrapper = new MonacoEditorLanguageClientWrapper();
    await wrapper.initAndStart(config, htmlElem);
    return wrapper;
  } catch (e) {
    console.log(e);
  }
};

export const disposeEditor = async () => {
  if (!wrapper) return;
  wrapper.reportStatus();
  await wrapper.dispose();
  wrapper = undefined;
};

export const loadLangiumWorker = () => {
  console.log(`Langium worker URL: ${workerUrl}`);
  // Ensure worker is created
  return new Worker(workerUrl, {
    type: "module",
    name: "Langium LS",
  });
};
