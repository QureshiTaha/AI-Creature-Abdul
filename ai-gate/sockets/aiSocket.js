const socketIo = require('socket.io');
const os = require('os-utils');
const si = require('systeminformation');
const { askBrain, askBrainStream } = require('../services/pythonBridge');

function setupSocket(server) {
    // Setting Socket
    const io = socketIo(server, {
        cors: {
            origin: '*'
        }
    });

    io.on('connection', (socket) => {
        console.log(`⚡: ${socket.id} user just connected!`);
        socket.on('disconnect', () => {
            console.log('🔥: A user disconnected');
        })

        socket.on('ask', async ({ input, userID }) => {
            console.log("Asking AI: " + input);
            const response = await askBrain({input,userID});
            socket.emit('response', { output: response });
            socket.emit('ai-chat', response);
        });

        socket.on('ask-stream', async ({ input, userID,chatID }) => {
            console.log("🧠 Asking Abdul (stream):", input, "with userID:", userID,"chatID : ",chatID);
            await askBrainStream({ input, userID,chatID }, (chunk) => {
                socket.emit('ai-stream', chunk); // emits each chunk live
            });
        });

        // setInterval(async () => {
        //     os.cpuUsage((cpu) => {
        //         si.mem().then((memData) => {
        //             si.graphics().then((gpuData) => {
        //                 const memoryUsed = ((memData.used / memData.total) * 100).toFixed(2);
        //                 const gpu = gpuData.controllers[0]?.utilizationGpu || gpuData.controllers[1]?.utilizationGpu || 0;

        //                 socket.emit('resource-usage', {
        //                     cpu: +(cpu * 100).toFixed(2),
        //                     memory: +memoryUsed,
        //                     gpu: +gpu,
        //                 });
        //             });
        //         });
        //     });
        // }, 5000);

        // setInterval(async () => {
        //     try {
        //         // Fetch CPU usage
        //         const cpuUsage = await new Promise((resolve) => {
        //             os.cpuUsage((cpu) => resolve(cpu));
        //         });

        //         // Only fetch memory usage
        //         const memData = await si.mem();
        //         const memoryUsed = ((memData.used / memData.total) * 100).toFixed(2);

        //         // If you don't need GPU data right now, just omit this
        //         socket.emit('resource-usage', {
        //             cpu: +(cpuUsage * 100).toFixed(2),
        //             memory: +memoryUsed,
        //             // gpu: +gpuUtilization, // Remove if you don't need GPU data
        //         });

        //     } catch (err) {
        //         console.error('Error fetching resource data:', err);
        //     }
        // }, 5000);

    });
}



module.exports = { setupSocket };