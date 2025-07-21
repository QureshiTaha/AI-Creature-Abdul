const express = require('express');
const router = express.Router();
const { askBrain } = require('../services/pythonBridge');
const axios = require('axios');

router.get('/get-chat-list/:userID', async (req, res) => {
    try {
        const { userID } = req.params;
        if(!userID) return res.status(400).json({ error: 'Missing userID' });

        const response = await axios.get(`http://localhost:8000/get-chat-list/${userID}`);
        res.json({ status: response.data.status, data: response.data });
    } catch (err) {
        res.status(500).json({ error: 'Evolution failed' });
    }
});

router.get('/get-chat-data/:chatID', async (req, res) => {
    try {
        const { chatID } = req.params;
        if(!chatID) return res.status(400).json({ error: 'Missing chatID' });

        const response = await axios.get(`http://localhost:8000/get-chat-data/${chatID}`);
        res.json({ status: response.data.status, data: response.data });
    } catch (err) {
        res.status(500).json({ error: 'Evolution failed' });
    }
});


module.exports = router;
