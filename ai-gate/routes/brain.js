const express = require('express');
const router = express.Router();
const { askBrain } = require('../services/pythonBridge');
const axios = require('axios');

router.post('/ask', async (req, res) => {
    try {
        print(f`Recieved request: ${req.body}`);
        const response = await askBrain(req.body);
        res.json({ result: response });
    } catch (err) {
        res.status(500).json({ error: 'AI error' });
    }
});

router.get('/evolve', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:8000/evolve');
        res.json({ status: response.data.status, data: response.data });
    } catch (err) {
        res.status(500).json({ error: 'Evolution failed' });
    }
});

router.get('/fine-tune', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:8000/fine-tune');
        res.json({ status: response.data.status, data: response.data });
    } catch (err) {
        res.status(500).json({ error: 'Evolution failed' });
    }
});

module.exports = router;
