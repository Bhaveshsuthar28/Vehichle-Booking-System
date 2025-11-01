import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";

const CaptainSchema = new mongoose.Schema({
    fullname: {
        firstname: {
            type: String,
            required: true,
            minlength: [ 3, 'First name must be at least 3 characters long' ],
        },
        lastname: {
            type: String,
            minlength: [ 3, 'Last name must be at least 3 characters long' ],
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: [ 5, 'Email must be at least 5 characters long' ],
        match : [/^\S+@\S+\.\S+$/,'Please enter a valid email']
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    socketId: {
        type: String,
    }, 
    profileImage: {
        type: String,
        default: ''
    },
    tripHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ride'
    }],
    stats: {
        hoursOnline: {
            type: Number,
            default: 0
        },
        totalTrips: {
            type: Number,
            default: 0
        },
        totalDistance: {
            type: Number,
            default: 0
        },
        totalDuration: {
            type: Number,
            default: 0
        },
        avgSpeed: {
            type: Number,
            default: 0
        }
    },
    sessionStartTime: {
        type: Date,
    },
    status : {
        type : String,
        enum : ['active', 'inactive'],
        default : 'inactive'
    },

    vehicle:{
        color : {
            type : String,
            required : true,
            minlength : [3 , 'Color must be at least 3 characters long']
        },
        plate : {
            type : String,
            required : true,
            minlength : [3 , 'Plate must be at least 3 characters long']
        },
        capacity : {
            type : Number,
            required : true,
            min : [1 , 'Capacity must be at least 1']
        },
        vehicleType : {
            type : String,
            required : true,
            enum : ['car' , 'bike', 'auto']
        }
    },

    location : {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            default: [0, 0]
        }
    }  
} , {
    timestamps : true
})

CaptainSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id:this._id} , process.env.JWT_SECRET , {expiresIn : '24h'});
    return token;
} 

CaptainSchema.methods.camparePassword = async function (password) {
    return await bcrypt.compare(password , this.password);
}

CaptainSchema.statics.hashpassword = async function (password){
    return await bcrypt.hash(password , 10);
}

CaptainSchema.index({ location: '2dsphere' });

export const CaptainModel = mongoose.model('Captain',CaptainSchema)