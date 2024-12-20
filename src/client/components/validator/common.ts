/******************************************************************************
 * Copyright 2022 TypeFox GmbH
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 ******************************************************************************/
/******************************************************************************
 * Re-used here compiled in ../libs/worker/common.js
 * https://github.com/eclipse-langium/langium-website
 ******************************************************************************/
import {
  HelloWorldGrammar,
  LangiumTextMateContent,
  DSLInitialContent,
} from "./constants.js";
import { Disposable } from "vscode-languageserver";
import { overlay, throttle } from "./utils.js";
import { addMonacoStyles, createUserConfig, MonacoEditorLanguageClientWrapper } from "langium-website-core/bundle";
import { Diagnostic, DocumentChangeResponse } from "langium-ast-helper";
// import { DefaultAstNodeLocator } from "langium";
import { createServicesForGrammar } from "langium/grammar";
import { generateTextMate } from "langium-cli/textmate";
export { share, overlay } from './utils.js';
export { addMonacoStyles, MonacoEditorLanguageClientWrapper };

export interface PlaygroundParameters {
  grammar: string;
  content: string;
  grammarErrors: Diagnostic[];
  dslErrors: Diagnostic[];
}

/**
 * Current langium grammar in the playground
 */
let currentGrammarContent = '';

/**
 * Current DSL program in the playground
 */

let currentDSLContent = '';

/**
 * Current Error the playground
 */

let currentGrammarErrors: Diagnostic[] = [];
/**
 * Current DSL Error the playground
 */

let currentDSLErrors: Diagnostic[] = [];

/**
 * DSL wrapper, allowing us to quickly access the current in-model code
 */
let dslWrapper: MonacoEditorLanguageClientWrapper | undefined = undefined;

/**
 * Update delay for new grammars & DSL programs to be processed
 * Any new updates occurring during this delay will cause an existing update to be cancelled,
 * and will reset the delay again
 */
const languageUpdateDelay = 150;

/**
 * Counter for language ids, which are incremented on each change
 */
let nextIdCounter = 0;


/**
 * Helper for retrieving the next language id to use, to avoid conflicting with prior ones
 */
function nextId(): string {
  return (nextIdCounter++).toString();
}


/**
 * Helper to retrieve the current grammar & program in the playground.
 * Typically used to generate a save link to this state
 */
export function getPlaygroundState(): PlaygroundParameters {
  return {
    grammar: currentGrammarContent,
    content: currentDSLContent,
    grammarErrors: currentGrammarErrors,
    dslErrors: currentDSLErrors
  };
}


export function getDSLWrapper() {
  return dslWrapper;
}

/**
 * Starts the playground
 * 
 * @param leftEditor Left editor element
 * @param rightEditor Right editor element
 * @param encodedGrammar Encoded grammar to optionally use
 * @param encodedContent Encoded content to optionally use
 */
export async function setupPlayground(
  leftEditor: HTMLElement,
  rightEditor: HTMLElement,
): Promise<{ langiumWrapper: MonacoEditorLanguageClientWrapper; dslWrapper: MonacoEditorLanguageClientWrapper; setupDSLWrapper: () => Promise<void>; overlay: (show: boolean, error: boolean) => void; }> {
  // setup initial contents for the grammar & dsl (Hello World)
  currentGrammarContent = HelloWorldGrammar;
  currentDSLContent = DSLInitialContent;

  // handle to a Monaco language client instance for the DSL (program) editor
  let dslClient;

  // setup langium wrapper
  const langiumWrapper = await getFreshLangiumWrapper(leftEditor);

  // setup DSL wrapper
  await setupDSLWrapper().catch((e) => {
    // failed to setup, can happen with a bad Langium grammar, report it & discard
    console.error('DSL editor setup error: ' + e);
    overlay(true, true);
  });

  // retrieve the langium language client
  const langiumClient = langiumWrapper.getLanguageClient();
  if (!langiumClient) {
    throw new Error('Unable to obtain language client for the Langium editor!');
  }

  // register to receive new grammars from langium, and send them to the DSL language client
  langiumClient.onNotification('browser/DocumentChange', (resp: DocumentChangeResponse) => {

    // verify the langium client is still running, and didn't crash due to a grammar issue
    if (!langiumClient.isRunning()) {
      throw new Error('Langium client is not running');
    }

    // extract & update current grammar
    currentGrammarContent = resp.content;

    if (resp.diagnostics.filter(d => d.severity === 1).length) {
      // error in the grammar, report an error & stop here
      overlay(true, true);
      currentGrammarErrors = resp.diagnostics;
      return;
    }

    // no errors
    currentGrammarErrors = [];

    // set a new timeout for updating our DSL grammar & editor, 200ms, to avoid intermediate states
    throttle(1, languageUpdateDelay, async () => {
      // display 'Loading...' while we regenerate the DSL editor
      overlay(true, false);

      if (!dslWrapper) {
        // no dsl wrapper to start (or previously crashed), setup from scratch
        // no exception handling here, as we're 'assuming' the Langium grammar is valid at this point
        // or we already have a wrapper that crashed (2nd case here)
        await setupDSLWrapper();
        overlay(false, false);
      } else {
        // existing wrapper, attempt to first dispose
        await dslWrapper?.dispose().then(async () => {
          // disposed successfully, setup & clear overlay
          await setupDSLWrapper();
          overlay(false, false);

        }).catch(async (e: any) => {
          // failed to dispose, report & discard this error
          // can happen when a previous editor was not started correctly
          console.error('DSL editor disposal error: ' + e);
          overlay(true, true);
        });
      }
    });
  });

  /**
   * Helper to configure & retrieve a fresh DSL wrapper
   */
  async function setupDSLWrapper(): Promise<void> {
    // get a fresh DSL wrapper
    dslWrapper = await getFreshDSLWrapper(rightEditor, nextId(), currentDSLContent, currentGrammarContent);

    // get a fresh client
    dslClient = dslWrapper?.getLanguageClient();
    if (!dslClient) {
      throw new Error('Failed to retrieve fresh DSL LS client');
    }

    // re-register
    registerForDocumentChanges(dslClient);
  }

  window.addEventListener("resize", () => {
    dslWrapper?.updateLayout();
    langiumWrapper.updateLayout();
  });

  // drop the overlay once done here
  overlay(false, false);
  return {
    langiumWrapper,
    dslWrapper,
    overlay
  };
}


