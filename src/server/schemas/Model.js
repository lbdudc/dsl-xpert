import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ModelSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
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