import { grammarTypeItems } from "@consts/grammar";

export const initialValues = {
    id: null,
    developer: null,
    modelType: null,
    name: null,
    apiKey: "",
    temperature: 0.2,
    maximumLength: 4095,
    topP: 1,
    repetitionPenalty: 0,
    stopSequences: [';', '###'],
    seed: 6,
    decription: '',
    definition: null,
    definitionExamples: [
        { "userInstruction": "", "modelAnswer": "" }
    ],
    grammarType: grammarTypeItems[2],
    singleStopSequence: ""
};

// Create an enum for model types
export const modelTypeItems = [
    "openai",
    "webllm",
    "huggingface",
    "curl"
];

export const modelDeveloperItems = [
    { code: "openai", name: "OpenAI" },
    { code: "webllm", name: "WebLLM" },
    { code: "huggingface", name: "Hugging Face" },
    { code: "curl", name: "Curl Custom Model" },
];