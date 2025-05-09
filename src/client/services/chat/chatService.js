import { SERVER_URL, HUGGINGFACE_INFERENCES_API_URL, HUGGINGFACE_CUSTOM_URL } from "@consts/server";
import { modelDeveloperItems } from "@consts/model";
import { CreateMLCEngine, prebuiltAppConfig } from "@mlc-ai/web-llm";

let socket = null;

const connectWebSocket = (model, onMessageCallback) => {
	return new Promise((resolve, reject) => {
	  socket = new WebSocket(`${HUGGINGFACE_CUSTOM_URL}/ws`);
  
	  socket.onopen = () => {
		console.log("WebSocket connected.");
		const { modelType, modelTag, temperature, maxLength, repetitionPenalty, topK, topP, seed, stopSequences, apiKey } = model;
		const requestPayload = {
			prompt: "firstLoad",
			model_name: modelType,
			model_tag: modelTag,
			temperature: temperature,
			max_length: maxLength,
			repetition_penalty: repetitionPenalty,
			top_K: topK,
			top_P: topP,
			seed: seed,
			apiKey: apiKey,
			stop_sequences: stopSequences
		};
		socket.send(JSON.stringify(requestPayload))
	  };
  
	  socket.onclose = () => {
		console.log("WebSocket disconnected.");
	  };
  
	  socket.onerror = (error) => {
		console.error("WebSocket error:", error);
		reject(error);
	  };
  
	  socket.onmessage = (event) => {
		const data = event.data;
		console.log("WebSocket message:", data);
  
		// Call the callback function with the data
		if (onMessageCallback && typeof onMessageCallback === "function") {
		  onMessageCallback(data || ""); // Pass message text to callback
		}

		if (data.includes("loaded successfully!")) {
			resolve(); // Resolve the promise to end "settingUpModel" state
		  }
	  };
	});
  };

export const reconnectWebSocket = () => {
	return new Promise((resolve, reject) => {
		if (socket && socket.readyState === WebSocket.OPEN) {
		socket.close(); // Close the previous WebSocket if it's open
		}

		// Create a new WebSocket connection
		socket = new WebSocket(`${HUGGINGFACE_CUSTOM_URL}/ws`);

		socket.onopen = () => {
		console.log("WebSocket connected.");
		resolve(socket); // Resolve the promise when WebSocket is open
		};

		socket.onerror = (error) => {
		console.error("WebSocket error:", error);
		reject(error); // Reject the promise if there's an error
		};

		socket.onclose = () => {
		console.log("WebSocket disconnected.");
		};
	});
};

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
			case "huggingface-custom":
				return connectWebSocket(model, callbackFunct).then(() => {
					return reconnectWebSocket();
				  })
			default:
				return new Error("Model not valid, use one of the following: getDefinition, getExamples, getInstructions");
		}
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

const callHuggingFaceCustomChat = async (messageObject) => {
	const { userMessage, modelType, modelTag, temperature, maxLength, repetitionPenalty, topK, topP, seed, stopSequences, apiKey } = messageObject;

	if (socket && socket.readyState === WebSocket.OPEN) {
		const requestPayload = {
			prompt: userMessage.map(message => message.content).join(". "),
			model_name: modelType,
			model_tag: modelTag,
			temperature: temperature,
			max_length: maxLength,
			repetition_penalty: repetitionPenalty,
			top_K: topK,
			top_P: topP,
			seed: seed,
			apiKey: apiKey,
			stop_sequences: stopSequences
		};

		return new Promise((resolve, reject) => {
			const onMessage = (event) => {
				try {
				const response = event.data;
				console.log("Received WebSocket response:", response); // Log the server's response
		
				// Add the assistant response to the userMessage array immediately
				userMessage.push({
					content: response,
					role: "assistant",
				});
		
				// Resolve the promise with the updated conversation history
				resolve({
					messagesHistory: userMessage,
				});
		
				} catch (error) {
				reject(new Error("Failed to parse WebSocket response: " + error.message));
				}
			};
		
			// Update socket listener
			socket.onmessage = onMessage; 
		
			try {
				socket.send(JSON.stringify(requestPayload));
				console.log("Request sent:", requestPayload);
			} catch (error) {
				reject(new Error("Failed to send WebSocket request: " + error.message));
			}
			});

	} else {
		return Promise.reject(new Error("WebSocket is not open or is unavailable."));
	}
};


