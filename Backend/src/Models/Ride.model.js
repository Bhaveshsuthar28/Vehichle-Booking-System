import mongoose from "mongoose";

const RideSchema = new mongoose.Schema(
    {
        user : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'user',
            required : true
        },
        captain : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Captain'
        },
        pickup : {
            type : String,
            required : true
        },
        destination : {
            type : String,
            required : true
        },
        fare : {
            type : String,
            required : true
        },


        status : {
            type : String,
            enum : ['pending' , 'accepted' , 'ongoing' , 'completed' , 'cancelled'],
            default : 'pending'
        },

        durations : {
            type : Number,
        },

        distance : {
            type : Number
        },

        paymentID : {
            type : String
        },
        
        orderID : {
            type : String
        },

        signature : {
            type : String
        },

        otp : {
            type : String,
            select : false,
            required : true
        }
    },
        {
            timestamps : true
        }
)

export const RideModel = mongoose.model('Ride' , RideSchema)