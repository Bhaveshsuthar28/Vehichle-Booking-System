import { validationResult } from "express-validator"
import { CreateRide, GetFare  , confirmRideService , StartRideService , endRideService} from "../services/ride.service.js";
import { GetCaptainInRadiuis  , GetLocationCoordinate} from "../services/maps.service.js";
import { sendMessageToSocketId , isSocketConnected, getOnlineCaptainIds} from "../../socket.js"; 
import { RideModel } from "../Models/Ride.model.js";
import {CaptainModel} from "../Models/captain.model.js"

export const createRide = async(req , res , next) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        res.status(401).json({errors : errors.array()})
    }

    try {
        const {pickup , destination , vehicleType} = req.body;
        
        const ride = await CreateRide({ user : req.user._id , pickup , destination , vehicleType});
        res.status(201).json(ride);

        const PickupCoordinate = await GetLocationCoordinate(pickup);
        const DestinationCoordinate = await GetLocationCoordinate(destination);

        const captaininRaduis = await GetCaptainInRadiuis(PickupCoordinate.lat , PickupCoordinate.lng , 120);

        let targets = captaininRaduis.filter(c => c.socketId && isSocketConnected(c.socketId));

        if (targets.length === 0) {
            const onlineCaptainIds = getOnlineCaptainIds();
            console.log(`Fallback: ${onlineCaptainIds.length} online captains`);

            if (onlineCaptainIds.length) {
                targets = await CaptainModel.find({ _id: { $in: onlineCaptainIds } });
                console.log(`Using ${targets.length} online captains as fallback`);
            }
        }

        console.log(`Found ${captaininRaduis.length} captains in radius`);

        ride.otp = ""
        
        const RideWithUser = await RideModel.findById(ride._id).populate('user')

        if (targets.length === 0) {
            console.log('⚠️ No captains available to send ride request');
            return;
        }
        
        targets.forEach((captain) => {
            if (captain.socketId && isSocketConnected(captain.socketId)) {
                console.log(`📤 Sending ride to captain ${captain._id} (${captain.fullname.firstname}) at socket ${captain.socketId}`);
                sendMessageToSocketId(captain.socketId, {
                    event: 'new-ride',
                    data: RideWithUser
                });
            } else {
                console.log(`Captain ${captain._id} socket ${captain.socketId} not connected`);
            }
        });
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({message : error.message})
    }
}
  
export const GetFareController = async(req , res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(401).json({errors : errors.array()})
    }

    try {
        const {pickup , destination} = req.query;
        const fare = await GetFare(pickup , destination);
        return res.status(200).json(fare);
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({message : error.message})
    }
}


export const confirmRide = async(req , res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(401).json({errors : errors.array()})
    }

    const {rideId} = req.body;

    try{
        const ride = await confirmRideService({rideId , captainId : req.captain._id});

        sendMessageToSocketId(ride.user.socketId , {
            event : 'ride-confirmed',
            data : ride
        })
        return res.status(200).json(ride)
    }
    catch(error){
        return res.status(500).json({message : error.message})
    }
}

export const StartRide = async(req , res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(401).json({errors : errors.array()})
    }

    const {rideId , otp} = req.query;

    try{
        const ride = await StartRideService({
            rideId , 
            otp , 
            captain : req.captain
        })

        sendMessageToSocketId(ride.user.socketId , {
            event : 'ride-started',
            data : ride
        })

        return res.status(200).json(ride)

    } catch(error){
        return res.status(500).json({message : error.message})
    }
} 

export const EndRide = async(req , res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(401).json({errors : errors.array()})
    }

    const {rideId} = req.query;

    try{
        const ride = await endRideService({rideId , captain : req.captain});

        sendMessageToSocketId(ride.user.socketId , {
            event : 'ride-ended',
            data : ride
        });

        return res.status(200).json(ride)
    } catch(error){
        return res.status(404).json({message : error.message})
    }
}