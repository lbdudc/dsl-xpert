import { SERVER_URL } from "@consts/server";

export const fetchModel = async (id) => {
    const res = await fetch(`${SERVER_URL}/api/models/${id}`);

    if (!res.ok) {
        throw new Error("Model not found");
    };

    const data = await res.json();
    const { _id } = data;
    return { ...data, id: _id };
};

export const fetchModels = async () => {
    const res = await fetch(`${SERVER_URL}/api/models`);
    const data = await res.json();
    return data;
};

export const createModel = async (modelData) => {
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

export const updateModel = async (id, modelData) => {
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

export const deleteModel = async (id) => {
    const res = await fetch(`${SERVER_URL}/api/models/${id}`, {
        method: "DELETE",
    });

    const json = await res.json();
    return json;
};