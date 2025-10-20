import express from "express";
import {body} from "express-validator"
import { getUserProfile, logout, UserLogin, UserRegister } from "../Controllers/user.controller.js";
import { authUser } from "../middlewares/auth.middleware.js";

const UserRouter = express.Router();

UserRouter.post('/register' , [
    body('email').isEmail().withMessage('invaild email'),
    body('fullname.firstname').isLength({min : 3}).withMessage('First name must be at least 3 characters long'),
    body('password').isLength({min : 6}).withMessage('Password must be contain 6 characters')
] , UserRegister);

UserRouter.post('/login' , [
    body('email').isEmail().withMessage('invaild email'),
    body('password').isLength({min : 6}).withMessage('Password must be contain 6 characters')
] , UserLogin);

UserRouter.get('/profile' , authUser, getUserProfile);

UserRouter.get('/logout', authUser , logout);


export {UserRouter}