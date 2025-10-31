import { ChevronDown  ,LocateFixed,Pin,Wallet} from "lucide-react"

export const WaitingForDriver = ({setwaitingDriverPanel , rideInfo}) => {

    const splitAddress = (address) => {
        const parts = (address ?? '').split(',').map((part) => part.trim()).filter(Boolean);
        const heading = parts.shift() ?? '';
        const details = parts.length ? parts.join(', ') : '';
        return { heading, details };
    }

    const pickupLocation = splitAddress(rideInfo?.pickup);
    const destinationLocation = splitAddress(rideInfo?.destination);

    const captain = rideInfo?.captain;
    const captainName = captain?.fullname
        ? `${captain.fullname.firstname ?? ''} ${captain.fullname.lastname ?? ''}`.trim()
        : 'Driver';
    const vehicle = captain?.vehicle;
    const otp = rideInfo?.otp ?? '--';
    const fare = rideInfo?.fare ?? '--';

    return(
        <div className="">
            <h5 className="flex justify-center p-1 text-center w-[93%] absolute top-2" onClick={() => {
                setwaitingDriverPanel(false)
            }}>
                <ChevronDown className="bg-gray-200 rounded-full active:bg-green-400"/>
            </h5>

            <div className="flex items-center justify-between">
                <img  className="h-16" alt="car" src="https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=956/height=538/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy83NjRlZGFmYS00NzJiLTRmZTYtYmY4YS03NGE4OTRhZDNkZWEucG5n"/>
                <div className="text-right">
                    <h2 className="text-lg font-medium ">{captainName}</h2>
                    <h4 className="text-2xl font-semibold pb-1">{vehicle?.plate ?? '--'}</h4>
                    <p className="text-sm text-gray-600">Colour : {vehicle?.color ?? '--'}</p>
                    <p className="font-meduim font-semibold text-lg">OTP : {otp}</p>
                </div>
            </div>

            <div className="flex gap-2 justify-between flex-col items-center mt-5">
                <div className="w-full">
                    <div className="flex items-center gap-3">
                        <Pin className="h-6 w-6"/>
                        <div className="flex flex-col m-2">
                            <h3 className="text-lg font-semibold">{pickupLocation.heading || 'Pickup'}</h3>
                            {!!pickupLocation.details && (
                                <p className="text-sm text-gray-600">{pickupLocation.details}</p>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-3 border-t-2">
                        <LocateFixed className="h-6 w-6"/>
                        <div className="flex flex-col m-2">
                        <h3 className="text-lg font-semibold">{destinationLocation.heading || 'Pickup'}</h3>
                            {!!destinationLocation.details && (
                                <p className="text-sm text-gray-600">{destinationLocation.details}</p>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-3 border-t-2 mb-5">
                        <Wallet className="h-6 w-6"/>
                        <div className="flex flex-col m-2">
                            <h3 className="text-lg font-semibold">₹{fare}</h3>
                            <p className="text-sm text-gray-600">Cash</p>
                        </div>
                    </div>
                </div>
            </div>  
        </div>
    )
}