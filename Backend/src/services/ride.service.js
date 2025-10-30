import { randomInt } from "crypto";
import { RideModel } from "../Models/Ride.model.js";
import { GetDistanceTime} from "../services/maps.service.js"


export const GetFare = async(pickup , destination) => {
    if(!pickup || !destination){
        throw new Error('Pickup and destination are required');
    }

    const DistanceTime = await GetDistanceTime(pickup , destination);

    const baseFare = {
        auto : 30,
        car : 50,
        bike : 20
    };

    const perKMRate = {
        auto : 10,
        car : 50,
        bike : 8
    };

    const perMinuterate = {
        auto : 2,
        car : 3,
        bike : 1.5
    };

    const fare = {
        auto : Math.round(baseFare.auto + (DistanceTime.distance * perKMRate.auto) + (DistanceTime.time * perMinuterate.auto)),
        car: Math.round(baseFare.car + (DistanceTime.distance * perKMRate.car) + (DistanceTime.time * perMinuterate.car)),
        bike : Math.round(baseFare.bike + (DistanceTime.distance * perKMRate.bike) + (DistanceTime.time * perMinuterate.bike)),
    }

    return fare;
}

export const GetrideOTP = (num) => {
    function generateOTP(num) {
        const otp = randomInt(Math.pow(10 , num -1) , Math.pow(10 , num)).toString();
        return otp;
    }

    return generateOTP(num);
}

export const CreateRide = async({user , pickup , destination , vehicleType}) => {
    
    if(!user || !pickup || !destination || !vehicleType){
        throw new Error('All field are required');
    }

    const fare = await GetFare(pickup , destination);

    const ride = RideModel.create({
        user, 
        pickup, 
        destination,
        otp : GetrideOTP(4),
        fare : fare[vehicleType]
    })

    return ride;
}

export const confirmRideService = async({rideId , captainId}) => {
    if(!rideId){
        throw new Error('Ride id is required');
    }

    if(!captainId){
        throw new Error('Captain id is required');
    }

    await RideModel.findByIdAndUpdate(rideId , {status : 'accepted' , captain : captainId});

    const ride = await RideModel.findById(rideId).populate('user').populate('captain');

    if(!ride){
        throw new Error('Ride not found');
    }

    return ride;
}