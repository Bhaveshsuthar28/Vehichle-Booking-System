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
import ThemeSwitcher from "../components/ThemeSwitcher";
import Sidebar from "../components/Sidebar.jsx";
import { Menu } from "lucide-react";

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
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [userData, setUserData] = useState(null);

    const isFindTripEnabled = pick.trim().length > 0 && destination.trim().length > 0;
    const {socket} = useContext(SocketContext)
    const {user} = useContext(UserDataContext);
    const navigate = useNavigate();
    const USER_ACTIVE_RIDE_KEY = 'userActiveRide';
    const { coords: userCoords } = useDeviceLocation({ enableHighAccuracy: true });
    const userMapLocation = userCoords ? { lat: userCoords.lat, lng: userCoords.lng } : null;
    const GEOAPIFY_API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;

    const fetchUserData = async () => {
        const userToken = localStorage.getItem('userToken');
        if (!userToken) return;
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/users/profile`, {
                headers: { Authorization: `Bearer ${userToken}` },
            });
            setUserData(response.data);
        } catch (error) {
            console.error("Failed to fetch user data", error);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const handleEditProfile = async (editedData) => {
        const userToken = localStorage.getItem('userToken');
        try {
            const response = await axios.put(`${import.meta.env.VITE_BASE_URL}/api/users/profile`, editedData, {
                headers: { Authorization: `Bearer ${userToken}` },
            });
            setUserData(response.data);
        } catch (error) {
            console.error("Failed to update profile", error);
        }
    };

    const handleUploadImage = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const formData = new FormData();
            formData.append('profileImage', file);

            const userToken = localStorage.getItem('userToken');
            try {
                const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/users/profile/upload-image`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${userToken}`,
                    },
                });
                setUserData(response.data);
            } catch (error) {
                console.error("Failed to upload image", error);
            }
        };
        input.click();
    };


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

    const handleLogout = () => {
        localStorage.removeItem('userToken');
        navigate('/user-login');
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
        <div className="h-screen relative overflow-hidden flex">
            {isSidebarOpen && userData && (
                <Sidebar
                    user={userData}
                    tripHistory={userData.tripHistory}
                    onEditProfile={handleEditProfile}
                    onUploadImage={handleUploadImage}
                />
            )}
            <div className="flex-1 flex flex-col">
                <div className="absolute top-4 right-4 z-20">
                    <ThemeSwitcher />
                </div>
                <div className="absolute top-4 left-4 z-20 flex items-center gap-4">
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="h-10 w-10 flex items-center justify-center rounded-full bg-secondary/10 backdrop-blur-md border border-accent shadow-lg active:bg-accent transition duration-100">
                        <Menu className="text-accent active:text-on-accent duration-100"/>
                    </button>
                    <button onClick={handleLogout} className="bg-accent text-on-accent px-4 py-2 rounded-lg">
                        Logout
                    </button>
                </div>
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
                    <div className="h-[30%] bg-secondary p-6 relative flex flex-col justify-center items-center gap-y-4 rounded-t-3xl">
                        {panelOpen && <ChevronDown ref={panelCloseRef} onClick={handlePanelClose} className={`absolute right-5 top-6 cursor-pointer text-xl transition-opacity duration-200 ${panelOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} text-text-secondary`}/>}
                        <h4 className="text-2xl font-semibold mt-5 text-text-primary">Find a trip</h4>
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
                                className="bg-primary text-text-primary border border-border-color pl-12 pr-2 py-2 text-base rounded-lg mt-5 mb-2 w-full placeholder:text-text-secondary"
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
                                    className="absolute right-6 top-[31%] rounded-lg px-3 py-1 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {isResolvingPickupFromDevice ? <LocateFixed className="text-accent"/> : <LocateFixed className="text-text-secondary"/>}
                                </button>
                            )}

                            <input
                                onClick={() => {
                                    setpanelOpen(true),
                                    setactiveField('destination')
                                }}
                                className="bg-primary text-text-primary border border-border-color pl-12 pr-2 py-2 text-base rounded-lg mt-3 w-full placeholder:text-text-secondary"
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
                                className={`flex items-center justify-center w-full bg-accent text-on-accent font-semibold py-3 rounded-xl mt-5 ${!isFindTripEnabled && 'opacity-50 cursor-not-allowed'}`}
                            >
                                Find Trip
                            </button>
                        )}
                    </div>

                    <div ref={panelRef} className="bg-secondary h-0 opacity-0">
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

                <div ref={vehicleRef} className="fixed bottom-0 z-10 w-full bg-secondary px-3 py-10 pt-12 rounded-t-3xl">
                    <VehiclePanel Fare={Fare} vehicleType={setvehicleType} setvehiclePanelOpen={setvehiclePanelOpen} setconfirmRidePanel={setconfirmRidePanel}/>
                </div>

                <div ref={ConfirmRef} className="fixed bottom-0 z-10 w-full bg-secondary px-3 py-6 pt-12 rounded-t-3xl">
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
                
                <div ref={LookingRef} className="fixed bottom-0 z-10 w-full bg-secondary px-3 py-6 pt-12 rounded-t-3xl">
                    <LookingRide
                        CreateRide={CreateRide}
                        setlookingPanelOpen={setlookingPanelOpen}
                        pick={pick} 
                        destination={destination} 
                        Fare={Fare}
                        vehicleType={vehicleType}
                    />
                </div>
                 
                <div ref={WaitingRef} className="fixed bottom-0 z-10 w-full bg-secondary px-3 py-6 pt-12 rounded-t-3xl">
                    <WaitingForDriver 
                        rideInfo={rideInfo}
                        setwaitingDriverPanel={setwaitingDriverPanel}/>
                </div>
             
            </div>
             
        </div>
    )
}