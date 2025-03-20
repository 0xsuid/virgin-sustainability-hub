import chromadb
from typing import Union

from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

import json
import os  
import base64
from openai import AzureOpenAI  


app = FastAPI()

origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

chroma_client = chromadb.Client()
# switch `create_collection` to `get_or_create_collection` to avoid creating a new collection every time
collection = chroma_client.get_or_create_collection(name="sustainability_initiatives")

# switch `add` to `upsert` to avoid adding the same documents every time
collection.upsert(
    documents=[
        "This is a document about pineapple",
        "This is a document about apple",
        "This is a document about orange",
        "This is a document about mango",
        "This is a document about grapes",
        "This is a document about banana",
        "This is a document about oranges"
    ],
    ids=[
        "id1",
        "id2",
        "id3",
        "id4",
        "id5",
        "id6",
        "id7",
        ]
)

# Initialize Azure OpenAI Service client with key-based authentication    
endpoint = os.getenv("ENDPOINT_URL", "")  
deployment = os.getenv("DEPLOYMENT_NAME", "")  
subscription_key = os.getenv("AZURE_OPENAI_API_KEY", "")  

client = AzureOpenAI(  
    azure_endpoint=endpoint,  
    api_key=subscription_key,  
    api_version="2024-05-01-preview",

)


@app.get("/")
def read_root():
    return {"Hello": "World"}

class QueryRequest(BaseModel):
    query: str

@app.post("/search")
def read_item(query: QueryRequest):
        
    print(query.query)

    results = collection.query(
        query_texts=[query.query], # Chroma will embed this for you
        # where_document={"$contains":query.query},
        n_results=5 # how many results to return
    )
    
    prompt = f"Please provide a detailed answer to the question based only on given documents from RAG, do not answer outside from given info: {query.query}"
    prompt += "\n\n"
    prompt += json.dumps(results)

    chat_prompt = [
        {
            "role": "system",
            "content": [
                {
                    "type": "text",
                    "text": "You are an AI assistant that helps people find information."
                }
            ]
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": prompt
                }
            ]
        }
    ]
    
    completion = client.chat.completions.create(  
        model=deployment,  
        messages=chat_prompt,
        max_tokens=2523,  
        temperature=0.7,  
        top_p=0.95,  
        frequency_penalty=0,  
        presence_penalty=0,
        stop=None,  
        stream=False  
    )  

    return {"results": completion.choices[0].message.content}  
