/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2024 TypeFox and others.
 * Licensed under the MIT License. See LICENSE in the package root for license information.
 * ------------------------------------------------------------------------------------------ */

export const LangiumMonarchContent = {
  keywords: ["::=", "|", "<", ">"],
  tokenizer: {
    root: [
      [/[<][^>]+[>]/, "variable"], // Highlight BNF non-terminals
      [/::=/, "operator"], // BNF assignment
      [/\|/, "operator"], // BNF OR symbol
      [/[^<|>]+/, "string"], // Everything else is string
    ],
  },
};
