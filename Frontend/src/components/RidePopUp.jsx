import { UserInfoForDriver } from "./UserInfoForDriver";

export const RidePopUp = () => {
  return (
    <div className="relative w-full">
      <h3 className="text-center text-2xl font-bold text-gray-900 mb-4 relative -top-2">
        New Ride Available!
      </h3>

      <div className="flex flex-col gap-5 items-center w-full">
        <UserInfoForDriver />
        <div className="flex w-full gap-4">
          <button className="flex-1 bg-gray-200 text-black text-lg font-semibold rounded-2xl py-2.5 
            active:bg-gray-300 transition-all duration-150 shadow-sm">
            Ignore
          </button>

          <button className="flex-1 bg-green-600 text-white text-lg font-semibold rounded-2xl py-2.5 
            active:bg-green-700 transition-all duration-150 shadow-md">
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};
