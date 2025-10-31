import {LocateFixed , MapPin } from "lucide-react";

export const LocationSearchPanel = (props) => {
  const suggestions = Array.isArray(props.suggestions) ? props.suggestions : [];

  const handleSelect = (item) => {
    const label = typeof item === 'string' ? item : item?.name;

    if (!label) return;

    if (props.activeField === "pickup") {
      props.setpick?.(label);
    } else if (props.activeField === "destination") {
      props.setdestination?.(label);
    }

    props.setpanelOpen?.(false);
    if (props.activeField === "destination") {
      props.setvehiclePanelOpen?.(true);
    }
  };

  return (
    <div className="space-y-3">
      {suggestions.length > 0 &&
        suggestions.map((element, index) => (
          <button
            key={element?.place_id ?? index}
            onClick={() => handleSelect(element)}
            className="flex w-full items-center justify-start gap-x-2 my-4 border-2 active:border-gray-400 px-4 py-2 rounded-lg border-gray-50 text-left"
          >
            <span className="bg-[#eee] h-8 w-16 rounded-full flex items-center justify-center">
              <MapPin />
            </span>
            <span className="text-base font-medium">
              {typeof element === "string" ? element : element?.name ?? "Unknown location"}
            </span>
          </button>
        ))}
    </div>
  );
};
