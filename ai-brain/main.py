from fastapi import FastAPI, Query
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from engine.brain import Brain
from engine.data import DataCollection
from engine.trainer import fine_tune_model
import threading
from typing import Optional

app = FastAPI()
brain = Brain()
dataCollection = DataCollection()

class BrainInput(BaseModel):
    input: str
    userID: str
    chatID: str


@app.post("/think-stream")
async def stream_thinking(data: BrainInput):
    print(f"Started Thinking with stream: {data}")
    def generate():
        for chunk in brain.stream_think(data):
            yield chunk + "\n"
    return StreamingResponse(generate(), media_type="text/plain")

@app.post("/think")
async def process_input(data: BrainInput):
    print(f"Started Thinking About: {data}")
    output = brain.think(data)
    print(f"Done with thinking: {output}")
    brain.save()
    return {"output": output}

@app.get("/evolve")
async def evolve_brain():
    status = brain.evolve()
    brain.save()
    return {"status": status}

@app.get("/fine-tune")
async def trigger_fine_tune():
    threading.Thread(target=fine_tune_model, args=("brain.json",)).start()
    return {"status": "Fine-tuning started in background."}

@app.get("/get-chat-list/{userID}")
async def get_data_collection(userID: str):
    print(f"Getting data collection for user: {userID}")
    return dataCollection.getUserSessionHistoryByUserID(userID)

@app.get("/get-chat-data/{chatID}")
async def getSessionDataByChatID(chatID: str):
    print(f"Getting data collection for user: {chatID}")
    return dataCollection.getSessionDataByChatID(chatID)
