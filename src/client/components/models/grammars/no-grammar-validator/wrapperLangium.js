import { MonacoEditorLanguageClientWrapper } from "monaco-editor-wrapper";
import { setupNoGrammarClientClassic } from "./config/classicConfig.js";

let wrapper;

export const startLangiumClientClassic = async (htmlElem) => {
  try {
    const config = await setupNoGrammarClientClassic(); // Usamos la configuración sin validación
    wrapper = new MonacoEditorLanguageClientWrapper();
    await wrapper.initAndStart(config, htmlElem);
    return wrapper;
  } catch (e) {
    return null;
  }
};

export const disposeEditor = async () => {
  if (!wrapper) return;
  await wrapper.dispose();
  wrapper = undefined;
};


