import { ChevronDown , User2Icon} from 'lucide-react';

export const VehiclePanel = ({setconfirmRidePanel , setvehiclePanelOpen}) => {
    return(
        <>
            <h5 className="p-3 flex justify-center absolute top-0 left-0 right-0 w-full" onClick={() => {setvehiclePanelOpen(false)}}><ChevronDown className="bg-gray-200 p-1 rounded-full cursor-pointer"/></h5>
            <h3 className="text-2xl font-semibold px-2 mb-3">Choose a Vehicle</h3>

            <div onClick={() => {setconfirmRidePanel(true); setvehiclePanelOpen(false);}} className="flex items-center justify-between border-2 active:border-black rounded-2xl px-4 py-4 mb-3">
                <img
                className="h-12 w-auto object-contain"
                src="https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=956/height=538/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy83NjRlZGFmYS00NzJiLTRmZTYtYmY4YS03NGE4OTRhZDNkZWEucG5n"
                alt="car-logo"
                /> 
                <div className="flex-1 ml-4">
                <h4 className="font-semibold text-xl flex items-center gap-2">
                    UberGo 
                    <span className="flex items-center gap-1 text-gray-600 text-base">
                    <User2Icon className="text-black mr-1"/> 4
                    </span>
                </h4>
                <h5 className="text-sm font-medium text-gray-700">2 mins away</h5>
                <p className="text-xs text-gray-900">Affordable, compact rides</p>
                </div>
                <h2 className="text-xl font-bold text-gray-950">$12</h2>
            </div>

            
            <div onClick={() => {setconfirmRidePanel(true); setvehiclePanelOpen(false);}} className="flex items-center justify-between border-2 active:border-black rounded-2xl px-4 py-4 mb-3">
                <img
                className="h-14 w-auto object-contain"
                src="https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=552/height=368/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy8yYzdmYTE5NC1jOTU0LTQ5YjItOWM2ZC1hM2I4NjAxMzcwZjUucG5n"
                alt="bike-logo"
                />
                <div className="flex-1 ml-4">
                <h4 className="font-semibold text-xl flex items-center gap-2">
                    Bike 
                    <span className="flex items-center gap-1 text-gray-600 text-base">
                    <User2Icon className="text-black mr-1"/> 1
                    </span>
                </h4>
                <h5 className="text-sm font-medium text-gray-700">5 mins away</h5>
                <p className="text-xs text-gray-900">Affordable motorcycle ride</p>
                </div>
                <h2 className="text-xl font-bold text-gray-950">$4</h2>
            </div>

            <div onClick={() => {setconfirmRidePanel(true) ; setvehiclePanelOpen(false);}} className="flex items-center justify-between border-2 active:border-black rounded-2xl px-4 py-4 mb-3">
                <img
                className="h-14 w-auto object-contain"
                src="https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=552/height=368/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy8xZGRiOGM1Ni0wMjA0LTRjZTQtODFjZS01NmExMWEwN2ZlOTgucG5n"
                alt="auto-logo"
                />
                <div className="flex-1 ml-4">
                <h4 className="font-semibold text-xl flex items-center gap-2">
                    Tok-Tuk
                    <span className="flex items-center gap-1 text-gray-600 text-base">
                    <User2Icon className="text-black mr-1"/> 3
                    </span>
                </h4>
                <h5 className="text-sm font-medium text-gray-700">7 mins away</h5>
                <p className="text-xs text-gray-900">Affordable auto ride</p>
                </div>
                <h2 className="text-xl font-bold text-gray-950">$9</h2>
            </div>
        </>
    )
}