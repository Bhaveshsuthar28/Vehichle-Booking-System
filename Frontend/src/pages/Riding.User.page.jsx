import { LocateFixed, Home , Wallet , Star} from "lucide-react"
import {Link} from "react-router-dom"


export const RidingLive = () => {
    return(
        <div className="h-screen">
            <Link to='/home' className="fixed h-10 w-10 flex items-center justify-center rounded-full top-2 left-2 
                bg-white/10 backdrop-blur-md border border-blue-900 shadow-lg active:bg-blue-900 transition duration-100">
                <Home className="text-blue-700 active:text-white duration-100"/>
            </Link>

            <div className="h-[40%]">
                <img className="h-full w-full object-cover" src="https://images.prismic.io/superpupertest/75d32275-bd15-4567-a75f-76c4110c6105_1*mleHgMCGD-A1XXa2XvkiWg.png?auto=compress,format&w=1966&h=1068"/>
            </div>

            <div className="h-[60%] p-4">
                <div className="flex items-center justify-between">
                    <img  className="h-12" alt="car" src="https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=956/height=538/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy83NjRlZGFmYS00NzJiLTRmZTYtYmY4YS03NGE4OTRhZDNkZWEucG5n"/>
                    <div className="text-right">
                        <h2 className="text-lg font-medium ">Bhavesh</h2>
                        <h4 className="text-2xl font-semibold pb-1">RJ04 AB 1234</h4>
                        <p className="text-sm text-gray-600">White Suzuki S-Presso LXI</p>
                        <p className="flex gap-x-2 font-meduim"><Star/>4.9</p>
                    </div>
                </div>

                <div className="flex gap-2 justify-between flex-col items-center mt-5">
                    <div className="w-full">
                        <div className="flex items-center gap-3 border-t-2">
                            <LocateFixed className="h-6 w-6"/>
                            <div className="flex flex-col m-2">
                                <h3 className="text-lg font-semibold">Third Wave Coffee</h3>
                                <p className="text-sm text-gray-600">17th Cross Rd, PWD Quarters, 1st Sector,</p>
                                <p className="text-sm text-gray-600">HSR Layout, Bengaluru, Karnataka</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 border-t-2 mb-5">
                            <Wallet className="h-6 w-6"/>
                            <div className="flex flex-col m-2">
                                <h3 className="text-lg font-semibold">$19</h3>
                                <p className="text-sm text-gray-600">Cash</p>
                            </div>
                        </div>
                    </div>
                </div> 
                <button className="w-[50%] bg-green-600 font-semibold text-lg rounded-2xl p-2 text-white mb-2 absolute right-[25%] bottom-1">Pay </button>
            </div>
        </div>
    )
}