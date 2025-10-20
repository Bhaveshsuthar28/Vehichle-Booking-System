import { blackListToken } from "../Models/blackListToken.model.js";
import { CaptainModel } from "../Models/captain.model.js";
import { userModel } from "../Models/user.model.js";
import jwt from "jsonwebtoken";

const authUser = async(req , res , next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if(!token) return res.status(401).json({message : 'Unauthorized'});

    const isBlackListed = await blackListToken.findOne({token : token});

    if(isBlackListed){
        return res.status(401).json({message : 'Unauthorized'})
    }

    try {
        const decoded = jwt.verify(token , process.env.JWT_SECRET);
        const user = await userModel.findById(decoded._id);

        req.user = user;

        return next();
    } catch (error) {
        return res.status(404).json({message : error.message})
    }
}

const authCapatain = async(req , res , next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if(!token) return res.status(401).json({message : 'Unauthorized'});

    const isBlackListed = await blackListToken.findOne({token : token});

    if(isBlackListed){
        return res.status(401).json({message : 'Unauthorized'})
    }

    try {
        const decoded = jwt.verify(token , process.env.JWT_SECRET);
        const captain = await CaptainModel.findById(decoded._id);

        req.captain = captain;

        return next();
    } catch (error) {
        return res.status(404).json({message : error.message})
    }
}

export {authUser , authCapatain}