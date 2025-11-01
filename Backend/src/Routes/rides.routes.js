import express from 'express'
import { body, query } from 'express-validator';
import { createRide, GetFareController  , confirmRide , StartRide , EndRide} from '../Controllers/ride.controller.js';
import { authUser  , authCapatain} from '../middlewares/auth.middleware.js';

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

RideRouter.post('/confirm' ,authCapatain , 
   body('rideId').isMongoId().withMessage('Invalid ride id'),
   confirmRide
)

RideRouter.get('/start-ride' , authCapatain , 
   query('rideId').isMongoId().withMessage('Invalid ride id'),
   query('otp').isString().isLength({min : 4 , max : 4}).withMessage('Invalid otp'),
   StartRide
)

RideRouter.post('/end-ride' , authCapatain , 
   query('rideId').isMongoId().withMessage('Invalid ride id'),
   EndRide
)
