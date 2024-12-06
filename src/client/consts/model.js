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
    grammarType: grammarTypeItems[0],
    singleStopSequence: ""
};

export const modelDeveloperItems = [
    { code: "openai", name: "OpenAI" },
    { code: "webllm", name: "WebLLM" },
    { code: "huggingface-inference", name: "Hugging Face Inference" },
    { code: "huggingface-custom", name: "Hugging Face Custom Model" },
    { code: "curl", name: "Curl Custom Model" },
];