import { SERVER_URL, HUGGINGFACE_INFERENCES_API_URL } from "@consts/server";
import { modelDeveloperItems } from "@consts/model";
import { CreateMLCEngine, prebuiltAppConfig } from "@mlc-ai/web-llm";

/**
 * @description This service is responsible for selecting the server to reason with.
 * @param {String} model - The model to reason with
 * @returns {Object} - The result of the reasoning
 */
export class ServerSelectorService {
	constructor() { }

	async loadModel(model, callbackFunct) {
		const { developer } = model;
		if (!modelDeveloperItems.find(model => model.code === developer)) {
			return new Error("Model not valid, use one of the following: " + modelDeveloperItems.concat(", "));
		}

		let res;
		switch (developer) {
			case "webllm":
				const { modelType } = model;
				if (!modelType) {
					throw new Error("Model type is required");
				}
				// if not in the prebuiltAppConfig, then return an error
				const selectedModel = prebuiltAppConfig.model_list.find((item) => item.model_id === modelType);

				if (!selectedModel) {
					return new Error("Model not found");
				}

				// Callback function to update model loading progress
				return CreateMLCEngine(modelType, { initProgressCallback: callbackFunct });
			case "huggingface":
				res = await this.loadHubbingFaceModel(model);
				break;
			default:
				return new Error("Model not valid, use one of the following: getDefinition, getExamples, getInstructions");
		}
		return res;
	}

	/**
	 * @description This function calls the different endpoints for the different models
	 * @param {String} model - The model to reason with 
	 * @returns {Object} - The result of the model chat
	 */
	async sendMessage(model, messageObject = {}, customEngine) {
		// model has to be one of the modelTypeItems, else return an error
		if (!modelDeveloperItems.find(model => model === model)) {
			return new Error("Model not valid, use one of the following: " + modelDeveloperItems.map(model.code).concat(", "));
		}

		let res;
		switch (model) {
			case "openai":
				res = await callOpenAIChat(messageObject);
				break;
			case "webllm":
				res = await callWebLLMChat(messageObject, customEngine);
				break;
			case "huggingface-inference":
				res = await callHuggingFaceInferenceChat(messageObject);
				break;
			case "huggingface-custom":
				res = await callHuggingFaceCustomChat(messageObject);
				break;
			case "curl":
				res = await this.callCurlChat(model);
				break;
			default:
				return new Error("Reasoning not valid, use one of the following: getDefinition, getExamples, getInstructions");
		}
		return res;
	}
}

const callOpenAIChat = async (messageObject) => {
	const { id, userMessage } = messageObject;

	if (!id || !userMessage) {
		throw new Error("Model ID and user message are required");
	}

	const response = await fetch(`${SERVER_URL}/api/models/${id}/chat`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			message: userMessage,
		}),
	});
	if (!response.ok) {
		const error = await response.text();
		throw new Error(JSON.stringify(JSON.parse(error), null, 4));
	}
	const data = await response.json();
	return data;
};

const callWebLLMChat = async (messageObject, customEngine) => {
	const { userMessage } = messageObject;

	const reply = await customEngine.chat.completions.create({
		messages: userMessage
	});

	userMessage.push(reply.choices[0].message);

	return {
		messagesHistory: userMessage,
	}
}

const callHuggingFaceInferenceChat = async (messageObject) => {
	const { userMessage, modelType, apiKey } = messageObject;

	// TODO: cambiar Chat.vue, para que el createChat devuelva todo en un string

	const response = await fetch(`${HUGGINGFACE_INFERENCES_API_URL}/models/${modelType}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${apiKey}`,
		},
		body: JSON.stringify({
			inputs: userMessage.map(message => message.content).join(". ")
		})
	});

	if (!response.ok) {
		const error = await response.text();
		throw new Error(JSON.stringify(JSON.parse(error), null, 4));
	}

	const data = await response.json();
	userMessage.push({
		content: data[0].generated_text,
		role: "assistant",
	});

	return {
		messagesHistory: userMessage,
	}
}


