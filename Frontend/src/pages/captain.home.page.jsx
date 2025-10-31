import { LogOut} from "lucide-react"
import { Link } from "react-router-dom"
import { CaptainInfo } from "../components/Captain.Info.jsx"
import { RidePopUp } from "../components/RidePopUp.jsx"
import { useRef, useState , useEffect , useContext} from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ConfirmRidePopup } from "../components/ConfirmridePopup.jsx"
import { SocketContext } from "../context/SocketDataContext.js";
import {CaptainDataContext} from "../context/UserDataContext.jsx"
import axios from 'axios'
import { LiveTracking } from "../components/LiveTracking.jsx"
import {useDeviceLocation} from "../components/useDeviceLocation.jsx"

export const CapatainHome = () => {
    const [ridePopupPanel , setridePopupPanel] = useState(false);
    const [ConfirmridePopupPanel , setConfirmridePopupPanel] = useState(false);
    const [ride , setride] = useState(null);
    const [userLiveLocation, setUserLiveLocation] = useState(null);

    const {socket} = useContext(SocketContext);
    const {captain} = useContext(CaptainDataContext)
    const { coords: captainCoords } = useDeviceLocation({ enableHighAccuracy: true });

    useEffect(() => {   
        if (!captain || !socket) return;
        console.log(captain);

        socket.emit("join" , {
            userType : "Captain",
            userId : captain._id
        })

        const handleJoinSuccess = (data) => {
            console.log('Successfully joined with socket:', data.socketId);
        };

        const handleNewRide =(payload) => {
            console.log('Received new ride:', payload);
            setride(payload);
            setridePopupPanel(true)
        }

        const handleUserLocation = ({ location }) => {
            setUserLiveLocation(location);
        };

        socket.on('join-success' , handleJoinSuccess)
        socket.on('new-ride'  , handleNewRide)
        socket.on('user-location', handleUserLocation)

        const updateLocation = ()  => {
            if(navigator.geolocation){
                navigator.geolocation.getCurrentPosition((position) =>{

                    console.log("updating location..." , position.coords.latitude , position.coords.longitude);

                    socket.emit('update-location-captain' , {
                        userId : captain._id,
                        location : {
                            lat : position.coords.latitude,
                            lng : position.coords.longitude
                        }
                    })
                })
            }
        }

        const LocationInterval = setInterval(updateLocation , 10000);
        updateLocation();

        return () => {
            socket.off("join-success", handleJoinSuccess);
            socket.off("new-ride" , handleNewRide);
            socket.off("user-location", handleUserLocation);
            clearInterval(LocationInterval);
        }

    } , [captain , socket])

    useEffect(() => {
        if (!socket || !captain?._id || !captainCoords) return;
        socket.emit("update-location-captain", {
            userId: captain._id,
            location: { lat: captainCoords.lat, lng: captainCoords.lng },
        });
    }, [socket, captain, captainCoords]);

    const confirmRide = async() => {
        const captainToken = localStorage.getItem('captainToken');
        if(!captainToken || !ride?._id) return;

        await axios.post(`${import.meta.env.VITE_BASE_URL}/api/rides/confirm` ,
            { rideId: ride._id },
            {
                headers: {
                    Authorization: `Bearer ${captainToken}`,
                },
            },
        )

        setridePopupPanel(false);
        setConfirmridePopupPanel(true);
    }

    const ridepopUpRef = useRef(null);
    const ConfirmRideRef = useRef(null);

    
    useGSAP(() => {
        if(!ridepopUpRef.current) return;
        
        gsap.to(ridepopUpRef.current , {
            yPercent : ridePopupPanel ? 0 : 100,
            duration : 0.4,
            ease : 'power2.out'
        })
    }, [ridePopupPanel])

    useGSAP(() => {
        if(!ConfirmRideRef.current) return;
        
        gsap.to(ConfirmRideRef.current , {
            yPercent : ConfirmridePopupPanel ? 0 : 100,
            duration : 0.4,
            ease : 'power2.out'
        })
    }, [ConfirmridePopupPanel])

    return(
        <div className="h-screen">
            <div className="fixed p-6 top-0 flex items-center justify-between w-screen">
                <img className="w-16" src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"/>
                <Link to='/' className="h-10 w-10 flex items-center justify-center rounded-full top-2 left-2 
                    bg-white/10 backdrop-blur-md border border-blue-900 shadow-lg active:bg-blue-900 transition duration-100">
                    <LogOut className="text-blue-700 active:text-white duration-100"/>
                </Link>
            </div>
            <div className="h-[60%]">
                <LiveTracking
                    pickupAddress={ride ? ride.pickup : null}
                    destinationAddress={ride ? ride.destination : null}
                    userLocation={ride ? userLiveLocation : null}
                    captainLocation={captainCoords ? { lat: captainCoords.lat, lng: captainCoords.lng } : null}
                />
            </div>

            <div className="h-[40%] p-6">
                <CaptainInfo/>
            </div>

            <div ref={ridepopUpRef} className="fixed bottom-0 z-10 w-full bg-white px-3 py-6 pt-12">
                <RidePopUp 
                    setridePopupPanel={setridePopupPanel} 
                    setConfirmridePopupPanel={setConfirmridePopupPanel}
                    ride={ride}
                    confirmRide={confirmRide}
                />
            </div>

            <div ref={ConfirmRideRef} className="fixed bottom-0 h-screen z-10 w-full bg-white px-3 py-6 pt-12">
                <ConfirmRidePopup 
                    setConfirmridePopupPanel={setConfirmridePopupPanel} 
                    setridePopupPanel={setridePopupPanel}
                    ride={ride}
                />
            </div>
        </div>
    )
}