import os
import requests
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

app = FastAPI()

# Allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

load_dotenv()
HF_API_KEY = os.getenv("HF_API_KEY")
MODEL_ID = "facebook/blenderbot-400M-distill"  # you can try other models too


class ChatRequest(BaseModel):
    message: str

@app.post("/chat")
async def chat_endpoint(req: ChatRequest):
    headers = {"Authorization": f"Bearer {HF_API_KEY}"}
    payload = {"inputs": req.message}

    response = requests.post(
        f"https://api-inference.huggingface.co/models/{MODEL_ID}",
        headers=headers,
        json=payload,
    )
    if response.status_code != 200:
        return {"reply": "Error from model."}

    data = response.json()
    try:
        reply = data[0]["generated_text"]
    except Exception:
        reply = str(data)

    return {"reply": reply}
