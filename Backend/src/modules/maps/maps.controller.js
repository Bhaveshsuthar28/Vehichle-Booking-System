import { validationResult } from "express-validator";
import { GetDistanceTime as GetDistanceTimeService , GetLocationCoordinate, GetLocationSuggestions } from "./maps.service.js"

export const MapController = async(req , res , next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
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

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()})
    }

    try {

        const {origin , destination} = req.query;

        const distanceTime = await GetDistanceTimeService(origin , destination);

        res.status(200).json(distanceTime);
    } catch (error) {
        res.status(404).json({message : 'Distance and time not found'});
    }
}

export const getAutoCompleteSuggestions = async(req , res , next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()})
    }

    const {input} = req.query;

    try {
        const suggestions = await GetLocationSuggestions(input);
        res.status(200).json(suggestions);
    } catch (error) {
        res.status(404).json({message : 'Suggestions not found'});
    }
}
