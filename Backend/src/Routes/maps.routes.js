import express from "express";
import { authUser } from "../middlewares/auth.middleware.js";
import { getAutoCompleteSuggestions, GetDistanceTime, MapController } from "../Controllers/Maps.controller.js";
import { query } from "express-validator";

const MapRouter = express.Router();

MapRouter.get('/get-coordinate' ,
    query('address').isString().isLength({min : 3})
    , authUser , MapController)

MapRouter.get('/get-distance-time',
    query('origin').isString().isLength({min : 3}),
    query('destination').isString().isLength({min : 3}),
    authUser, GetDistanceTime
)

MapRouter.get('/get-suggestions', 
    query('input').isString().isLength({min : 3}),
    authUser, getAutoCompleteSuggestions
)

export {MapRouter}