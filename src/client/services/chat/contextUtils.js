/**
 * @file contextUtils.js
 * @description This file contains utility functions for handling the context of the conversation
 * @module Services/Chat/ContextUtils
 * @param {String} text - The text to be tokenized 
 * @param {Number} nTokensConversation - The number of tokens in the conversation
 * @returns {Number} - The total number of tokens in the conversation 
 */
export const tokenCounter = async (text, nTokensConversation) => {
    const words = text.split(/\s+/);
    const nWords = words.length;

    // The number of words is doubled to take into account the possible response as well
    const tokenCount = nWords * 2 + nTokensConversation;
    return tokenCount;
}

/**
 * @description This function creates a chat context for the model inference
 * @param {String} userMessage - The user message to be included in the conversation
 * @param {String} definition - The grammar definition to be included in the conversation 
 * @param {Array} definitionExamples - The grammar examples to be included in the conversation
 * @returns {Array} - The conversation context for the model inference
 */
export const createChat = async (userMessage, definition, definitionExamples) => {
    // Format definition examples
    let formattedDefinitionExamples = "";
    let defExample = "";
    definitionExamples.forEach((item) => {
        defExample =
            "\n<s>[INST] " +
            item.userInstruction +
            " [/INST]\n" +
            item.modelAnswer +
            " <s>\n";
        formattedDefinitionExamples += defExample;
    });

    // Initialize the context for correct model inference
    const initialContext = [
        {
            role: "system",
            content:
                "You are a helpful assistant that will provide answers converting our instructions using the grammar vocabulary and the examples that we will give you in the next two inputs.",
        },
        {
            role: "user",
            content:
                "I need you to use this grammar for a set of instructions that I will be giving you:\n\n" +
                definition +
                '\n\nCould you acknowledge that you understand what I want you to do in my following prompts?\nJust say "yes" or "no". I do not want you to do any additional work by now.',
        },
        { role: "assistant", content: "Yes." },
        {
            role: "user",
            content:
                "In addition to prior grammar, these are some examples of what I expect you to do, separated by <s> and [INST] to highlight the instruction:" +
                formattedDefinitionExamples +
                'Could you acknowledge that you understand what I want you to do in my following prompts?\nJust say "yes" or "no". I do not want you to do any additional work by now.',
        },
        { role: "assistant", content: "Yes." },
    ];
    let messagesHistory = initialContext;

    // Format user input and add to the conversation
    const userInput = { role: "user", content: userMessage };
    messagesHistory.push(userInput);

    return messagesHistory
};