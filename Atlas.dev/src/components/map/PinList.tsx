import { useAtlasStore } from "../../store/useAtlasStore";
import { Trash2 } from "lucide-react";

export const PinList = () => {
  const { pins, removePin, setViewState, selectedSpotId, setSelectedSpot } =
    useAtlasStore();

  return (
    <div className="mt-4 px-4 space-y-2">
      {pins.map((pin) => (
        <div
          key={pin.id}
          className={`flex items-center justify-between p-2 rounded-lg cursor-pointer ${
            selectedSpotId === pin.id
              ? "bg-emerald-500 text-black"
              : "bg-slate-800 text-white"
          }`}
        >
          <button
            onClick={() => {
              setSelectedSpot(pin.id);
              setViewState(pin.lng, pin.lat, 15);
            }}
            className="flex-1 text-left"
          >
            {pin.name}
          </button>

          <button
            onClick={() => removePin(pin.id)}
            className="ml-2 text-red-400 hover:text-red-300"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};