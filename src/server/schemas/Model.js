import mongoose from 'mongoose';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();  // Asegúrate de llamar a dotenv.config()
const Schema = mongoose.Schema;

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
const ALGORITHM = process.env.ALGORITHM;

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
    apiKey: {
        type: String,
        required: true,
    },
    iv: {
        type: String, 
        required: true
    },
    temperature: {
        type: Number,
        default: 0.2
    },
    maximumLength: {
        type: Number,
        default: 4095
    },
    topP: {
        type: Number,
        default: 1
    },
    repetitionPenalty: {
        type: Number,
        default: 0
    },
    stopSequences: {
        type: [String],
        default: ['###']
    },
    seed: {
        type: Number,
        default: 6
    },
    definition: {
        type: String,
        required: true
    },
    definitionExamples: {
        type: [{
            userInstruction: String,
            modelAnswer: String
        }],
        required: true
    },
    created_date: {
        type: Date,
        default: Date.now
    },
});

ModelSchema.methods.encryptApiKey = function(apiKey) {
    const iv = crypto.randomBytes(16); 
    if (Buffer.byteLength(ENCRYPTION_KEY, 'hex') !== 32) {
        throw new Error('La clave de encriptación debe tener 32 bytes.');
    }
    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
    let encrypted = cipher.update(apiKey, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    this.apiKey = encrypted;
    this.iv = iv.toString('hex'); 
};


ModelSchema.methods.decryptApiKey = function() {
    const iv = Buffer.from(this.iv, 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
    let decrypted = decipher.update(this.apiKey, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};

export default mongoose.model('Model', ModelSchema);
