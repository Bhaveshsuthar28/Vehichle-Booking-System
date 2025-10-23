import { LocateFixed, Pin, Wallet } from "lucide-react";

export const UserInfoForDriver = () => {
  return (
    <div className="flex flex-col gap-5 p-4 w-full">
      <div className="flex items-center justify-between w-full border-2 border-yellow-600 px-4 py-3 rounded-xl ">
        <div className="flex items-center gap-3">
          <img
            className="h-12 w-12 rounded-full object-cover"
            src="https://market-resized.envatousercontent.com/photodune.net/EVA/TRX/b4/06/80/53/a4/v1_E11/E1139EUA.jpeg?auto=format&q=94&mark=https%3A%2F%2Fassets.market-storefront.envato-static.com%2Fwatermarks%2Fphoto-260724.png&opacity=0.2&cf_fit=contain&w=590&h=884&s=ade8cb2e5494eaec7be4aec07992678588d92aac7b5fa40a4c5398593972fa6a"
            alt="captain"
          />
          <h4 className="text-lg font-semibold text-gray-900">Bhavesh</h4>
        </div>

        
        <div className="text-right">
            <h4 className="text-xl font-bold text-gray-900">2.2KM</h4>
        </div>
      </div>

      <div className="flex flex-col divide-y divide-gray-200 w-full">
        <div className="flex items-start gap-3 pb-3">
          <Pin className="h-6 w-6 flex-shrink-0 mt-1" />
          <div className="flex flex-col">
            <h3 className="text-base font-semibold text-gray-900">562/11-A</h3>
            <p className="text-sm text-gray-600">
              Kaikondrahalli, Bengaluru, Karnataka
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 pt-3">
          <LocateFixed className="h-6 w-6 flex-shrink-0 mt-1" />
          <div className="flex flex-col">
            <h3 className="text-base font-semibold text-gray-900">
              Third Wave Coffee
            </h3>
            <p className="text-sm text-gray-600">
              17th Cross Rd, PWD Quarters, 1st Sector,
            </p>
            <p className="text-sm text-gray-600">
              HSR Layout, Bengaluru, Karnataka
            </p>
          </div>
        </div>
        
        <div className="flex items-start gap-3 pt-3">
          <Wallet className="h-6 w-6 flex-shrink-0 mt-1" />
          <div className="flex flex-col">
            <h3 className="text-base font-semibold text-gray-900">
              29$
            </h3>
            <p className="text-sm text-gray-600">
              Cash
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
