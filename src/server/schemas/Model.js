import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ModelSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        default: null
    },
    developer: {
        type: String,
        required: true
    },
    modelType: {
        type: String,
        required: true
    },
    temperature: {
        type: Number,
        required: false,
        default: 1
    },
    seed: {
        type: Number,
        required: false,
        default: null
    },
    definition: {
        type: String,
        required: true
    },
    created_date: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Model', ModelSchema);