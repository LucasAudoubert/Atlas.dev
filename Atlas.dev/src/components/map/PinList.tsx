import { useAtlasStore } from "../../store/useAtlasStore";
import { useAuth } from "../../hooks/useAuth";
import { deletePinRemote } from "../../api/pin";
import { Trash2, MapPin } from "lucide-react";

export const PinList = () => {
  const { pins, removePin, setSelectedSpot } = useAtlasStore();
  const { user } = useAuth();

  const handleDelete = async (id: string) => {
    removePin(id);
    if (user) {
      await deletePinRemote(id);
    }
  };

  if (pins.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-6 text-slate-600">
        <MapPin size={22} />
        <p className="text-xs text-center">
          Aucun pin.
          <br />
          Clique sur la carte pour en ajouter.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      {pins.map((pin) => (
        <div
          key={pin.id}
          className={`flex items-center gap-2 px-2.5 py-2 rounded-xl cursor-pointer group transition-colors ${
            useAtlasStore.getState().selectedSpotId === pin.id
              ? "bg-emerald-500/20 border border-emerald-500/40"
              : "hover:bg-slate-800 border border-transparent"
          }`}
        >
          {/* Color dot */}
          <span
            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: pin.color ?? "#10b981" }}
          />

          {/* Name + description */}
          <button
            onClick={() => setSelectedSpot(pin.id)}
            className="flex-1 text-left min-w-0"
          >
            <p className="text-sm text-white truncate leading-tight">
              {pin.name}
            </p>
            {pin.description && (
              <p className="text-[11px] text-slate-500 truncate mt-0.5">
                {pin.description}
              </p>
            )}
          </button>

          {/* Delete */}
          <button
            onClick={() => handleDelete(pin.id)}
            className="flex-shrink-0 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};
