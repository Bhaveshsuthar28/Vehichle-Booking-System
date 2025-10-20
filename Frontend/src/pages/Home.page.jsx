import { useRef, useState , useEffect} from "react";
import {useGSAP} from "@gsap/react"
import gsap from "gsap";
import { ChevronDown} from 'lucide-react';
import { LocationSearchPanel } from "../components/LocationPanel.components.jsx";
import {VehiclePanel} from '../components/Vehicle.price.components.jsx'
import { ConfirmedVehicle } from "../components/Confirmed.vehicle.jsx";
import { LookingRide } from "../components/LookingForDriver.jsx";
import { WaitingForDRiver } from "../components/WaitingForDriverPanel.jsx";

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

    const handleSubmit = (e) => {
        e.preventDefault();
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
        if (!panelRef.current || !panelCloseRef.current) return;
        if(panelOpen){
            gsap.to(panelRef.current , {
                height : '70%',
                opacity : 1,
                padding : 24,
                duration : 0.4
            })
            gsap.to(panelCloseRef.current , {
                opacity : 1,
                duration : 0.4
            })
        }else{
            gsap.to(panelRef.current , {
                height : '0%',
                opacity : 0,
                padding : 0,
                duration : 0.4
            })
            gsap.to(panelCloseRef.current , {
                opacity : 0,
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
            <img className="w-16 absolute left-5 top-5" src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"/>

            <div className="h-screen w-screen z-0 absolute top-0 left-0">
                <img className="w-full h-full object-cover" src="https://images.prismic.io/superpupertest/75d32275-bd15-4567-a75f-76c4110c6105_1*mleHgMCGD-A1XXa2XvkiWg.png?auto=compress,format&w=1966&h=1068"/>
            </div>

            <div className="flex flex-col justify-end h-screen absolute top-0 w-full">
                <div className="h-[30%] bg-white p-6 relative">
                    {panelOpen && <ChevronDown ref={panelCloseRef} onClick={() => {setpanelOpen(false)}} className="absolute right-5 top-6 cursor-pointer text-xl opacity-0"/>}
                    <h4 className="text-2xl font-semibold">Find a trip</h4>
                    <form
                        onSubmit={(e) => {
                            handleSubmit(e)
                        }}
                    >
                        <div className="absolute h-14 w-1 bg-gray-400 top-[50%] left-8 rounded-full"></div>
                        <input
                            onClick={() => {
                                setpanelOpen(true)
                            }}
                            className="bg-[#eee] px-12 py-2 text-base rounded-lg mt-5 w-full"
                            type="text"
                            placeholder="Add a pick-up location"
                            value={pick}
                            onChange={(e) => {
                                setpick(e.target.value)
                            }}
                        />

                        <input
                            onClick={() => {
                                setpanelOpen(true)
                            }}
                            className="bg-[#eee] px-12 py-2 text-base rounded-lg mt-3 w-full"
                            type="text"
                            placeholder="Enter your destination"
                            value={destination}
                            onChange={(e) => {
                                setdestination(e.target.value)
                            }}
                        />
                    </form>
                </div>

                <div ref={panelRef} className="bg-white h-0 opacity-0">
                    <LocationSearchPanel setpanelOpen={setpanelOpen} setvehiclePanelOpen={setvehiclePanelOpen} setconfirmRidePanel={setconfirmRidePanel}/>
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