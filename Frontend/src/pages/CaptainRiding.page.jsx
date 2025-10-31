import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {ChevronDown, Home } from "lucide-react"
import { useRef, useState , useEffect , useContext} from "react";
import { Link , useLocation , useNavigate} from "react-router-dom"
import { FinishRide } from "../components/FinishRide.Components.jsx";
import axios from 'axios';
import { SocketContext } from "../context/SocketDataContext.js";
import { useDeviceLocation } from "../components/useDeviceLocation.jsx";
import { LiveTracking } from "../components/LiveTracking.jsx";

export const CaptainRiding = () => {

    const [finishRidingPanel , setfinishRidingPanel] = useState(false);
    const FinishRideRef = useRef(null)
    const location = useLocation();
    const navigate = useNavigate();
    const { socket } = useContext(SocketContext);
    const CAPTAIN_ACTIVE_RIDE_KEY = 'captainActiveRide';
    const USER_ACTIVE_RIDE_KEY = 'userActiveRide';
    const { coords: captainCoords } = useDeviceLocation({ enableHighAccuracy: true });
    const [userLiveLocation, setUserLiveLocation] = useState(null);

    const [rideData, setRideData] = useState(() => {
        if (location.state?.ride) return location.state.ride;
        const persisted = sessionStorage.getItem(CAPTAIN_ACTIVE_RIDE_KEY);
        return persisted ? JSON.parse(persisted) : null;
    });

    useEffect(() => {
        if(!rideData){
            navigate('/captain-home', { replace: true });
            return;
        }
        sessionStorage.setItem(CAPTAIN_ACTIVE_RIDE_KEY, JSON.stringify(rideData));
    } , [rideData , navigate])

    useEffect(() => {
        if (!socket) return;
        const handleUserLocation = ({ location }) => setUserLiveLocation(location);
        socket.on("user-location", handleUserLocation);
        return () => socket.off("user-location", handleUserLocation);
    }, [socket]);

    useEffect(() => {
        if (!socket || !rideData?.captain?._id || !captainCoords) return;
        socket.emit("update-location-captain", {
            userId: rideData.captain._id,
            location: { lat: captainCoords.lat, lng: captainCoords.lng },
        });
    }, [socket, rideData, captainCoords]);

    const handleFinishRide = async() => {
        if(!rideData?._id) return;

        const captainToken = localStorage.getItem('captainToken');
        if (!captainToken) return;

        try{
            await axios.post(`${import.meta.env.VITE_BASE_URL}/api/rides/end-ride` , 
                null,
                {
                    params: { rideId: rideData._id },
                    headers: {
                        Authorization: `Bearer ${captainToken}`,
                    }
                }
            )
        } catch(error){
            console.log(error.message);
            return;
        }

        sessionStorage.removeItem(CAPTAIN_ACTIVE_RIDE_KEY);
        sessionStorage.removeItem(USER_ACTIVE_RIDE_KEY);
        navigate('/captain-home', { replace: true });
    };

    useEffect(() => {
        if (FinishRideRef.current) {
            gsap.set(FinishRideRef.current, { yPercent: 100 });
        }
    } , [])

    useGSAP(() => {
        if(!FinishRideRef.current) return;
        
        gsap.to(FinishRideRef.current , {
            yPercent : finishRidingPanel ? 0 : 100,
            duration : 0.4,
            ease : 'power2.out'
        })
    }, [finishRidingPanel])

    return(
        <div className="h-screen">
            <div className="fixed p-6 top-0 flex items-center justify-between w-screen">
                <img className="w-16" src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"/>
                <Link to='/captain-home' className="h-10 w-10 flex items-center justify-center rounded-full top-2 left-2 
                    bg-white/10 backdrop-blur-md border border-blue-900 shadow-lg active:bg-blue-900 transition duration-100">
                    <Home className="text-blue-700 active:text-white duration-100"/>
                </Link>
            </div>
            <div className="h-4/5">
                <LiveTracking
                    pickupAddress={rideData?.pickup}
                    destinationAddress={rideData?.destination}
                    userLocation={userLiveLocation}
                    captainLocation={captainCoords ? { lat: captainCoords.lat, lng: captainCoords.lng } : null}
                />
            </div>

            <div className="h-1/5 p-6 bg-yellow-400 flex flex-col justify-center items-center gap-4">
                <ChevronDown className="text-black h-8 w-8 relative -top-3" />
                <div className="flex items-center justify-center gap-6 relative -top-2">
                    <h4 className="text-xl font-semibold">4 KM away</h4>
                    <button
                        onClick={() => {setfinishRidingPanel(true)}}
                        className="bg-green-600 text-white font-semibold py-2 px-8 rounded-lg"
                    >
                        Complete Ride
                    </button>
                </div>
            </div>

            <div ref={FinishRideRef} className="fixed bottom-0 z-10 w-full bg-white px-3 py-6 pt-12">
                <FinishRide 
                    ride={rideData}
                    setfinishRidingPanel={setfinishRidingPanel}
                    onFinishRide={handleFinishRide}
                />
            </div>
        </div>
    )
}