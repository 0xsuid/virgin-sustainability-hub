import json
import os  
import chromadb
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware 
from openai import AzureOpenAI  
import pandas as pd
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

origins = [
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

df = pd.read_csv('../resources/Virgin_StartHack_Sample_Initiatives.csv', encoding='unicode_escape')
df.dropna(axis='columns', how='all',  inplace=True)

documents = []
ids = []

for index in range(len(df.index)):
    documents.append(json.dumps(df.iloc[index].to_json()))
    ids.append(f"doc_{index}")
    # print(df.iloc[index].to_json())

collection.upsert(
    documents=documents,
    ids=ids
)

# Initialize Azure OpenAI Service client with key-based authentication    
endpoint = os.getenv("ENDPOINT_URL")  
deployment = os.getenv("DEPLOYMENT_NAME")  
subscription_key = os.getenv("AZURE_OPENAI_API_KEY")  

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
    
    prompt = "Context: \n" + json.dumps(results) + "\n\n"
    prompt += "Question: {query.query} \n"
    prompt += "Please provide an answer to the above question only if it directly relates to the sustainability initiatives mentioned in the context. If the question cannot be answered based on the provided context, return an empty sustainability_initiatives JSON object. Do not include any explanations or irrelevant information.If the context contains extra sustainability initiatives that are not relevant to the question, exclude them from your answer."
    prompt += """
    Ensure that the response strictly adheres to the relevance of sustainability initiatives as they pertain to the question asked.
    Do not include any explanations, only provide a RFC8259 compliant JSON response following this format without deviation and do not add new line and include result only if it is relevant:
    {
        "sustainability_initiatives": [
            {
                "Virgin_Company": "Virgin Atlantic",
                "Initiative": "Youngest, Cleanest Fleet in the Sky",
                "Challenge": "The time for action against climate change is now. Virgin Atlantic are on a mission to achieve net-zero by 2050.",
                "What_Virgin_is_doing": "Virgin Atlantic is working to accelerate the development of sustainable fuels. On November 28th, we made history with Flight100— becoming the first commercial airline to fly across the Atlantic on 100% SAF - marking a key milestone on the path to decarbonising aviation.",
                "Call_to_Action": [
                    "Stay informed",
                    "Sign up for updates on ways you can get involved in making a difference"
                ],
                "Links": [
                    "https://corporate.virginatlantic.com/gb/en/business-for-good/planet.html",
                    "https://corporate.virginatlantic.com/gb/en/business-for-good/planet/fuel/flight100.html",
                    "https://corporate.virginatlantic.com/gb/en/business-for-good/planet/fuel.html"
                ]
            },
            {
                "Virgin_Company": "Virgin Atlantic & Virgin Unite",
                "Initiative": "Protecting our Planet",
                "Challenge": "Contrails, aircraft condensation trails, heighten the effect of global warming, which may account for more than half (57%) of the entire climate impact of aviation.",
                "What_Virgin_is_doing": "Virgin Atlantic, Virgin Unite, and Flight100 have also joined forces with RMI to establish the Contrail Impact Task Force, aiming to address the environmental impact of aircraft contrails.",
                "Call_to_Action": [
                    "Stay informed",
                    "Donate to RMI"
                ],
                "Links": [
                    "https://corporate.virginatlantic.com/gb/en/business-for-good/planet/fleet.html",
                    "https://www.virgin.com/virgin-unite/latest/flight100-virgin-atlantic-and-rmi-test-new-ways-to-reduce-aviations-climate"
                ]
            }
        ]
    }
    """

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

    return {"results": json.loads(completion.choices[0].message.content)}  
