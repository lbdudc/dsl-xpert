import sys
import asyncio
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
from transformers import pipeline, set_seed
import logging
from io import StringIO
from typing import Optional

app = FastAPI()

# Define the request body using Pydantic
class ChatRequest(BaseModel):
    prompt: str
    model_name: str
    model_tag: str = "text-generation"
    temperature: float = 0.2
    max_length: int = 4096
    repetition_penalty: float = 1.0
    top_K: int = 50
    top_P: float = 0.9
    seed: int = 6
    stop_sequences: Optional[str] = None  # Optional parameter

# Custom class to capture the tqdm progress bar output
class WebSocketStdout(StringIO):
    def __init__(self, websocket: WebSocket):
        super().__init__()
        self.websocket = websocket

    def write(self, message):
        super().write(message)  # Write to the internal buffer
        asyncio.create_task(self.websocket.send_text(message))  # Send to WebSocket

# WebSocket route for real-time updates
@app.websocket("/ws")
async def websocket_chat(websocket: WebSocket):
    await websocket.accept()

    try:
        # Accept the request and extract data (you could send it from the client side)
        request = await websocket.receive_text()
        request_data = eval(request)  # Convert string to dict (for simplicity)
        chat_request = ChatRequest(**request_data)  # This validates and parses the incoming request

        prompt = chat_request.prompt
        model_name = chat_request.model_name

        # Notify the client that model loading has started
        await websocket.send_text("Loading model...")

        # Set seed for reproducibility
        set_seed(chat_request.seed)

        # Redirect stdout to capture tqdm download progress
        captured_stdout = WebSocketStdout(websocket)
        sys.stdout = captured_stdout  # Redirect print to WebSocket

        try:
            # Load the model pipeline for generation, capturing progress logs
            model_pipeline = pipeline(task=chat_request.model_tag, model=model_name, trust_remote_code=True)

            # Notify client once model is loaded
            await websocket.send_text(f"Model {model_name} loaded successfully!")

        except Exception as e:
            await websocket.send_text(f"Error loading model: {str(e)}")
            return  # Exit if model loading failed

        # Notify client that generation is starting
        await websocket.send_text("Starting text generation...")

        # Generate response
        result = model_pipeline(
            prompt,
            max_length=chat_request.max_length,
            temperature=chat_request.temperature,
            repetition_penalty=chat_request.repetition_penalty,
            top_k=chat_request.top_K,
            top_p=chat_request.top_P,
        )

        generated_text = result[0]["generated_text"]

        # Truncate generated text using stop sequences if provided
        if chat_request.stop_sequences:
            stop_seq = [seq for seq in chat_request.stop_sequences.split("<stopSequence>") if seq.strip()]
            for stop in stop_seq:
                generated_text = generated_text.split(stop)[0]

        # Send generated text back to the client
        await websocket.send_text(f"Generated Text: {generated_text}")

        # Notify client when the generation is complete
        await websocket.send_text("Generation complete.")

    except WebSocketDisconnect:
        print("Client disconnected.")
    finally:
        sys.stdout = sys.__stdout__  # Restore original stdout after completion
