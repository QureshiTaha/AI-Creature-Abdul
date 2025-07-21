const axios = require('axios');
const WebSocket = require('ws');

const AI_SERVER_URL = 'http://localhost:8000';

async function askBrain(data) {
    try {
        console.log(`Asking AI Request: ${data.input} with userID: ${data.userID}`);
        
        const res = await axios.post(`${AI_SERVER_URL}/think`, { data });
        console.log(`Asking AI Response: ${res.data.output}`);
        return res.data.output;
    } catch (error) {
        console.log(error);
        return 'Error communicating with AI.';
    }
}

async function askBrainStream(data, onChunk) {
    console.log(`Asking AI Stream Request: ${data.input} with userID: ${data.userID}, chatID: ${data.chatID}`);
    const response = await fetch(`${AI_SERVER_URL}/think-stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( {input:data.input,userID:data.userID,chatID:data.chatID} )
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        onChunk(chunk); // send to frontend or socket
    }
}



module.exports = { askBrain,askBrainStream };