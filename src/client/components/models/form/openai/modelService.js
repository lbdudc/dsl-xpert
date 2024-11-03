export const fetchModel = async (SERVER_URL, id) => {
    const res = await fetch(`${SERVER_URL}/api/models/${id}`);
    const data = await res.json();
    return data;
};

export const createModel = async (SERVER_URL, modelData) => {
    const res = await fetch(`${SERVER_URL}/api/models`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(modelData),
    });

    const json = await res.json();
    return json;
};

export const updateModel = async (SERVER_URL, id, modelData) => {
    const res = await fetch(`${SERVER_URL}/api/models/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(modelData),
    });

    const json = await res.json();
    return json;
};

export const assignModelProperties = (model, refs) => {
    const {
        _id, developer, modelType, name, apiKey, temperature, maximumLength,
        topP, repetitionPenalty, stopSequences, seed, description, definition, definitionExamples
    } = model;

    refs.id.value = _id;
    refs.modelDeveloper.value = developer;
    refs.modelType.value = modelType;
    refs.name.value = name;
    refs.apiKey.value = apiKey;
    refs.temperature.value = temperature;
    refs.maximumLength.value = maximumLength;
    refs.topP.value = topP;
    refs.repetitionPenalty.value = repetitionPenalty;
    refs.stopSequences.value = stopSequences;
    refs.seed.value = seed;
    refs.description.value = description;
    refs.definition.value = definition;
    refs.definitionExamples.value = definitionExamples;
};