/**
 * Starts a fresh Monaco LC wrapper
 * 
 * @param htmlElement Element to attach the editor to
 * @param languageId ID of the language to use
 * @param code Program to show in the editor
 * @param grammarText Grammar text to use for the worker & monarch syntax
 * @returns A promise resolving to a configured & started DSL wrapper
 */
async function getFreshDSLWrapper(
  htmlElement: HTMLElement,
  languageId: string,
  code: string,
  grammarText: string
): Promise<MonacoEditorLanguageClientWrapper | undefined> {
  // construct and set a new monarch syntax onto the editor
  const { Grammar } = await createServicesForGrammar({ grammar: grammarText });
  const worker = await getLSWorkerForGrammar(grammarText);
  const wrapper = new MonacoEditorLanguageClientWrapper();
  const textmateGrammar = JSON.parse(generateTextMate(Grammar, { id: languageId, grammar: 'UserGrammar' }));
  return wrapper.start(createUserConfig({
    languageId,
    code,
    worker,
    textmateGrammar
  }), htmlElement).then(() => {
    return wrapper;
  }).catch(async (e: any) => {
    console.error('Failed to start DSL wrapper: ' + e);
    // don't leak the worker on failure to start
    // normally we wouldn't need to manually terminate, but if the LC is stuck in the 'starting' state, the following dispose will fail prematurely
    // and the worker will leak
    worker.terminate();
    // try to cleanup the existing wrapper (but don't fail if we can't complete this action)
    // particularly due to a stuck LC, which can cause this to fail part-ways through
    try {
      await wrapper.dispose();
    } catch (e) { }
    return undefined as MonacoEditorLanguageClientWrapper | undefined;
  });
}


/**
 * Gets a fresh langium wrapper
 * 
 * @param htmlElement Element to attach the wrapper to
 * @returns A promise resolving to a configured & started Langium wrapper
 */
async function getFreshLangiumWrapper(htmlElement: HTMLElement): Promise<MonacoEditorLanguageClientWrapper> {
  const langiumWrapper = new MonacoEditorLanguageClientWrapper();
  await langiumWrapper.start(createUserConfig({
    languageId: "langium",
    code: currentGrammarContent,
    worker: "../../libs/worker/langiumServerWorker.js",
    textmateGrammar: LangiumTextMateContent
  }), htmlElement);
  return langiumWrapper;
}


/**
 * Document change listener for modified DSL programs
 */
let dslDocumentChangeListener: Disposable;

/**
 * Helper for registering to receive new ASTs from parsed DSL programs
 */
function registerForDocumentChanges(dslClient: any | undefined) {
  // dispose of any existing listener
  if (dslDocumentChangeListener) {
    dslDocumentChangeListener.dispose();
  }

  // register to receive new ASTs from parsed DSL programs
  dslDocumentChangeListener = dslClient!.onNotification('browser/DocumentChange', (resp: DocumentChangeResponse) => {

    // retrieve existing code from the model
    currentDSLContent = dslWrapper?.getModel()?.getValue() as string;

    // delay changes by 200ms, to avoid getting too many intermediate states
    throttle(2, languageUpdateDelay, () => {

      // show errors if any
      if (resp.diagnostics.filter(d => d.severity === 1).length) {
        currentDSLErrors = resp.diagnostics;
        return;
      }

      // no errors
      currentDSLErrors = [];
    });
  });
}


/**
 * Produce a new LS worker for a given grammar, which returns a Promise once it's finished starting
 * 
 * @param grammar To setup LS for
 * @returns Configured LS worker
 */
async function getLSWorkerForGrammar(grammar: string): Promise<Worker> {
  return new Promise((resolve, reject) => {
    // create & notify the worker to setup w/ this grammar
    const worker = new Worker("../../libs/worker/userServerWorker.js");
    worker.postMessage({
      type: "startWithGrammar",
      grammar
    });

    // wait for the worker to finish starting
    worker.onmessage = (event) => {
      if (event.data.type === "lsStartedWithGrammar") {
        resolve(worker);
      }
    };

    worker.onerror = (event) => {
      reject(event);
    };

  });
}
