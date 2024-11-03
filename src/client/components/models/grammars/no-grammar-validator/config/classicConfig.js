import getConfigurationServiceOverride from "@codingame/monaco-vscode-configuration-service-override";
import getKeybindingsServiceOverride from "@codingame/monaco-vscode-keybindings-service-override";

export const setupNoGrammarClientClassic = async () => {
  return {
    logLevel: 0,
    vscodeApiConfig: {
      userServices: {
        ...getConfigurationServiceOverride(),
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
