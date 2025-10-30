import { Server } from 'socket.io';
import { userModel } from './src/Models/user.model.js';
import { CaptainModel } from './src/Models/captain.model.js';

let io;

const onlineCaptainSockets = new Map();

export const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });

    io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`);

        socket.on('join', async (data) => {
            const { userId, userType } = data;

            console.log(`User ${userId} joined as ${userType}`)
            try {
                if (userType === 'user') {
                    await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
                } else if (userType === 'Captain') {
                    await CaptainModel.findByIdAndUpdate(userId, { socketId: socket.id });


                    onlineCaptainSockets.set(String(userId), socket.id);
                    console.log(`Captain ${userId} is now online with socket ${socket.id}`);
                }
                console.log(`${userType} ${userId} joined with socket ${socket.id}`);

                socket.emit('join-success', { 
                    message: 'Successfully joined',
                    socketId: socket.id 
                });
            } catch (error) {
                console.error('Error in join event:', error);
                socket.emit('error', { message: 'Failed to join' });
            }
        });

        socket.on('update-location-captain', async (data) => {
            const { userId, location } = data;

            if (!location || typeof location.lat !== 'number' || typeof location.lng !== 'number') {
                return socket.emit('error', { message: 'Invalid location data' });
            }

            try {
                await CaptainModel.findByIdAndUpdate(userId, {
                    location: {
                        type: 'Point',
                        coordinates: [location.lng, location.lat],
                    }
                });
                console.log(`Captain ${userId} location updated to [${location.lat}, ${location.lng}]`);
            } catch (error) {
                console.error('Error updating location:', error);
                socket.emit('error', { message: 'Failed to update location' });
            }
        });

        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);

            for (const [captainId, sId] of onlineCaptainSockets.entries()) {
                if (sId === socket.id) {
                    onlineCaptainSockets.delete(captainId);
                    console.log(`Captain ${captainId} is now offline`);
                }
            }
        });
    });

    return io;
};

export const sendMessageToSocketId = (socketId, messageObject) => {
    console.log(messageObject);

    if (io) {
        io.to(socketId).emit(messageObject.event, messageObject.data);

        console.log(`✅ Message sent to socket ${socketId}`);
    } else {
        console.log('Socket.io not initialized.');
    }
};

export const isSocketConnected = (socketId) => {
    return Boolean(io && io.sockets && io.sockets.sockets.has(socketId));
};

export const getOnlineCaptainIds = () => Array.from(onlineCaptainSockets.keys());