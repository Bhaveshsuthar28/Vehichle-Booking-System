import { userModel } from "../../../Models/user.model.js";
import {CreateUser} from "./user.service.js";
import { validationResult } from "express-validator";
import {blackListToken} from "../../../Models/blackListToken.model.js"

const UserRegister = async(req , res) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors : errors.array()});
        }

        const {fullname, email , password} = req.body;

        const hashedPassword = await userModel.hashpassword(password);

        const user = await CreateUser({
            firstname : fullname.firstname,
            lastname : fullname.lastname,
            email,
            password : hashedPassword
        });

        const token = user.generateAuthToken();

        res.status(201).json({token , user})
    } catch (error) {
        return res.status(400).json({error : error.message});
    }
}

const UserLogin = async(req,res) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors : errors.array()});
        }

        const {email , password} = req.body;

        const user = await userModel.findOne({email}).select('+password');

        if(!user){
            return res.status(401).json({message : 'User not found'});
        }

        const isMatch = await user.camparePassword(password);

        if(!isMatch){
            return res.status(401).json({message : 'Invaild email or password'});
        }

        const token = user.generateAuthToken();

        res.status(200).json({token , user});
    } catch (error) {
        return res.status(400).json({error : error.message});
    }
}

const getUserProfile = async(req , res , next) => {
    try {
        return res.status(200).json(req.user)
    } catch (error) {
        return res.status(400).json({error : error.message});
    }
}

const uploadProfileImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded.' });
        }
        const user = await userModel.findByIdAndUpdate(
            req.user._id,
            { profileImage: req.file.path },
            { new: true }
        );
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const logout = async(req , res) => {
    try {
        const token = req.cookies.token || req.headers.authorization.split(' ')[1];

        await blackListToken.create({token});
        res.clearCookie('token');
        res.status(201).json({message : 'Logout successfully'});
    } catch (error) {
        return res.status(400).json({error : error.message});
    }
}

const updateUserProfile = async (req, res) => {
    try {
        const { firstname, lastname, phone } = req.body;
        const updatedUser = await userModel.findByIdAndUpdate(
            req.user._id,
            {
                'fullname.firstname': firstname,
                'fullname.lastname': lastname,
                phone,
            },
            { new: true }
        );
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export {UserRegister , UserLogin , getUserProfile , logout, uploadProfileImage, updateUserProfile};
