import { LogOut} from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
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
import ThemeSwitcher from "../components/ThemeSwitcher.jsx"
import Sidebar from "../components/Sidebar.jsx";
import { Menu } from "lucide-react";

export const CapatainHome = () => {
    const [ridePopupPanel , setridePopupPanel] = useState(false);
    const [ConfirmridePopupPanel , setConfirmridePopupPanel] = useState(false);
    const [ride , setride] = useState(null);
    const [userLiveLocation, setUserLiveLocation] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [captainData, setCaptainData] = useState(null);

    const {socket} = useContext(SocketContext);
    const {captain} = useContext(CaptainDataContext)
    const { coords: captainCoords } = useDeviceLocation({ enableHighAccuracy: true });
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('captainToken');
        socket.emit('captain-logout', { captainId: captain._id });
        navigate('/captain-login');
    }

    const fetchCaptainData = async () => {
        const captainToken = localStorage.getItem('captainToken');
        if (!captainToken) return;
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/captains/profile`, {
                headers: { Authorization: `Bearer ${captainToken}` },
            });
            setCaptainData(response.data);
        } catch (error) {
            console.error("Failed to fetch captain data", error);
        }
    };

    useEffect(() => {
        fetchCaptainData();
    }, []);

    const handleEditProfile = async (editedData) => {
        const captainToken = localStorage.getItem('captainToken');
        try {
            const response = await axios.put(`${import.meta.env.VITE_BASE_URL}/api/captains/profile`, editedData, {
                headers: { Authorization: `Bearer ${captainToken}` },
            });
            setCaptainData(response.data);
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

            const captainToken = localStorage.getItem('captainToken');
            try {
                const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/captains/profile/upload-image`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${captainToken}`,
                    },
                });
                setCaptainData(response.data);
            } catch (error) {
                console.error("Failed to upload image", error);
            }
        };
        input.click();
    };


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
        <div className="h-screen bg-primary text-text-primary flex">
            {isSidebarOpen && captainData && (
                <Sidebar
                    user={captainData}
                    stats={captainData.stats}
                    tripHistory={captainData.tripHistory}
                    onEditProfile={handleEditProfile}
                    onUploadImage={handleUploadImage}
                    isCaptain={true}
                />
            )}
            <div className="flex-1 flex flex-col">
                <div className="fixed p-6 top-0 flex items-center justify-between w-screen">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="h-10 w-10 flex items-center justify-center rounded-full bg-secondary/10 backdrop-blur-md border border-accent shadow-lg active:bg-accent transition duration-100">
                            <Menu className="text-accent active:text-on-accent duration-100"/>
                        </button>
                        <img className="w-16" src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"/>
                        <ThemeSwitcher />
                    </div>
                    <button onClick={handleLogout} className="h-10 w-10 flex items-center justify-center rounded-full top-2 left-2 
                        bg-secondary/10 backdrop-blur-md border border-accent shadow-lg active:bg-accent transition duration-100">
                        <LogOut className="text-accent active:text-on-accent duration-100"/>
                    </button>
                </div>
                <div className="h-[60%]">
                    <LiveTracking
                        pickupAddress={ride ? ride.pickup : null}
                        destinationAddress={ride ? ride.destination : null}
                        userLocation={ride ? userLiveLocation : null}
                        captainLocation={captainCoords ? { lat: captainCoords.lat, lng: captainCoords.lng } : null}
                    />
                </div>

                <div className="h-[40%] p-6 bg-secondary">
                    <CaptainInfo/>
                </div>

                <div ref={ridepopUpRef} className="fixed bottom-0 z-10 w-full bg-secondary px-3 py-6 pt-12 rounded-t-3xl">
                    <RidePopUp 
                        setridePopupPanel={setridePopupPanel} 
                        setConfirmridePopupPanel={setConfirmridePopupPanel}
                        ride={ride}
                        confirmRide={confirmRide}
                    />
                </div>

                <div ref={ConfirmRideRef} className="fixed bottom-0 h-screen z-10 w-full bg-secondary px-3 py-6 pt-12">
                    <ConfirmRidePopup 
                        setConfirmridePopupPanel={setConfirmridePopupPanel} 
                        setridePopupPanel={setridePopupPanel}
                        ride={ride}
                    />
                </div>
            </div>
        </div>
    )
}