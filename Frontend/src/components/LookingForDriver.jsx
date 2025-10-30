import { ChevronDown  ,LocateFixed,Pin, Wallet} from "lucide-react"

export const LookingRide = ({setlookingPanelOpen , pick , destination , Fare , vehicleType ,}) => {

    const splitAddress = (address) => {
        const parts = (address ?? '').split(',').map((part) => part.trim()).filter(Boolean);
        const heading = parts.shift() ?? '';
        const details = parts.length ? parts.join(', ') : '';
        return { heading, details };
    }

    const pickupParts = splitAddress(pick);
    const destinationParts = splitAddress(destination);

    return(
        <div className="">
            
            <h5 className="flex justify-center p-1 text-center w-[93%] absolute top-2" onClick={() => {
                setlookingPanelOpen(false)
            }}>
                <ChevronDown className="bg-gray-200 rounded-full active:bg-green-400"/>
            </h5>
            <div className="relative w-full h-1 bg-green-200 rounded overflow-hidden mb-5">
                <div className="absolute top-0 left-0 h-full w-1/3 bg-green-600 transform -translate-x-full animate-slide"></div>
            </div>
            <h3 className="text-2xl font-semibold mb-5">Looking for a Driver</h3>

            <div className="flex gap-2 justify-between flex-col items-center">
                <img  className="h-16" alt="car" src="https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=956/height=538/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy83NjRlZGFmYS00NzJiLTRmZTYtYmY4YS03NGE4OTRhZDNkZWEucG5n"/>
                <div className="w-full">
                    <div className="flex items-center gap-3">
                        <Pin className="h-6 w-6"/>
                        <div className="flex flex-col m-2">
                            <h3 className="text-lg font-semibold">{pickupParts.heading || 'Pickup'}</h3>
                            {!!pickupParts.details && (
                                <p className="text-sm text-gray-600">{pickupParts.details}</p>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-3 border-t-2">
                        <LocateFixed className="h-6 w-6"/>
                        <div className="flex flex-col m-2">
                            <h3 className="text-lg font-semibold">{destinationParts.heading || 'Destination'}</h3>
                            {!!destinationParts.details && (
                                <p className="text-sm text-gray-600">{destinationParts.details}</p>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-3 border-t-2 mb-5">
                        <Wallet className="h-6 w-6"/>
                        <div className="flex flex-col m-2">
                            <h3 className="text-lg font-semibold">₹{Fare[vehicleType]}</h3>
                            <p className="text-sm text-gray-600">Cash</p>
                        </div>
                    </div>
                </div>
            </div>  
            <style>
                {`
                @keyframes slide {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(200%); }
                }
                .animate-slide {
                    animation: slide 1s linear infinite;
                }
                `}
            </style>
        </div>
    )
}