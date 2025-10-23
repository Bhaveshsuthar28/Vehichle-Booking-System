import { UserInfoForDriver } from "./UserInfoForDriver";

export const RidePopUp = ({setridePopupPanel , setConfirmridePopupPanel}) => {
  return (
    <div className="relative w-full">
      <h3 onClick={() => {setridePopupPanel(true)}} className="text-center text-2xl font-bold text-gray-900 mb-4 relative">
        New Ride Available!
      </h3>

      <div className="flex flex-col gap-5 items-center w-full">
        <UserInfoForDriver />
        <div className="flex w-full gap-4">
          <button onClick={() => {setridePopupPanel(false)}}className="flex-1 bg-gray-200 text-black text-lg font-semibold rounded-2xl py-2.5 
            active:bg-gray-300 transition-all duration-150 shadow-sm">
            Ignore
          </button>

          <button onClick={() => {setConfirmridePopupPanel(true); setridePopupPanel(false)}} className="flex-1 bg-green-600 text-white text-lg font-semibold rounded-2xl py-2.5 
            active:bg-green-700 transition-all duration-150 shadow-md">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};
