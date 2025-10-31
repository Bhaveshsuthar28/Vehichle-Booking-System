import {useNavigate} from "react-router-dom";
import { UserInfoForDriver } from "./UserInfoForDriver";
import { useState } from "react";
import axios from 'axios'

export const ConfirmRidePopup = ({setridePopupPanel , setConfirmridePopupPanel , ride}) => {

    const [otp , setotp] = useState("");

    const navigate = useNavigate();

    const SubmitHandler = async(e) => {
        e.preventDefault();
        if(!ride?._id || otp.length !== 4) return;

        const captainToken = localStorage.getItem('captainToken'); 

        try{
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/rides/start-ride` ,{
                params: {
                    rideId: ride._id, 
                    otp 
                },

                headers: { 
                    Authorization: `Bearer ${captainToken}` 
                },
            });

            if(response.status === 200){
                const ridePayload = response.data;
                sessionStorage.setItem('captainActiveRide', JSON.stringify(ridePayload));
                sessionStorage.setItem('userActiveRide', JSON.stringify(ridePayload));
                setConfirmridePopupPanel(false);
                setridePopupPanel(false);
                navigate('/captain-riding' , {state : {ride : ridePayload}})
            }
        } catch(error){
            console.error('Failed to start ride:', error?.response?.data || error.message);
        }
    }

    const isOtpValid = otp.length === 4;
    return(
        <div className="relative w-full">
            <h3 onClick={() => {setridePopupPanel(true)}} className="text-center text-2xl font-bold text-black mb-4 relative">
                Confirm this ride to Start!
            </h3>
        
            <div className="flex flex-col gap-6 items-center w-full p-4">
                <UserInfoForDriver ride={ride}/>

                <div className="w-full">
                    <form 
                        onSubmit={SubmitHandler}
                        className="w-full flex flex-col items-center gap-5">
                        <input
                            type="text"
                            maxLength={4}
                            inputMode="numeric"
                            pattern="[0-9]*"
                            onInput={(e) => {
                                e.target.value = e.target.value.replace(/[^0-9]/g, "");
                            }}
                            className="w-full text-center tracking-[0.4em] bg-gray-100 rounded-xl border border-gray-300 
                                        py-3 text-xl font-semibold text-gray-900 placeholder:text-gray-500 
                                        focus:outline-none focus:ring-2 focus:ring-black transition-all duration-200"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange ={(e) => setotp(e.target.value)}
                        />

                        <button
                            type="submit"
                            disabled={!isOtpValid}
                            className={`w-full bg-green-600 text-white text-lg font-semibold rounded-2xl py-3 
                                        text-center shadow-md hover:shadow-lg active:scale-95 
                                        active:bg-green-700 transition-all duration-150 ${!isOtpValid ? 'opacity-60 cursor-not-allowed hover:shadow-none active:scale-100 active:bg-green-600' : ''}`}
                            >
                                Accept
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setridePopupPanel(false);
                                setConfirmridePopupPanel(false);
                            }}
                            className="w-full bg-red-600 text-white text-lg font-semibold rounded-2xl py-3 
                                        hover:shadow-md active:scale-95 active:bg-red-700 
                                        transition-all duration-150"
                            >
                                Cancel
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}