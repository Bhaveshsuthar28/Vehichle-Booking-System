import { LocateFixed, Pin, Wallet } from "lucide-react";

export const UserInfoForDriver = ({ride}) => {

  const UserName = ride?.user?.fullname ? `${ride.user.fullname.firstname} ${ride.user.fullname.lastname}`.trim() : "Rider";

  const pickup = ride?.pickup ?? "Pickup";
  const destination = ride?.destination ?? "Destination";
  const fare = ride?.fare ?? "--";


  const splitAddress = (address) => {
    const parts = (address ?? '').split(',').map((part) => part.trim()).filter(Boolean);
    const heading = parts.shift() ?? '';
    const details = parts.length ? parts.join(', ') : '';
    return { heading, details };
  }

  const PickupPart = splitAddress(pickup);
  const DestinationPart = splitAddress(destination);

  return (
    <div className="flex flex-col gap-5 p-4 w-full">
      <div className="flex items-center justify-between w-full border-2 border-yellow-600 px-4 py-3 rounded-xl ">
        <div className="flex items-center gap-3">
          <img
            className="h-12 w-12 rounded-full object-cover"
            src="https://market-resized.envatousercontent.com/photodune.net/EVA/TRX/b4/06/80/53/a4/v1_E11/E1139EUA.jpeg?auto=format&q=94&mark=https%3A%2F%2Fassets.market-storefront.envato-static.com%2Fwatermarks%2Fphoto-260724.png&opacity=0.2&cf_fit=contain&w=590&h=884&s=ade8cb2e5494eaec7be4aec07992678588d92aac7b5fa40a4c5398593972fa6a"
            alt="captain"
          />
          <h4 className="text-lg font-semibold text-gray-900">{UserName}</h4>
        </div>

        
        <div className="text-right">
            <h4 className="text-xl font-bold text-gray-900">2.2 KM</h4>
        </div>
      </div>

      <div className="flex flex-col divide-y divide-gray-200 w-full">
        <div className="flex items-start gap-3 pb-3">
          <Pin className="h-6 w-6 flex-shrink-0 mt-1" />
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold">{PickupPart.heading || 'Pickup'}</h3>
            {!!PickupPart.details && (
                <p className="text-sm text-gray-600">{PickupPart.details}</p>
            )}
          </div>
        </div>

        <div className="flex items-start gap-3 pt-3">
          <LocateFixed className="h-6 w-6 flex-shrink-0 mt-1" />
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold">{DestinationPart.heading || 'Destination'}</h3>
            {!!DestinationPart.details && (
                <p className="text-sm text-gray-600">{DestinationPart.details}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-start gap-3 pt-3">
          <Wallet className="h-6 w-6 flex-shrink-0 mt-1" />
          <div className="flex flex-col">
            <h3 className="text-base font-semibold text-gray-900">
              {fare}
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
