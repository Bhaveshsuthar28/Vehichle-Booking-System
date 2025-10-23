import { validationResult } from "express-validator";
import { GetLocationCoordinate } from "../services/maps.service.js"

export const MapController = async(req , res , next) => {
    const errors = validationResult(req);
    if(errors.isEmpty()){
        return res.status(400).json({errors : errors.array()})
    }

    const {address} = req.query;

    try {
        const coordinate = await GetLocationCoordinate(address)

        res.status(200).json(coordinate);
    } catch (error) {
        res.status(404).json({message : 'Coordinates not found'})
    }
}

export const GetDistanceTime = async(req , res , next) => {
    
}