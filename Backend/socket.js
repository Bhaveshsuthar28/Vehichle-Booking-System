import { Server } from 'socket.io';
import { userModel } from './src/Models/user.model.js';
import { CaptainModel } from './src/Models/captain.model.js';
import { RideModel } from './src/Models/Ride.model.js';

let io;

const onlineCaptainSockets = new Map();

const isValidLocation = (location) => {
    return (
        location &&
        typeof location.lat === 'number' &&
        typeof location.lng === 'number'
    );
}

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
                    await CaptainModel.findByIdAndUpdate(userId, { socketId: socket.id, status: 'active', sessionStartTime: new Date() });


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

        socket.on('captain-logout', async (data) => {
            const { captainId } = data;
            try {
                const captain = await CaptainModel.findById(captainId);
                if (captain && captain.sessionStartTime) {
                    const sessionDuration = (new Date() - captain.sessionStartTime) / (1000 * 60 * 60); // in hours
                    captain.stats.hoursOnline += sessionDuration;
                    captain.sessionStartTime = null;
                }
                captain.status = 'inactive';
                await captain.save();
                console.log(`Captain ${captainId} status updated to inactive`);
            } catch (error) {
                console.error('Error updating captain status on logout:', error);
            }
        });

        socket.on('update-location-captain', async (data) => {
            const { userId, location } = data;

            if (!userId || !isValidLocation(location)) {
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


                const activeRide = await RideModel.findOne({
                    captain: userId,
                    status: { $in: ['accepted', 'ongoing'] }
                }).populate('user', 'socketId');

                if (activeRide?.user?.socketId) {
                    io.to(activeRide.user.socketId).emit('captain-location', {
                        rideId: activeRide._id.toString(),
                        location,
                    });
                }
            } catch (error) {
                console.error('Error updating location:', error);
                socket.emit('error', { message: 'Failed to update location' });
            }
        });

        socket.on('update-location-user', async (data) => {
            const { userId, location } = data;

            if (!userId || !isValidLocation(location)) {
                return socket.emit('error', { message: 'Invalid location data' });
            }

            try {
                await userModel.findByIdAndUpdate(userId, {
                    location: {
                        type: 'Point',
                        coordinates: [location.lng, location.lat],
                    }
                });

                const activeRide = await RideModel.findOne({
                    user: userId,
                    status: { $in: ['accepted', 'ongoing'] }
                }).populate('captain', 'socketId');

                if (activeRide?.captain?.socketId) {
                    io.to(activeRide.captain.socketId).emit('user-location', {
                        rideId: activeRide._id.toString(),
                        location,
                    });
                }
            } catch (error) {
                console.error('Error updating user location:', error);
                socket.emit('error', { message: 'Failed to update location' });
            }
        });

        socket.on('disconnect', async () => {
            console.log(`Client disconnected: ${socket.id}`);

            for (const [captainId, sId] of onlineCaptainSockets.entries()) {
                if (sId === socket.id) {
                    onlineCaptainSockets.delete(captainId);
                    try {
                        const captain = await CaptainModel.findById(captainId);
                        if (captain && captain.sessionStartTime) {
                            const sessionDuration = (new Date() - captain.sessionStartTime) / (1000 * 60 * 60); // in hours
                            captain.stats.hoursOnline += sessionDuration;
                            captain.sessionStartTime = null;
                        }
                        captain.status = 'inactive';
                        await captain.save();
                        console.log(`Captain ${captainId} is now offline and status updated to inactive`);
                    } catch (error) {
                        console.error('Error updating captain status on disconnect:', error);
                    }
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