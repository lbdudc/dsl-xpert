import { EmptyFileSystem } from "langium";
import { startLanguageServer } from "langium/lsp";
import {
  BrowserMessageReader,
  BrowserMessageWriter,
  createConnection,
} from "vscode-languageserver/browser.js";
import { createBnfServices } from "./bnf-module.js";
const messageReader = new BrowserMessageReader(self);
const messageWriter = new BrowserMessageWriter(self);
const connection = createConnection(messageReader, messageWriter);
const { shared } = createBnfServices(
  Object.assign({ connection }, EmptyFileSystem)
);
startLanguageServer(shared);
//# sourceMappingURL=main-browser.js.map
