import express from "express"
import {body} from "express-validator"
import { CaptainRegister , CaptainLogin, GetCaptainProfile, Captainlogout} from "../Controllers/captain.controller.js";
import { authCapatain } from "../middlewares/auth.middleware.js";

const CaptainRouter = express.Router();

CaptainRouter.post('/register' , [
    body('email').isEmail().withMessage('invaild email'),
    body('fullname.firstname').isLength({min : 3}).withMessage('First name must be at least 3 characters long'),
    body('password').isLength({min : 6}).withMessage('Password must be contain 6 characters'),
    body('vehicle.color').isLength({min : 3}).withMessage('Color must be contain 3 characters'),
    body('vehicle.plate').isLength({min : 3}).withMessage('Number plate must be contain 3 characters'),
    body('vehicle.capacity').isInt({min : 1}).withMessage('Capacity must be at least 1'),
    body('vehicle.vehicleType').isIn(['car','bike','auto']).withMessage('Invalid vehicle type'),
] , CaptainRegister);

CaptainRouter.post('/login' , [
    body('email').isEmail().withMessage('invaild email'),
    body('password').isLength({min : 6}).withMessage('Password must be contain 6 characters')
] , CaptainLogin);

CaptainRouter.get('/profile' , authCapatain , GetCaptainProfile);

CaptainRouter.get('/logout' , authCapatain , Captainlogout);

export {CaptainRouter}

