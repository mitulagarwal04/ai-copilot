import os
import requests
from dotenv import load_dotenv

load_dotenv()
HF_TOKEN = os.getenv("HF_API_KEY")

API_URL = "https://router.huggingface.co/v1/chat/completions"
headers = {
    "Authorization": f"Bearer {HF_TOKEN}",
}

def query(payload):
    response = requests.post(API_URL, headers=headers, json=payload)
    return response.json()

response = query({
    "messages": [
        {
            "role": "user",
            "content": "What is the capital of France?"
        }
    ],
    "model": "HuggingFaceTB/SmolLM3-3B:hf-inference"
})

print(response)
# print(response["choices"][0]["message"])