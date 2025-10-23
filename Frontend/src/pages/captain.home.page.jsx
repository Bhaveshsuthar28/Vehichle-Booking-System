import { LogOut} from "lucide-react"
import { Link } from "react-router-dom"
import { CaptainInfo } from "../components/Captain.Info.jsx"
import { RidePopUp } from "../components/RidePopUp.jsx"
import { useRef, useState } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ConfirmRidePopup } from "../components/ConfirmridePopup.jsx"

export const CapatainHome = () => {
    const [ridePopupPanel , setridePopupPanel] = useState(false);
    const [ConfirmridePopupPanel , setConfirmridePopupPanel] = useState(false);

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
                <img className="h-full w-full object-cover" src="https://images.prismic.io/superpupertest/75d32275-bd15-4567-a75f-76c4110c6105_1*mleHgMCGD-A1XXa2XvkiWg.png?auto=compress,format&w=1966&h=1068"/>
            </div>

            <div className="h-[40%] p-6">
                <CaptainInfo setridePopupPanel={setridePopupPanel}/>
            </div>

            <div ref={ridepopUpRef} className="fixed bottom-0 z-10 w-full bg-white px-3 py-6 pt-12">
                <RidePopUp setridePopupPanel={setridePopupPanel} setConfirmridePopupPanel={setConfirmridePopupPanel}/>
            </div>

            <div ref={ConfirmRideRef} className="fixed bottom-0 h-screen z-10 w-full bg-white px-3 py-6 pt-12">
                <ConfirmRidePopup setConfirmridePopupPanel={setConfirmridePopupPanel} setridePopupPanel={setridePopupPanel}/>
            </div>
        </div>
    )
}