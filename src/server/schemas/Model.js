import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Asegúrate de llamar a dotenv.config()
const Schema = mongoose.Schema;

const ModelSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    default: null,
  },
  developer: {
    type: String,
    required: true,
  },
  modelType: {
    type: String,
    required: true,
  },
  request: {
    type: Object
  },
  apiKey: {
    type: String,
  },
  iv: {
    type: String,
  },
  temperature: {
    type: Number,
    default: 0.1,
  },
  maximumLength: {
    type: Number,
    default: 4095,
  },
  topK: {
    type: Number,
    default: 50,
  },
  topP: {
    type: Number,
    default: 1,
  },
  repetitionPenalty: {
    type: Number,
    default: 0,
  },
  stopSequences: {
    type: [String],
    default: [";", "###"],
  },
  seed: {
    type: Number,
    default: 6,
  },
  definition: {
    type: String,
    required: true,
  },
  grammarType: {
    type: Object,
    required: true,
  },
  definitionExamples: {
    type: [
      {
        userInstruction: String,
        modelAnswer: String,
      },
    ],
    required: true,
  },
  created_date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Model", ModelSchema);
