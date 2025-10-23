
export const CaptainInfo = ({setridePopupPanel}) => {
    return(
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                    <img className="h-10 w-10 rounded-full object-cover" src="https://images.rawpixel.com/image_png_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDI0LTA5L3Jhd3BpeGVsX29mZmljZV8zMF9waG90b19vZl9tYW5faW5kaWFuX2FybXNfY3Jvc3NlZF9zZWxmLWNvbmZpZF8wMDgwMDBlNS00YjdiLTQ1N2UtYjA3Mi02NGMwOGIwMWQ2ZmEucG5n.png" alt="captain"/>
                    <h4 className="text-lg font-medium">Harsh Patel</h4>
                </div>
                <div className="text-right">
                    <h4 className="text-xl font-semibold">$295.59</h4>
                    <p className="text-sm text-gray-600">Earned</p>
                </div>
            </div>

            <div onClick={() => { setridePopupPanel(true)}} className="flex justify-between gap-5 items-start bg-gray-200 p-5 text-black border-2 border-green-600 rounded-3xl">
                <div className="text-center flex-1">
                    <i className="text-2xl ri-timer-2-line"></i>
                    <h5 className="text-lg font-medium">10.2</h5>
                    <p className="text-sm">Hours Online</p>
                </div>
                <div className="text-center flex-1">
                    <i className="text-2xl ri-speed-up-line"></i>
                    <h5 className="text-lg font-medium">55</h5>
                    <p className="text-sm">Avg. Speed</p>
                </div>
                <div className="text-center flex-1">
                    <i className="text-2xl ri-booklet-line"></i>
                    <h5 className="text-lg font-medium">15</h5>
                    <p className="text-sm">Trips</p>
                </div>
            </div>
        </div>
    )
}