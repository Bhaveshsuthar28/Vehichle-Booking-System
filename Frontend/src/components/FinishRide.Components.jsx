import { Link } from "react-router-dom";
import { UserInfoForDriver } from "./UserInfoForDriver";

export const FinishRide = ({setfinishRidingPanel , ride , onFinishRide}) => { 
    if(!ride) return null;

    const handleFinish = async() => {
        await onFinishRide?.();
        setfinishRidingPanel(false);
    };

    return(
        <div className="relative w-full">
            <h3 onClick={() => {setfinishRidingPanel(false)}} className="text-center text-2xl font-bold text-black mb-4 relative">
                Finish this Ride 
            </h3>
        
            <div className="flex flex-col gap-6 items-center w-full p-4">
                <UserInfoForDriver ride={ride} />

                <div className="w-full flex flex-col">
                    <button
                        type="button"
                        onClick={handleFinish}
                        className="w-full bg-green-600 text-white text-lg font-semibold rounded-2xl py-3 
                                    text-center shadow-md hover:shadow-lg active:scale-95 
                                    active:bg-green-700 transition-all duration-150"
                        >
                            Finish Ride
                    </button>

                    <p className="text-xs text-center relative top-2 text-red-600">Click on Finish Ride if you completed the payment</p>
                </div>
            </div>
        </div>
    )
}