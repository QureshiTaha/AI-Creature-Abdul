// src/App.js
import { useEffect, useState, useRef } from 'react';
import {
  Box,
  Skeleton,
  CssBaseline,
  useMediaQuery,
  Fade,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import socketIO from 'socket.io-client';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, PointElement } from 'chart.js';
import DashboardCharts from './components/DashboardCharts';
import AppHeader from './components/AppHeader';
import SidebarDrawer from './components/SidebarDrawer';
import ChatWindow from './components/ChatWindow';
import { useCallback } from 'react';
ChartJS.register(CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, PointElement);

const socket = socketIO.connect('http://localhost:5000');

function App() {
  const [status, setStatus] = useState(null);
  const [cpuUsage, setCpuUsage] = useState([]);
  const [gpuUsage, setGpuUsage] = useState([]);
  const [memoryUsage, setMemoryUsage] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [loading, setLoading] = useState(false);
  // const [aiLoading, setAILoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [thinkingDots, setThinkingDots] = useState('');
  const thinkingIntervalRef = useRef(null);
  const [userID, setUserID] = useState("1");
  const [chatList, setChatList] = useState([]);
  const [chatID, setChatID] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);

  const chatEndRef = useRef(null);
  const isMobile = useMediaQuery('(max-width:600px)');
  const { id } = useParams();
  const history = useNavigate();


  const fetchChatList = useCallback(async (userID) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/data/get-chat-list/${userID}`);
      const data = await response.json();
      setChatList(data.data); // Set chat list
    } catch (error) {
      console.error('Error fetching chat list:', error);
    }
  }, []);

  const fetchChatData = useCallback(async (chatID) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/data/get-chat-data/${chatID}`);
      /* messages = ["User: Hello",
      "Abdul: Hi there! How can I brighten up your day today?",
      "User: Say me some jokes"] */
      // Format the msgs { sender: 'AI', message: msg }
      const data = await response.json();
      if (data.data.length > 0) {
        const messages = data.data[0];
        const formattedMessages = messages.map((message) => ({
          sender: message.split(':')[0] === 'User' ? 'You' : 'AI',
          message: message.split(':')[1],
        }));
        setChatMessages(formattedMessages);
      } else {
        setChatMessages([]);
      }
    } catch (error) {
      console.error('Error fetching chat list:', error);
    }
  }, []);



  useEffect(() => {
    const userID_ = "1";
    if (id) {
      fetchChatData(id);
      fetchChatList(userID_);
    }

  }, [fetchChatList, fetchChatData, id]);


  useEffect(() => {
    if (!id) {
      const newId = new Date().getTime().toString();
      window.location.href = `/chat/${newId}`;
    } else {
      const userID_ = "1";
      setUserID(userID_);
      setChatID(id)
      setSelectedChat(id);
    }
  }, [id, userID]);



  useEffect(() => {
    socket.on('system-health', (data) => {
      setStatus(data.status);
    });
    socket.on('resource-usage', (data) => {
      setCpuUsage((prev) => [...prev.slice(-19), data.cpu]);
      setGpuUsage((prev) => [...prev.slice(-19), data.gpu]);
      setMemoryUsage((prev) => [...prev.slice(-19), data.memory]);
    });
    socket.on('ai-chat', (msg) => {
      setChatMessages((prev) => [...prev, { sender: 'AI', message: msg }]);
    });
    socket.on('ai-stream', (chunk) => {
      console.log("🧠 Abdul says:", chunk);

      // ✅ Stop the loader interval
      if (thinkingIntervalRef.current) {
        clearInterval(thinkingIntervalRef.current);
        thinkingIntervalRef.current = null;
        setThinkingDots('');
      }

      const sanitized = chunk.trim();
      if (!sanitized) return;

      setChatMessages(prev => {
        const last = prev[prev.length - 1];
        const needsSpace = last?.message && !last.message.endsWith(" ") && !chunk.startsWith(" ");
        const chunkToAdd = (needsSpace ? " " : "") + chunk;

        if (last && last.sender === 'AI') {
          return [...prev.slice(0, -1), { ...last, message: last.message + chunkToAdd }];
        }
        return [...prev, { sender: 'AI', message: chunk }];
      });
    });


    // var msg = {
    //   sender: 'AI',
    //   message: '*Below is the code for while loop in php*\n    ```php\n<?php\n$i = 1;\n\n// While loop\nwhile ($i <= 5) {\n    // Code to be executed within the loop\n    echo "The value of i is: " . $i . "<br>";\n    $i++; // Increment i\n}\n?>\n```\n\nIn this example, the while loop will execute as long as the value of `$i` is less than or equal to 5. The loop will increment the value of `$i` on each iteration, so the loop will run 5 times in total.'
    // };
    // setChatMessages([msg]);
    return () => {
      socket.off('system-health');
      socket.off('resource-usage');
      socket.off('ai-chat');
      socket.off('ai-stream',);
      socket.off('ai-status');
      if (thinkingIntervalRef.current) {
        clearInterval(thinkingIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  useEffect(() => {
    setTimeout(() => {
      setFetchingData(false);
    }, 2000);
  }, []);

  const handleSend = () => {
    if (chatInput.trim() === '') return;
    setChatMessages((prev) => [...prev, { sender: 'You', message: chatInput }]);
    if (!chatID) {
      const newId = new Date().getTime().toString();
      window.location.href = `/chat/${newId}`;
    } else {
      // Check if chatID in chatList if not then append in chatList
      if (!chatList.includes(chatID)) {
        fetchChatList(userID);
        setChatList((prev) => [chatID, ...prev]);
      }
    }

    socket.emit('ask-stream', { input: chatInput, chatID: chatID, userID: userID });

    let dots = '';
    const interval = setInterval(() => {
      dots = dots.length >= 3 ? '' : dots + '.';
      setThinkingDots(`Abdul is thinking${dots}`);
    }, 500);

    thinkingIntervalRef.current = interval; // ✅ Store in ref
    setChatInput('');

  };

  const handleEvolve = () => {
    setLoading(true);
    fetch('http://localhost:5000/api/brain/evolve')
      .then((res) => res.json())
      .then((data) => {
        alert('Evolution: ' + data.status);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        alert('Error triggering evolution');
        setLoading(false);
      });
  };

  const handleFineTune = () => {
    setLoading(true);
    fetch('http://localhost:5000/api/brain/fine-tune')
      .then((res) => res.json())
      .then((data) => {
        alert('Fine-tune: ' + data.status);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        alert('Error triggering fine-tune');
        setLoading(false);
      });
  };

  const handleDrawerToggle = () => {
    setDrawerOpen((prev) => !prev);
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 500 },
    scales: { y: { beginAtZero: true, max: 100 } },
  };

  const chartData = (label, data) => ({
    labels: Array(data.length).fill(''),
    datasets: [
      {
        label,
        data,
        fill: false,
        borderColor: '#1976d2',
        backgroundColor: '#64b5f6',
        tension: 0.3,
        pointRadius: 0,
      },
    ],
  });


  return (

    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <CssBaseline />
      <AppHeader
        isMobile={isMobile}
        DrawerOpen={drawerOpen}
        onDrawerToggle={handleDrawerToggle}
      />
      <SidebarDrawer
        isMobile={isMobile}
        DrawerOpen={drawerOpen}
        onClose={handleDrawerToggle}
        status={status}
        handleEvolve={handleEvolve}
        handleFineTune={handleFineTune}
        loading={loading}
        setSelectedChat={setSelectedChat}
        selectedChat={selectedChat}
        history={history}
        chatList={chatList}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          paddingTop: isMobile ? 8 : 3,
          overflow: isMobile ? 'auto' : 'hidden',
          width: '100%',
        }}
      >
        {fetchingData ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4, height: '100%' }}>
            <Skeleton variant="circular" width={80} height={80} />
            <Skeleton variant="rectangular" width="80%" height={200} sx={{ my: 2 }} />
            <Skeleton variant="rectangular" width="80%" height={150} />
          </Box>
        ) : (
          <Fade in={!fetchingData} timeout={500}>
            <Box sx={{ display: 'flex', flexDirection: 'column', height: isMobile ? '120vh' : '100vh' }}>
              <DashboardCharts
                cpuUsage={cpuUsage}
                gpuUsage={gpuUsage}
                memoryUsage={memoryUsage}
                chartData={chartData}
                chartOptions={chartOptions}
              />
              <Box sx={{ flex: 1, p: 2 }}>
                <ChatWindow
                  thinkingDots={thinkingDots}
                  isMobile={isMobile}
                  chatMessages={chatMessages}
                  chatInput={chatInput}
                  setChatInput={setChatInput}
                  handleSend={handleSend}
                />
              </Box>
            </Box>
          </Fade>
        )}
      </Box>
    </Box>
  );
}

export default App;
