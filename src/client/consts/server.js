export const SERVER_URL = `${import.meta.env.VITE_SERVER_URL || "http://localhost:5000"}`;
export const HUGGINGFACE_API_URL = "https://huggingface.co/api";
export const HUGGINGFACE_INFERENCES_API_URL = "https://api-inference.huggingface.co";
export const HUGGINGFACE_CUSTOM_URL = `${import.meta.env.HUGGINGFACE_CUSTOM_URL || "ws://localhost:8000"}`;