from fastapi import FastAPI
from transformers import pipeline

app = FastAPI()

# Load model pipeline
@app.post("/api/chat")
async def predict(text: str):
    # We load the pipeline here
    model_pipeline = pipeline("text-classification", model="distilbert-base-uncased-finetuned-sst-2-english")
    result = model_pipeline(text)
    return {"result": result}
