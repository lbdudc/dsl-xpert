from fastapi import FastAPI
from transformers import pipeline

app = FastAPI()

# Load model pipeline
model_pipeline = pipeline("text-classification", model="distilbert-base-uncased-finetuned-sst-2-english")

@app.post("/predict/")
async def predict(text: str):
    result = model_pipeline(text)
    return {"result": result}
