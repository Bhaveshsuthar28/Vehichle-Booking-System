import { MapPin } from "lucide-react";

export const LocationSearchPanel = (props) => {
  const locations = [
    "24B , Near Kapoor's cafe, Sheryians Coding School, Bhopal",
    "23B , Near Kapoor's cafe, Sheryians Coding School, Bhopal",
    "22B , Near Kapoor's cafe, Sheryians Coding School, Bhopal",
    "21B , Near Kapoor's cafe, Sheryians Coding School, Bhopal",
  ];

  return (
    <div>
      {locations.map((element , index) => (
        <div
          key={index}
          onClick={() => {
            props.setvehiclePanelOpen(true)
            props.setpanelOpen(false)
          }}
          className="flex items-center justify-start gap-x-2 my-4 border-2 active:border-gray-400 px-4 py-2 rounded-lg border-gray-50"
        >
          <h2 className="bg-[#eee] h-8 w-16 rounded-full flex items-center justify-center">
            <MapPin />
          </h2>
          <h4 className="text-base font-medium">{element}</h4>
        </div>
      ))}
    </div>
  );
};
