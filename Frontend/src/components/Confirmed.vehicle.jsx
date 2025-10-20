import { ChevronDown , LocateFixed , Pin, Wallet} from "lucide-react"

export const ConfirmedVehicle = ({setvehiclePanelOpen , setlookingPanelOpen}) => {
    return(
        <div className="">
            <h5 className="flex justify-center p-1 text-center w-[93%] absolute top-2" onClick={() => {
                setvehiclePanelOpen(false)
            }}>
                <ChevronDown className="bg-gray-200 rounded-full active:bg-green-400"/>
            </h5>
            <h3 className="text-2xl font-semibold mb-5">Confirm your ride</h3>
            
            <div className="flex gap-2 justify-between flex-col items-center">
                <img  className="h-16" alt="car" src="https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=956/height=538/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy83NjRlZGFmYS00NzJiLTRmZTYtYmY4YS03NGE4OTRhZDNkZWEucG5n"/>
                <div className="w-full">
                    <div className="flex items-center gap-3">
                        <Pin className="h-6 w-6"/>
                        <div className="flex flex-col m-2">
                            <h3 className="text-lg font-semibold">562/11-A</h3>
                            <p className="text-sm text-gray-600">Kaikondrahalli, Bengaluru, Karnataka</p>
                        </div>
                    </div>
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
                <button onClick={() => {setlookingPanelOpen(true) ; setvehiclePanelOpen(false)}} className="w-[50%] bg-green-600 font-semibold text-lg rounded-2xl p-2 text-white mb-2">Confirm</button>
            </div>   
        </div>
    )
}