/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2024 TypeFox and others.
 * Licensed under the MIT License. See LICENSE in the package root for license information.
 * ------------------------------------------------------------------------------------------ */

import getConfigurationServiceOverride from "@codingame/monaco-vscode-configuration-service-override"
import getKeybindingsServiceOverride from "@codingame/monaco-vscode-keybindings-service-override"
import { LogLevel } from "vscode/services"
import { LangiumMonarchContent } from "./langiumMonarch.js"
import { loadLangiumWorker } from "../wrapperLangium.js"
import { useWorkerFactory } from "monaco-editor-wrapper/workerFactory"

export const setupLangiumClientClassic = async () => {
  const langiumWorker = loadLangiumWorker()
  return {
    logLevel: LogLevel.Debug,
    vscodeApiConfig: {
      userServices: {
        ...getConfigurationServiceOverride(),
        ...getKeybindingsServiceOverride()
      }
    },
    editorAppConfig: {
      $type: "classic",
      codeResources: {
        main: {
          text: "",
          fileExt: "langium",
          enforceLanguageId: "langium"
        }
      },
      useDiffEditor: false,
      editorOptions: {
        "semanticHighlighting.enabled": true,
        wordBasedSuggestions: "off",
        theme: "vs-dark"
      },
      languageDef: {
        monarchLanguage: LangiumMonarchContent,
        languageExtensionConfig: { id: "langium" }
      },
      monacoWorkerFactory: logger => {
        useWorkerFactory({
          logger
        })
      },
      htmlContainer: document.getElementById("monaco-editor-root")
    },
    languageClientConfigs: {
      langium: {
        languageId: "langium",
        connection: {
          options: {
            $type: "WorkerDirect",
            worker: langiumWorker
          }
        }
      }
    }
  }
}
