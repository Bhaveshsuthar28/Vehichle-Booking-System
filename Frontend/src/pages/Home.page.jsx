import { useRef, useState , useEffect} from "react";
import {useGSAP} from "@gsap/react"
import gsap from "gsap";
import { ChevronDown , Home as HomeIcon} from 'lucide-react';
import { LocationSearchPanel } from "../components/LocationPanel.components.jsx";
import {VehiclePanel} from '../components/Vehicle.price.components.jsx'
import { ConfirmedVehicle } from "../components/Confirmed.vehicle.jsx";
import { LookingRide } from "../components/LookingForDriver.jsx";
import { WaitingForDRiver } from "../components/WaitingForDriverPanel.jsx";
import { Link } from "react-router-dom";
import axios from 'axios'

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

    const HandlePickupChange = async(e) => {
        setpick(e.target.value);
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/maps/get-suggestions`, {
                    params : {input : e.target.value},
                    headers : {
                        Authorization : `Bearer ${localStorage.getItem('token')}`
                    }
                },
            )

            setpickupSuggestions(response.data)
        } catch (error) {
            console.log(error.message)
        } 
    }

    const HandleDestinationChange = async(e) => {
        setdestination(e.target.value);
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/maps/get-suggestions`, {
                    params : {input : e.target.value},
                    headers : {
                        Authorization : `Bearer ${localStorage.getItem('token')}`
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


    const FindTrip = () => {
        setpanelOpen(false)
        setvehiclePanelOpen(true)
    }
 
    return(
        <div className="h-screen relative overflow-hidden">
            <Link to="" className="fixed h-10 w-10 flex items-center justify-center rounded-full top-2 left-2 
                bg-white/10 backdrop-blur-md border border-blue-900 shadow-lg active:bg-blue-900 transition duration-100">
                <HomeIcon className="text-blue-700 active:text-white duration-100"/>
            </Link>

            <img className="w-16 absolute left-5 top-5" src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"/>

            <div className="h-screen w-screen z-0 absolute top-0 left-0">
                <img className="w-full h-full object-cover" src="https://images.prismic.io/superpupertest/75d32275-bd15-4567-a75f-76c4110c6105_1*mleHgMCGD-A1XXa2XvkiWg.png?auto=compress,format&w=1966&h=1068"/>
            </div>

            <div className="flex flex-col justify-end h-screen absolute top-0 w-full">
                <div className="h-[30%] bg-white p-6 relative">
                    {panelOpen && <ChevronDown ref={panelCloseRef} onClick={handlePanelClose} className={`absolute right-5 top-6 cursor-pointer text-xl transition-opacity duration-200 ${panelOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}/>}
                    <h4 className="text-2xl font-semibold">Find a trip</h4>
                    <form
                        onSubmit={(e) => {
                            handleSubmit(e)
                        }}
                    >
                        <div className="absolute h-14 w-1 bg-gray-400 top-[50%] left-8 rounded-full"></div>
                        <input
                            onClick={() => {
                                setpanelOpen(true),
                                setactiveField('pickup')
                            }}
                            className="bg-[#eee] px-12 py-2 text-base rounded-lg mt-5 w-full"
                            type="text"
                            placeholder="Add a pick-up location"
                            value={pick}
                            onChange={HandlePickupChange}
                        />

                        <input
                            onClick={() => {
                                setpanelOpen(true),
                                setactiveField('destination')
                            }}
                            className="bg-[#eee] px-12 py-2 text-base rounded-lg mt-3 w-full"
                            type="text"
                            placeholder="Enter your destination"
                            value={destination}
                            onChange={HandleDestinationChange}
                        />
                    </form>

                    {panelOpen && (
                        <button
                            onClick={FindTrip}
                            className="flex items-center justify-center w-full bg-[#10b461] text-white font-semibold py-3 rounded-xl mt-5"
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
                    />
                </div>
            </div>

            <div ref={vehicleRef} className="fixed bottom-0 z-10 w-full bg-white px-3 py-10 pt-12">
                <VehiclePanel setvehiclePanelOpen={setvehiclePanelOpen} setconfirmRidePanel={setconfirmRidePanel}/>
            </div>

            <div ref={ConfirmRef} className="fixed bottom-0 z-10 w-full bg-white px-3 py-6 pt-12">
                <ConfirmedVehicle setconfirmRidePanel={setconfirmRidePanel} setlookingPanelOpen={setlookingPanelOpen} setvehiclePanelOpen={setvehiclePanelOpen}/>
            </div>
            
            <div ref={LookingRef} className="fixed bottom-0 z-10 w-full bg-white px-3 py-6 pt-12">
                <LookingRide setlookingPanelOpen={setlookingPanelOpen}/>
            </div>
             
            <div ref={WaitingRef} className="fixed bottom-0 z-10 w-full bg-white px-3 py-6 pt-12">
                <WaitingForDRiver setwaitingDriverPanel={setwaitingDriverPanel}/>
            </div>
             
        </div>
    )
}