import { useEffect } from "react";
import { Sidebar } from "../components/map/sidebar";
import { MapView } from "../components/map/MapView";
import { MapControls } from "../components/map/MapControls";
import { PinCreationOverlay } from "../components/map/PinCreationOverlay";
import { useMapLogic } from "../hooks/useMapLogic";
import { useAuth } from "../hooks/useAuth";
import { useAtlasStore } from "../store/useAtlasStore";
import { getUserPins } from "../api/pin";
import "../style/map.css";

const MapPage = () => {
  const { mapContainer, loading } = useMapLogic();
  const { user } = useAuth();
  const { hydrateRemotePins } = useAtlasStore();

  // Hydrate Supabase pins when the user logs in
  useEffect(() => {
    if (user) {
      getUserPins().then(hydrateRemotePins);
    }
  }, [user]);

  return (
    <div className="relative w-full h-screen bg-slate-900 overflow-hidden">
      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-[#1a1c24]">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-slate-800" />
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-emerald-400 animate-spin" />
          </div>
          <p className="mt-10 text-base text-slate-300 tracking-wide font-medium">
            Chargement de la carte<span className="animate-pulse">...</span>
          </p>
        </div>
      )}

      <Sidebar />
      <MapControls />
      <MapView mapContainer={mapContainer} />
      <PinCreationOverlay />
    </div>
  );
};

export default MapPage;
