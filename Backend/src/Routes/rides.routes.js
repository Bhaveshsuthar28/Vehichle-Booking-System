import express from 'express'
import { body } from 'express-validator';
import { createRide } from '../Controllers/ride.controller.js';
import { authUser } from '../middlewares/auth.middleware.js';

export const RideRouter = express.Router();

RideRouter.post('/create' , 
    authUser,
    body('pickup').isString().isLength({min : 3}).withMessage('Invalid pickup address'),
    body('destination').isString().isLength({min : 3}).withMessage('Invaild desitination address'),
    body('vehicleType').isString().isIn(['car' , 'bike', 'auto']).withMessage('Invalid vehicleType')
 ,  createRide)