import express from "express";
import { authUser } from "../middlewares/auth.middleware.js";
import { MapController } from "../Controllers/Maps.controller.js";
import { query } from "express-validator";

const MapRouter = express.Router();

MapRouter.get('/get-coordinate' ,
    query('address').isString().isLength({min : 3})
    , authUser , MapController)

export {MapRouter}