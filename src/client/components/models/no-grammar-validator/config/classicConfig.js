import getConfigurationServiceOverride from "@codingame/monaco-vscode-configuration-service-override";
import getEditorServiceOverride from "@codingame/monaco-vscode-editor-service-override";
import getKeybindingsServiceOverride from "@codingame/monaco-vscode-keybindings-service-override";
import { useOpenEditorStub } from "monaco-editor-wrapper/vscode/services";
import { LogLevel } from "vscode/services";

export const setupNoGrammarClientClassic = async () => {
  return {
    logLevel: LogLevel.Debug,
    vscodeApiConfig: {
      userServices: {
        ...getConfigurationServiceOverride(),
        ...getEditorServiceOverride(useOpenEditorStub),
        ...getKeybindingsServiceOverride(),
      },
    },
    editorAppConfig: {
      $type: "classic",
      codeResources: {
        main: {
          text: "", 
          fileExt: "txt", 
          enforceLanguageId: "plaintext", 
        },
      },
      useDiffEditor: false,
      editorOptions: {
        "semanticHighlighting.enabled": false,
        wordBasedSuggestions: "off",
        theme: "vs-dark",
      },
      htmlContainer: document.getElementById("monaco-editor-root"), 
    },
  };
};
