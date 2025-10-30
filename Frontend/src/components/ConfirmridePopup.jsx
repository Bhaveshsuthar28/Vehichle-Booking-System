import { Link } from "react-router-dom";
import { UserInfoForDriver } from "./UserInfoForDriver";
import { useState } from "react";

export const ConfirmRidePopup = ({setridePopupPanel , setConfirmridePopupPanel , ride}) => {

    const [otp , setotp] = useState("");

    const SubmitHandler = (e) => {
        e.preventDefault();

    }
    return(
        <div className="relative w-full">
            <h3 onClick={() => {setridePopupPanel(true)}} className="text-center text-2xl font-bold text-black mb-4 relative">
                Confirm this ride to Start!
            </h3>
        
            <div className="flex flex-col gap-6 items-center w-full p-4">
                <UserInfoForDriver ride={ride}/>

                <div className="w-full">
                    <form className="w-full flex flex-col items-center gap-5">
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

                        <Link
                            to="/captain-riding"
                            onClick={() => {
                                setConfirmridePopupPanel(true);
                                setridePopupPanel(false);
                            }}
                            className="w-full bg-green-600 text-white text-lg font-semibold rounded-2xl py-3 
                                        text-center shadow-md hover:shadow-lg active:scale-95 
                                        active:bg-green-700 transition-all duration-150"
                            >
                                Accept
                        </Link>

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