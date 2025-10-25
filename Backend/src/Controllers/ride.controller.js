import { validationResult } from "express-validator"
import { CreateRide } from "../services/ride.service.js";

export const createRide = async(req , res , next) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(401).json({errors : errors.array()})
    }

    try {
        const {pickup , destination , vehicleType} = req.body;
        
        const ride = await CreateRide({ user : req.user._id , pickup , destination , vehicleType});
        return res.status(201).json(ride);
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({message : error.message})
    }
}