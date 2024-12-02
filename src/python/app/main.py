from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from transformers import pipeline, set_seed

app = FastAPI()

# For trials: python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload

# Define the request body using Pydantic
class ChatRequest(BaseModel):
    prompt: str
    model_name: str
    model_tag: str = "text-generation"
    temperature: float = 0.2
    max_length: int = 4096
    repetition_penalty: float = 0.0
    top_P: float = 1.0
    seed: int = 6
    stop_sequences: str = ";<stopSequence>###"

# Get model response
@app.post("/api/chat")
async def get_response(request: ChatRequest):
    try:
        # Load the model pipeline
        try:
            model_pipeline = pipeline(model_tag=model_tag, model=model_name)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error loading model: {str(e)}")

        # Split the stop sequences
        stop_seq = stop_sequences.split("<stopSequence>")

        # Set the seed for reproducibility
        set_seed(seed)

        # Generate response
        result = model_pipeline(
            request.prompt, 
            max_length=request.max_length, 
            temperature=request.temperature, 
            repetition_penalty=request.repetition_penalty,
            top_p=request.top_P
        )

        # Cut off the text based on the stop sequences provided (the pipeline API does not include this parameter) and return the result
        generated_text = result[0]['generated_text']
        for stop in stop_seq:
            generated_text = generated_text.split(stop)[0]
        return {"result": generated_text}

    except Exception as e:
         raise HTTPException(status_code=500, detail=str(e))