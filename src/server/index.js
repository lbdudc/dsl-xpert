// Node Express server
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import ModelController from './controllers/Model.js';

//read the env file
dotenv.config();


// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.log('Failed to connect to MongoDB', err);
    process.exit();
});


// Start Express server
const app = express();
app.use(express.json());


// Model routes
app.post('/api/models', ModelController.create);
app.get('/api/models', ModelController.findAll);
app.get('/api/models/:name', ModelController.findOne);
app.put('/api/models/:id', ModelController.update);
app.delete('/api/models/:id', ModelController.delete);


// TODO
// app.post('/api/models/:id/chat', ModelController.createChat);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});