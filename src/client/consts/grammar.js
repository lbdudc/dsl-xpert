export const grammarTypeItems = [
    {
        name: "No grammar validator",
        code: "no-grammar-validator",
    },
    // {
    //     name: "BNF",
    //     code: "bnf",
    // },
    {
        name: "Langium",
        code: "langium",
    }
];

export const hyperParameterPresets = {
    "chatgpt-4o-latest": {
        temperature: 0.7,
        maximumLength: 4095,
        topP: 1,
        repetitionPenalty: 0,
        stopSequences: ["\\n"],
    }
};

