import { LocateFixed, Home , Wallet , Pin} from "lucide-react"
import {Link , useLocation , useNavigate } from "react-router-dom"
import { useEffect, useMemo, useState , useContext} from "react"
import { SocketContext } from "../context/SocketDataContext.js";
import { useDeviceLocation} from "../components/useDeviceLocation.jsx"
import { LiveTracking } from "../components/LiveTracking.jsx";


export const RidingLive = () => {

    const ACTIVE_RIDE_KEY = 'userActiveRide'
    const { socket } = useContext(SocketContext)
    const { coords: userCoords } = useDeviceLocation({ enableHighAccuracy: true });
    const [captainLiveLocation, setCaptainLiveLocation] = useState(null);

    const splitAddress = (address) => {
        const parts = (address ?? '').split(',').map((part) => part.trim()).filter(Boolean)
        const heading = parts.shift() ?? ''
        const details = parts.length ? parts.join(', ') : ''
        return { heading, details }
    }

    const location = useLocation();
    const navigate = useNavigate();
    
    const [ride, setRide] = useState(() => {
        if (location.state?.ride) return location.state.ride
        const persisted = sessionStorage.getItem(ACTIVE_RIDE_KEY)
        return persisted ? JSON.parse(persisted) : null
    })

    console.log(ride);

    useEffect(() => {
        if (!ride) {
            navigate('/home', { replace: true })
            return
        }

        sessionStorage.setItem(ACTIVE_RIDE_KEY, JSON.stringify(ride))
    } ,[ride , navigate])


    useEffect(() => {
        socket.on("ride-ended" , () => {
            navigate('/home', { replace: true})
        })
    } , [socket , navigate])

    useEffect(() => {
        if (!socket) return;

        const handleRideEnded = () => {
            sessionStorage.removeItem(ACTIVE_RIDE_KEY);
            navigate('/home', { replace: true})
        };

        const handleCaptainLocation = ({ location }) => setCaptainLiveLocation(location);

        socket.on("ride-ended" , handleRideEnded);
        socket.on("captain-location", handleCaptainLocation);

        return () => {
            socket.off("ride-ended", handleRideEnded);
            socket.off("captain-location", handleCaptainLocation);
        };
    } , [socket , navigate])

    useEffect(() => {
        if (!socket || !ride?.user?._id || !userCoords) return;
        socket.emit("update-location-user", {
            userId: ride.user._id,
            location: { lat: userCoords.lat, lng: userCoords.lng },
        });
    }, [socket, ride, userCoords]);

    const captain = ride?.captain
    const vehicle = captain?.vehicle
    const pickup = useMemo(() => splitAddress(ride?.pickup), [ride?.pickup]);
    const destinationParts = useMemo(() => splitAddress(ride?.destination), [ride?.destination])
    const fare = ride?.fare ?? '--'

    const handlePayment = () => {
        sessionStorage.removeItem(ACTIVE_RIDE_KEY)
        navigate('/home', { replace: true })
    }

    return(
        <div className="h-screen">
            <Link to='/home' className="fixed h-10 w-10 flex items-center justify-center rounded-full top-2 left-2 
                bg-white/10 backdrop-blur-md border border-blue-900 shadow-lg active:bg-blue-900 transition duration-100"
                onClick={() => sessionStorage.removeItem(ACTIVE_RIDE_KEY)}
            >
                <Home className="text-blue-700 active:text-white duration-100"/>
            </Link>

            <div className="h-[40%]">
                <LiveTracking
                    pickupAddress={ride?.pickup}
                    destinationAddress={ride?.destination}
                    userLocation={userCoords ? { lat: userCoords.lat, lng: userCoords.lng } : null}
                    captainLocation={captainLiveLocation}
                    heightClass="h-full"
                />
            </div>

            <div className="h-[60%] p-4">
                <div className="flex items-center justify-between">
                    <img  className="h-12" alt="car" src=""/>
                    <div className="text-right">
                        <h2 className="text-lg font-medium ">{captain ? `${captain.fullname.firstname} ${captain.fullname.lastname}`.trim() : 'Captain'}</h2>
                        <h4 className="text-2xl font-semibold pb-1">{vehicle?.plate ?? '--'}</h4>
                        <p className="text-sm text-gray-600">Vehicle Color : <span className="font-semibold">{vehicle?.color ?? '--'}</span></p>
                    </div>
                </div>

                <div className="flex gap-2 justify-between flex-col items-center mt-5">
                    <div className="w-full">

                        <div className="flex items-center gap-3 border-t-2">
                            <LocateFixed className="h-6 w-6"/>
                            <div className="flex flex-col m-2">
                                <h3 className="text-lg font-semibold">{pickup.heading || 'Pickup'}</h3>
                                {!!pickup.details && <p className="text-sm text-gray-600">{pickup.details}</p>}
                            </div>
                        </div>

                        <div className="flex items-center gap-3 border-t-2">
                            <Pin className="h-6 w-6"/>
                            <div className="flex flex-col m-2">
                                <h3 className="text-lg font-semibold">{destinationParts.heading || 'Pickup'}</h3>
                                {!!destinationParts.details && <p className="text-sm text-gray-600">{destinationParts.details}</p>}
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
                <button 
                    onClick={handlePayment}
                    className="w-[50%] bg-green-600 font-semibold text-lg rounded-2xl p-2 text-white mb-2 absolute right-[25%] bottom-1"
                >
                    Pay 
                </button>
            </div>
        </div>
    )
}