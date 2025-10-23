import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {ChevronDown, Home } from "lucide-react"
import { useRef, useState } from "react";
import { Link } from "react-router-dom"
import { FinishRide } from "../components/FinishRide.Components";

export const CaptainRiding = () => {

    const [finishRidingPanel , setfinishRidingPanel] = useState(false);
    const FinishRideRef = useRef(null)

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
                <img className="h-full w-full object-cover" src="https://images.prismic.io/superpupertest/75d32275-bd15-4567-a75f-76c4110c6105_1*mleHgMCGD-A1XXa2XvkiWg.png?auto=compress,format&w=1966&h=1068"/>
            </div>

            <div onClick={() => {setfinishRidingPanel(true)}} className="h-1/5 p-6 bg-yellow-400 flex flex-col justify-center items-center gap-4">
                <ChevronDown className="text-black h-8 w-8 relative -top-3" />
                <div className="flex items-center justify-center gap-6 relative -top-2">
                    <h4 className="text-xl font-semibold">4 KM away</h4>
                    <button className="bg-green-600 text-white font-semibold py-2 px-8 rounded-lg">
                        Complete Ride
                    </button>
                </div>
            </div>

            <div ref={FinishRideRef} className="fixed bottom-0 z-10 w-full bg-white px-3 py-6 pt-12">
                <FinishRide setfinishRidingPanel={setfinishRidingPanel}/>
            </div>
        </div>
    )
}