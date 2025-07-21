import React, { useRef, useEffect } from 'react';
import { Box, Typography, TextField, Button, Paper } from '@mui/material';
import formatMessage from '../utils/formatMessage';

const ChatWindow = ({ chatMessages, chatInput, setChatInput, handleSend, isMobile,thinkingDots }) => {
    const chatEndRef = useRef(null);

    useEffect(() => {
        if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    return (
        <Paper sx={{ height: isMobile ? '80vh' : '60vh', p: 2, display: 'flex', flexDirection: 'column', borderRadius: 2, boxShadow: 3, transition: 'box-shadow 0.3s', '&:hover': { boxShadow: 6 } }}>
            <Typography variant="h6" gutterBottom>
                Chat with AI
            </Typography>
            <Box sx={{ flex: 1, overflowY: 'auto', mb: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 1 }}>
                {chatMessages.length === 0 && <Typography align="center" color="text.secondary" sx={{ my: 2 }}>No messages yet. Say hi!</Typography>}
                {chatMessages.map((msg, index) => (
                    <Box key={index} sx={{ display: 'flex', justifyContent: msg.sender === 'You' ? 'flex-end' : 'flex-start', mb: 1 }}>
                        <Box sx={{ maxWidth: '80%', bgcolor: msg.sender === 'You' ? 'primary.main' : 'grey.300', color: msg.sender === 'You' ? 'white' : 'black', p: 1, borderRadius: 2 }}>
                            <Typography variant="body2" fontWeight="bold" gutterBottom>{msg.sender}</Typography>
                            <Typography variant="body2">{formatMessage(msg.message)}</Typography>
                        </Box>
                    </Box>
                ))}
                {thinkingDots && (
                    <div className="ai">{thinkingDots}</div>
                )}
                <div ref={chatEndRef} />
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField fullWidth variant="outlined" placeholder="Type your message..." value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} sx={{ flexGrow: 1 }} />
                <Button variant="contained" onClick={handleSend} disabled={!chatInput.trim()}>Send</Button>
            </Box>
        </Paper>
    );
};

export default ChatWindow;


