import ModelSchema from "../schemas/Model.js";
import OpenAI from "openai";

export default class ModelController {
  static async create(req, res) {
    try {
      const model = new ModelSchema(req.body);
      model.encryptApiKey(req.body.apiKey);
      await model.save();
      res.send(model);
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  }

  static async findAll(req, res) {
    try {
      const models = await ModelSchema.find({});
      res.send(models);
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  }

  // get model by name
  static async findOne(req, res) {
    const name = req.params.name;

    try {
      const model = await ModelSchema.findOne({
        name: name,
      });
      if (!model) {
        return res
          .status(404)
          .send({ message: `Model with name ${name} not found` });
      }
      model.apiKey = model.decryptApiKey();
      res.send(model);
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  }

  static async update(req, res) {
    const id = req.params.id;
    try {
      let model = await ModelSchema.findById(id);
      if (!model) {
        return res
          .status(404)
          .send({ message: `Model with id ${id} not found` });
      }
      if (req.body.apiKey) {
        model.encryptApiKey(req.body.apiKey);
        delete req.body.apiKey;
      }
      Object.assign(model, req.body);
      await model.save();
      res.send(model);
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  }

  static async delete(req, res) {
    const id = req.params.id;
    try {
      const model = await ModelSchema.findByIdAndDelete({
        _id: id,
      });
      if (!model) {
        res.status(404).send({ message: `Model with id ${id} not found` });
      }
      res.send(model);
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  }

  static async createChat(req, res) {
    try {
      const { id } = req.params;
      let model = null;
      model = await ModelSchema.findOne({
        _id: id,
      });
      if (!model) {
        res.status(404).send({ message: `Model with id ${id} not found` });
      }
      const {
        modelType,
        temperature,
        maximumLength,
        topP,
        repetitionPenalty,
        stopSequences,
        seed,
        definition,
        definitionExamples,
      } = model;
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

      // Initialize the variables and the context for correct model inference
      const apiKey = model.decryptApiKey();
      const openai = new OpenAI({
        apiKey: apiKey,
      });
      let nTokens = 0;
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
      const userInput = { role: "user", content: req.body.message };
      messagesHistory.push(userInput);

      // Connect with OpenAI API
      let modelResponse = "";
      const doPetition = async () => {
        try {
          const stream = await openai.chat.completions.create({
            messages: messagesHistory,
            model: modelType,
            temperature: temperature,
            max_tokens: maximumLength,
            top_p: topP,
            frequency_penalty: repetitionPenalty,
            presence_penalty: repetitionPenalty,
            stop: stopSequences,
            seed: seed,
          });

          modelResponse = stream.choices[0].message.content;
          nTokens = stream.usage.total_tokens;

          const modelOutput = { role: "assistant", content: modelResponse };
          messagesHistory.push(modelOutput);

          res.send({
            messagesHistory,
            nTokens,
          });
        } catch (err) {
          console.error("Error during API request:", err);
          res.status(500).send({
            error:
              "Failed to retrieve response from OpenAI API. Please check your API key or try again later.",
          });
        }
      };
      doPetition();
    } catch (error) {
      console.error(error);
      res.status(500).send("Error sending data to OpenAI API");
    }
  }
}
