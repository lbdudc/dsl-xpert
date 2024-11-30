import { SERVER_URL } from "@consts/server";
import { modelTypeItems } from "@consts/model";

/**
 * @description This service is responsible for selecting the server to reason with.
 * @param {String} model - The model to reason with
 * @returns {Object} - The result of the reasoning
 */
export class ServerSelectorService {
	constructor() { }

	/**
	 * @description This function calls the different endpoints for the different models
	 * @param {String} model - The model to reason with 
	 * @returns {Object} - The result of the model chat
	 */
	async sendMessage(model, messageObject) {
		// model has to be one of the modelTypeItems, else return an error
		if (!modelTypeItems.includes(model)) {
			return new Error("Model not valid, use one of the following: " + modelTypeItems.concat(", "));
		}

		let res;
		switch (model) {
			case "openai":
				res = await callOpenAIChat(messageObject);
				break;
			case "webllm":
				res = await this.callWebLLMChat(model);
				break;
			case "huggingface":
				res = await this.callHubbingFaceChat(model);
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



