import { validationResult } from "express-validator";
import { CaptainModel } from "../../../Models/captain.model.js";
import { createCaptain } from "./captain.service.js";
import { blackListToken } from "../../../Models/blackListToken.model.js";

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

        captain.status = 'active';
        await captain.save();

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

        captain.status = 'active';
        await captain.save();

        res.cookie('token' , token)

        res.status(201).json({token , captain});

    } catch (error) {
        return res.status(401).json({message : error.message});
    }
}

const GetCaptainProfile = async(req , res) => {
    try {
        const captain = await CaptainModel.findById(req.captain._id).populate('tripHistory');
        return res.status(201).json(captain)
    } catch (error) {
        return res.status(401).json({message : error.message});
    }
}

const updateCaptainProfile = async (req, res) => {
    try {
        const { firstname, lastname, phone } = req.body.fullname;
        const updatedCaptain = await CaptainModel.findByIdAndUpdate(
            req.captain._id,
            {
                'fullname.firstname': firstname,
                'fullname.lastname': lastname,
                phone,
            },
            { new: true }
        );
        res.status(200).json(updatedCaptain);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const uploadProfileImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded.' });
        }
        const captain = await CaptainModel.findByIdAndUpdate(
            req.captain._id,
            { profileImage: req.file.path },
            { new: true }
        );
        res.status(200).json(captain);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const Captainlogout = async(req , res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];

        const captain = await CaptainModel.findById(req.captain._id);
        if (captain) {
            captain.status = 'inactive';
            if (captain.sessionStartTime) {
                const sessionDuration = (new Date() - captain.sessionStartTime) / (1000 * 60 * 60); // in hours
                captain.stats.hoursOnline += sessionDuration;
                captain.sessionStartTime = null;
            }
            await captain.save();
        }

        await blackListToken.create({token});
        res.clearCookie('token');
        res.status(201).json({message : 'Logout successfully'});
    } catch (error) {
        return res.status(400).json({error : error.message});
    }
}

export {CaptainRegister, CaptainLogin , GetCaptainProfile , Captainlogout, uploadProfileImage, updateCaptainProfile};