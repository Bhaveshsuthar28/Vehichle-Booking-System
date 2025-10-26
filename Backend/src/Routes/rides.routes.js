import express from 'express'
import { body, query } from 'express-validator';
import { createRide, GetFareController } from '../Controllers/ride.controller.js';
import { authUser } from '../middlewares/auth.middleware.js';

export const RideRouter = express.Router();

RideRouter.post('/create' , 
    authUser,
    body('pickup').isString().isLength({min : 3}).withMessage('Invalid pickup address'),
    body('destination').isString().isLength({min : 3}).withMessage('Invaild desitination address'),
    body('vehicleType').isString().isIn(['car' , 'bike', 'auto']).withMessage('Invalid vehicleType')
 ,  createRide)

 RideRouter.get('/get-fare' , authUser , 
    query('pickup').isString().isLength({min : 3}).withMessage('Invalid pickup address'),
    query('destination').isString().isLength({min : 3}).withMessage('Invaild desitination address'),
    GetFareController
 )