export const modelDeveloperItems = ["OpenAI", "Meta", "Mistral", "Google"];
export const grammarTypeItems = ["no grammar validator", "bnf", "langium"];
export const modelTypeItems = [
    "gpt-3.5-turbo",
    "gpt-3.5-turbo-0125",
    "gpt-3.5-turbo-16k",
    "gpt-4",
    "gpt-4-turbo",
];

export const initialValues = {
    modelName: '',
    decription: '',
    modelDeveloper: '',
    modelType: '',
    apiKey: '',
    temperature: 0.2,
    maximumLength: 4095,
    topP: 1,
    repetitionPenalty: 0,
    stopSequences: [';', '###'],
    seed: 6,
    grammarType: 'no-grammar-validator',
};
