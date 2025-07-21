const express = require('express');
const bodyParser = require('body-parser');
require('https').globalAgent.options.ca = require('ssl-root-cas').create();
const brainRoutes = require('./routes/brain');
const dataRoutes = require('./routes/data');
const cors = require('cors');
var logger = require('morgan');
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const port = 5000;
const http = require('http');

const { setupSocket } = require('./sockets/aiSocket');


const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(express.json());
// app.use('/public', express.static('public'));
app.get('/health', (req, res) => res.json({ status: 'Running Smoothly!' }));
app.get('/', (req, res) => res.sendFile(__dirname + '/public/index.html'));
app.use('/api/brain', brainRoutes);
app.use('/api/data', dataRoutes);


const server = http.createServer(app);

setupSocket(server);

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});