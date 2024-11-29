export const fetchModel = async (SERVER_URL, id) => {
	const res = await fetch(`${SERVER_URL}/api/models/${id}`);
	const data = await res.json();
	return data;
};

// Counts the approximate number of tokens in the input while adding the total number for the whole conversation
export const tokenCounter = async (text, nTokensConversation) => {
  const words = text.split(/\s+/);
  const nWords = words.length;
  const tokenCount = nWords * 2 + nTokensConversation; // The number of words is doubled to take into account the possible response as well

  return tokenCount;
}

export const createChat = async (userMessage, definition, definitionExamples) => {
	// Format definition examples
	let formattedDefinitionExamples = "";
	let defExample = "";
	definitionExamples.forEach((item) => {
		defExample =
			"\n<s>[INST] " +
			item.userInstruction +
			" [/INST]\n" +
			item.modelAnswer +
			" <s>\n";
		formattedDefinitionExamples += defExample;
	});

	// Initialize the context for correct model inference
	const initialContext = [
		{
			role: "system",
			content:
				"You are a helpful assistant that will provide answers converting our instructions using the grammar vocabulary and the examples that we will give you in the next two inputs.",
		},
		{
			role: "user",
			content:
				"I need you to use this grammar for a set of instructions that I will be giving you:\n\n" +
				definition +
				'\n\nCould you acknowledge that you understand what I want you to do in my following prompts?\nJust say "yes" or "no". I do not want you to do any additional work by now.',
		},
		{ role: "assistant", content: "Yes." },
		{
			role: "user",
			content:
				"In addition to prior grammar, these are some examples of what I expect you to do, separated by <s> and [INST] to highlight the instruction:" +
				formattedDefinitionExamples +
				'Could you acknowledge that you understand what I want you to do in my following prompts?\nJust say "yes" or "no". I do not want you to do any additional work by now.',
		},
		{ role: "assistant", content: "Yes." },
	];
	let messagesHistory = initialContext;

	// Format user input and add to the conversation
	const userInput = { role: "user", content: userMessage };
	messagesHistory.push(userInput);

	return messagesHistory
};