// HuggingFace API
import { HUGGINGFACE_API_URL } from "@consts/server";

// Get all models
export const fetchModels = async (queryParams, token) => {
    const response = await fetch(`${HUGGINGFACE_API_URL}/models?${new URLSearchParams(queryParams).toString()}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return await response.json();
}

// Get model details
export const fetchModelDetails = async (modelId, token) => {
    const response = await fetch(`${HUGGINGFACE_API_URL}/models/${modelId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return await response.json();
}

export const fetchInferenceModels = async (params, token) => {

    const queryParams = {
        ...params,
        inference: 'warm',
        pippeline_tag: 'text-generation',
    }

    const response = await fetch(`${HUGGINGFACE_API_URL}/models?${new URLSearchParams(queryParams).toString()}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return await response.json();
}