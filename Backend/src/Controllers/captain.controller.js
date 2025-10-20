import { validationResult } from "express-validator";
import { CaptainModel } from "../Models/captain.model.js";
import { createCaptain } from "../services/captain.service.js";

const CaptainRegister = async(req , res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()});
    }

    try {
        const {fullname , email , password , vehicle} = req.body;

        const isMatch = await CaptainModel.findOne({email});

        if(isMatch) return res.status(404).json({message : 'Captain Already registered'})

        const hashpassword = await CaptainModel.hashpassword(password);

        const captain = await createCaptain({
            firstname : fullname.firstname,
            lastname : fullname.lastname,
            email,
            password : hashpassword,
            color : vehicle.color,
            plate : vehicle.plate,
            capacity : vehicle.capacity,
            vehicleType : vehicle.vehicleType
        });

        const token = captain.generateAuthToken();

        res.status(201).json({token , captain});
    } catch (error) {
        return res.status(401).json({message : error.message})
    }
}

const CaptainLogin = async(req , res , next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()});
    }

    try {
        const {email , password} = req.body;

        const captain = await CaptainModel.findOne({email}).select('+password');
 
        if(!captain) return res.status(404).json({message : 'Captain not registered'});

        const isPassword = await captain.camparePassword(password);

        if(!isPassword) return res.status(401).json({message : 'Invalid Email or password'});

        const token = captain.generateAuthToken();

        res.cookie('token' , token)

        res.status(201).json({token , captain});

    } catch (error) {
        return res.status(401).json({message : error.message});
    }
}

const GetCaptainProfile = async(req , res) => {
    try {
        return res.status(201).json(req.captain)
    } catch (error) {
        return res.status(401).json({message : error.message});
    }
}

const Captainlogout = async(req , res) => {
    try {
        const token = req.cookies.token || req.headers.authorization.split(' ')[1];

        await blackListToken.create({token});
        res.clearCookie('token');
        res.status(201).json({message : 'Logout successfully'});
    } catch (error) {
        return res.status(400).json({error : error.message});
    }
}

export {CaptainRegister, CaptainLogin , GetCaptainProfile , Captainlogout};

