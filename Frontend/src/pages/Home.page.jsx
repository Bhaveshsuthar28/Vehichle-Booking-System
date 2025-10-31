import {useRef, useState , useEffect , useContext , useCallback} from "react";
import {useGSAP} from "@gsap/react"
import gsap from "gsap";
import { ChevronDown , Home as HomeIcon , LocateFixed} from 'lucide-react';
import { LocationSearchPanel } from "../components/LocationPanel.components.jsx";
import {VehiclePanel} from '../components/Vehicle.price.components.jsx'
import { ConfirmedVehicle } from "../components/Confirmed.vehicle.jsx";
import { LookingRide } from "../components/LookingForDriver.jsx";
import { WaitingForDriver } from "../components/WaitingForDriverPanel.jsx";
import { Link , useNavigate} from "react-router-dom";
import axios from 'axios'
import { SocketContext } from "../context/SocketDataContext.js";
import { UserDataContext } from "../context/UserDataContext.jsx";
import { LiveTracking } from "../components/LiveTracking.jsx";
import {useDeviceLocation} from "../components/useDeviceLocation.jsx";

export const Home = () => {

    const [pick , setpick] = useState('');
    const [destination , setdestination] = useState('');
    const [panelOpen , setpanelOpen] = useState(false);
    const panelRef = useRef(null);
    const panelCloseRef = useRef(null);
    const vehicleRef = useRef(null);
    const ConfirmRef = useRef(null);
    const LookingRef = useRef(null);
    const WaitingRef = useRef(null);
    const [vehiclePanelOpen , setvehiclePanelOpen] = useState(false);
    const [confirmRidePanel , setconfirmRidePanel] = useState(false);
    const [lookingPanelOpen , setlookingPanelOpen] = useState(false);
    const [waitingDriverPanel , setwaitingDriverPanel] = useState(false)
    const [pickupSuggestions , setpickupSuggestions] = useState([]);
    const [destinationSuggestions , setdestinationSuggestions] = useState([]);
    const [activeField , setactiveField] = useState(null); 
    const [Fare , setFare] = useState({});
    const [vehicleType , setvehicleType] = useState(null);
    const [rideInfo , setrideInfo] = useState(null);
    const [captainLiveLocation, setCaptainLiveLocation] = useState(null);
    const [isResolvingPickupFromDevice, setIsResolvingPickupFromDevice] = useState(false);
    const isFindTripEnabled = pick.trim().length > 0 && destination.trim().length > 0;
    const {socket} = useContext(SocketContext)
    const {user} = useContext(UserDataContext);
    const navigate = useNavigate();
    const USER_ACTIVE_RIDE_KEY = 'userActiveRide';
    const { coords: userCoords } = useDeviceLocation({ enableHighAccuracy: true });
    const userMapLocation = userCoords ? { lat: userCoords.lat, lng: userCoords.lng } : null;
    const GEOAPIFY_API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;


    const fillPickupWithCurrentLocation = useCallback(async() => {
        if (!navigator.geolocation || !GEOAPIFY_API_KEY) return;

        setIsResolvingPickupFromDevice(true);

        try{
            const response = await fetch(
                `https://api.geoapify.com/v1/geocode/reverse?lat=${userCoords.lat}&lon=${userCoords.lng}&limit=1&apiKey=${GEOAPIFY_API_KEY}`
            );
            if (!response.ok) throw new Error("Reverse geocode failed");
            const data = await response.json();
            const formatted = data.features?.[0]?.properties?.formatted;

            if (formatted) {
                setpick(formatted);
                setactiveField(null);
                setpickupSuggestions([]);
                setdestinationSuggestions([]);
            }
        } catch(error){
            console.error("Reverse geocode error:", error.message);
        } finally{
            setIsResolvingPickupFromDevice(false);
        }
    } , [userCoords, GEOAPIFY_API_KEY]);
    useEffect(()=> {
        if(!user) return;
        
        console.log(user);

        socket.emit("join" , {userType : "user" , userId : user._id})

    } , [user , socket]);

    useEffect(() => {

        if(!socket) return;

        const handleRideConfirmed = (data) => {
            console.log('Ride confirmed' , data);
            setwaitingDriverPanel(true);
            setrideInfo(data);
            sessionStorage.setItem(USER_ACTIVE_RIDE_KEY, JSON.stringify(data));
        };

        const handleRideStarted = (data) => {
            setwaitingDriverPanel(false);
            
            if(data){
                setrideInfo(data);
                sessionStorage.setItem(USER_ACTIVE_RIDE_KEY , JSON.stringify(data));
                navigate('/riding', { state: { ride: data } });
            }else{
                const persisted = sessionStorage.getItem(USER_ACTIVE_RIDE_KEY);
                if(persisted){
                    navigate('/riding' , {state : {ride : JSON.parse(persisted)}})
                }
            }
        };

        const handleCaptainLocation = ({ location }) => {
            setCaptainLiveLocation(location);
        };

        socket.on('ride-confirmed' , handleRideConfirmed)

        socket.on('ride-started' , handleRideStarted);

        socket.on('captain-location', handleCaptainLocation)

        return () => {
            socket.off('ride-confirmed', handleRideConfirmed);
            socket.off('ride-started', handleRideStarted);
            socket.off('captain-location', handleCaptainLocation);
        };
    } , [socket , navigate])

    const HandlePickupChange = async(e) => {
        setpick(e.target.value);
        const userToken = localStorage.getItem('userToken');
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/maps/get-suggestions`, {
                    params : {input : e.target.value},
                    headers : {
                        Authorization : `Bearer ${userToken}`
                    }
                },
            )

            setpickupSuggestions(response.data)
        } catch (error) {
            console.log(error.message)
        } 
    }

    useEffect(() => {
        if (!socket || !user?._id || !userCoords) return;

        socket.emit("update-location-user", {
            userId: user._id,
            location: { lat: userCoords.lat, lng: userCoords.lng },
        });
    } , [socket, user, userCoords])

    const HandleDestinationChange = async(e) => {
        setdestination(e.target.value);
        const userToken = localStorage.getItem('userToken');
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/maps/get-suggestions`, {
                    params : {input : e.target.value},
                    headers : {
                        Authorization : `Bearer ${userToken}`
                    }
                },
            )

            setdestinationSuggestions(response.data)
        } catch (error) {
            console.log(error.message)
        } 
    }

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    const handlePanelClose = () => {
        setpanelOpen(false);
        setactiveField(null);
        setpickupSuggestions([]);
        setdestinationSuggestions([]);
        setpick('');
        setdestination('');
    };

    const FindTrip = async() => {
        setpanelOpen(false)
        setvehiclePanelOpen(true)
        const userToken = localStorage.getItem('userToken');
        try{
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/rides/get-fare`, {
                params : {pickup : pick , destination},
                headers : {
                    Authorization : `Bearer ${userToken}`
                }
            })

            setFare(response.data)
        }
        catch(error){
            console.log(error.message)
        }
    }

    const CreateRide = async() => {
        const userToken = localStorage.getItem('userToken');
        try{
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/rides/create`, {
                pickup : pick,
                destination,
                vehicleType
            } , {
                headers : {
                    Authorization : `Bearer ${userToken}`
                }
            })
            console.log(response.data)
        } catch(error){
            console.log(error.message)
        }
    }

    useEffect(() => {
        if(vehicleRef.current){
            gsap.set(vehicleRef.current , {yPercent : 100});
        }

        if(ConfirmRef.current){
            gsap.set(ConfirmRef.current , {yPercent : 100});
        }
    } ,[])

    useGSAP(function(){
        if (!panelRef.current) return;
        if(panelOpen){
            gsap.to(panelRef.current , {
                height : '70%',
                opacity : 1,
                padding : 24,
                duration : 0.4
            })
            
        }else{
            gsap.to(panelRef.current , {
                height : '0%',
                opacity : 0,
                padding : 0,
                duration : 0.4
            })
            
        }
    } , [panelOpen])

    useGSAP(() => {
        if(!vehicleRef.current) return;

        if(vehiclePanelOpen){
            setpanelOpen(false);
        }
        
        gsap.to(vehicleRef.current , {
            yPercent : vehiclePanelOpen ? 0 : 100,
            duration : 0.4,
            ease : "power2.out"
        })
    }, [vehiclePanelOpen])


    useGSAP(() => {
        if(!ConfirmRef.current) return;

        if(confirmRidePanel){
            setvehiclePanelOpen(false)
        }
        
        gsap.to(ConfirmRef.current , {
            yPercent : confirmRidePanel ? 0 : 100,
            duration : 0.4,
            ease : 'power2.out'
        })
    }, [confirmRidePanel])

    useGSAP(() => {
        if(!LookingRef.current) return;

        if(confirmRidePanel){
            setconfirmRidePanel(false)
        }
        
        gsap.to(LookingRef.current , {
            yPercent : lookingPanelOpen ? 0 : 100,
            duration : 0.4,
            ease : 'power2.out'
        })
    }, [lookingPanelOpen])

    useGSAP(() => {
        if(!WaitingRef.current) return;

        if(lookingPanelOpen){
            setlookingPanelOpen(false)
        }
        
        gsap.to(WaitingRef.current , {
            yPercent : waitingDriverPanel ? 0 : 100,
            duration : 0.4,
            ease : 'power2.out'
        })
    }, [waitingDriverPanel])


 
    return(
        <div className="h-screen relative overflow-hidden">
            <div className="h-screen w-screen z-0 absolute top-0 left-0">
                <LiveTracking
                    pickupAddress={rideInfo ? rideInfo.pickup : null}
                    destinationAddress={rideInfo ? rideInfo.destination : null}
                    userLocation={userMapLocation}
                    captainLocation={rideInfo ? captainLiveLocation : null}
                    heightClass="h-full"
                />
            </div>

            <div className="flex flex-col justify-end h-screen absolute top-0 w-full">
                <div className="h-[30%] bg-white p-6 relative flex flex-col justify-center items-center gap-y-4">
                    {panelOpen && <ChevronDown ref={panelCloseRef} onClick={handlePanelClose} className={`absolute right-5 top-6 cursor-pointer text-xl transition-opacity duration-200 ${panelOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}/>}
                    <h4 className="text-2xl font-semibold mt-5">Find a trip</h4>
                    <form
                        onSubmit={(e) => {
                            handleSubmit(e)
                        }}
                    >
                        <div className={`absolute h-14 w-1 ${panelOpen ? 'top-[38%] left-10' : 'top-[52%] left-10'} bg-gray-600 rounded-full`}></div>
                        <input
                            onClick={() => {
                                setpanelOpen(true),
                                setactiveField('pickup')
                            }}
                            className="bg-[#eee] pl-12 pr-2 py-2 text-base rounded-lg mt-5 mb-2 w-full"
                            type="text"
                            placeholder="Add a pick-up location"
                            value={pick}
                            onChange={HandlePickupChange}
                        />

                        {!pick && panelOpen && (
                            <button
                                type="button"
                                onClick={fillPickupWithCurrentLocation}
                                disabled={!userCoords || isResolvingPickupFromDevice}
                                className="absolute right-6 top-[31%] rounded-lg px-3 py-1 text-xs font-semibold text-black transition disabled:cursor-not-allowed disabled:opacity-50 bg-transparent"
                            >
                                {isResolvingPickupFromDevice ? <LocateFixed className="opacity-100"/> : <LocateFixed className="opacity-50"/>}
                            </button>
                        )}

                        <input
                            onClick={() => {
                                setpanelOpen(true),
                                setactiveField('destination')
                            }}
                            className="bg-[#eee] pl-12 pr-2 py-2 text-base rounded-lg mt-3 w-full"
                            type="text"
                            placeholder="Enter your destination"
                            value={destination}
                            onChange={HandleDestinationChange}
                        />
                    </form>

                    {panelOpen && (
                        <button
                            onClick={FindTrip}
                            disabled={!isFindTripEnabled}
                            className={`flex items-center justify-center w-full bg-[#10b461] text-white font-semibold py-3 rounded-xl mt-5 ${!isFindTripEnabled && 'opacity-50 cursor-not-allowed'}`}
                        >
                            Find Trip
                        </button>
                    )}
                </div>

                <div ref={panelRef} className="bg-white h-0 opacity-0">
                    <LocationSearchPanel 
                        suggestions={activeField === 'pickup' ? pickupSuggestions : destinationSuggestions}
                        setpick={setpick}
                        setdestination={setdestination}
                        activeField={activeField}
                        showUseCurrent={Boolean(userCoords)}
                        onUseCurrentLocation={fillPickupWithCurrentLocation}
                        currentLocationLoading={isResolvingPickupFromDevice}
                    />
                </div>
            </div>

            <div ref={vehicleRef} className="fixed bottom-0 z-10 w-full bg-white px-3 py-10 pt-12">
                <VehiclePanel Fare={Fare} vehicleType={setvehicleType} setvehiclePanelOpen={setvehiclePanelOpen} setconfirmRidePanel={setconfirmRidePanel}/>
            </div>

            <div ref={ConfirmRef} className="fixed bottom-0 z-10 w-full bg-white px-3 py-6 pt-12">
                <ConfirmedVehicle 
                    CreateRide={CreateRide} 
                    pick={pick} 
                    destination={destination} 
                    Fare={Fare}
                    vehicleType={vehicleType}
                    setconfirmRidePanel={setconfirmRidePanel} 
                    setlookingPanelOpen={setlookingPanelOpen} 
                    setvehiclePanelOpen={setvehiclePanelOpen}
                />
            </div>
            
            <div ref={LookingRef} className="fixed bottom-0 z-10 w-full bg-white px-3 py-6 pt-12">
                <LookingRide
                    CreateRide={CreateRide}
                    setlookingPanelOpen={setlookingPanelOpen}
                    pick={pick} 
                    destination={destination} 
                    Fare={Fare}
                    vehicleType={vehicleType}
                />
            </div>
             
            <div ref={WaitingRef} className="fixed bottom-0 z-10 w-full bg-white px-3 py-6 pt-12">
                <WaitingForDriver 
                    rideInfo={rideInfo}
                    setwaitingDriverPanel={setwaitingDriverPanel}/>
            </div>
             
        </div>
    )
}