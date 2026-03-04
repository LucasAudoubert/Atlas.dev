import { useRef } from "react";
import { Menu } from "lucide-react";
import { useAtlasStore } from "./store/useAtlasStore";
import { Sidebar } from "./components/map/sidebar";

const Map = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const { toggleMenu, isMenuOpen } = useAtlasStore();

  // ... (Ton useEffect pour l'initialisation de la carte reste ici)

  return (
    <div className="relative w-full h-screen bg-slate-900 overflow-hidden">
      {/* Le Menu Latéral */}
      <Sidebar />

      {/* Le Bouton Burger (Flottant) */}
      {!isMenuOpen && (
        <button
          onClick={toggleMenu}
          className="absolute top-6 left-6 z-40 p-3 bg-slate-900/80 backdrop-blur-md border border-slate-700 text-white rounded-xl shadow-2xl hover:bg-slate-800 transition-all active:scale-95"
        >
          <Menu size={24} />
        </button>
      )}

      {/* Le conteneur de la carte */}
      <div ref={mapContainer} className="absolute inset-0" />

      {/* Overlay sombre quand le menu est ouvert (optionnel) */}
      {isMenuOpen && (
        <div
          onClick={toggleMenu}
          className="absolute inset-0 bg-black/20 backdrop-blur-[2px] z-30 transition-all"
        />
      )}
    </div>
  );
};

export default Map;
