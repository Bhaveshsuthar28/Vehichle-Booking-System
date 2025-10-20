import { ChevronDown  ,LocateFixed,Pin, Star, Wallet} from "lucide-react"

export const WaitingForDRiver = ({setwaitingDriverPanel}) => {
    return(
        <div className="">
            
            <h5 className="flex justify-center p-1 text-center w-[93%] absolute top-2" onClick={() => {
                setwaitingDriverPanel(false)
            }}>
                <ChevronDown className="bg-gray-200 rounded-full active:bg-green-400"/>
            </h5>

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
            </div>  
        </div>
    )
}