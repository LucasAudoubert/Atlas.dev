import { useRef, useEffect, useState } from "react";
import { Menu } from "lucide-react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useAtlasStore } from "./store/useAtlasStore";
import { Sidebar } from "./components/map/sidebar";
import "./style/map.css";

const Map = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<maplibregl.Map | null>(null);
  const [loading, setLoading] = useState(true);
  const { toggleMenu, isMenuOpen, viewState, setViewState, isDarkMap, setMapReady } = useAtlasStore();

  const DARK_STYLE = "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";
  const LIGHT_STYLE = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

  useEffect(() => {
    if (!mapContainer.current || mapInstance.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: isDarkMap ? DARK_STYLE : LIGHT_STYLE,
      center: [viewState.lng, viewState.lat],
      zoom: viewState.zoom,
    });

    map.addControl(new maplibregl.NavigationControl(), "bottom-right");
    map.addControl(
      new maplibregl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
      }),
      "bottom-right"
    );

    map.on("moveend", () => {
      const center = map.getCenter();
      setViewState(center.lng, center.lat, map.getZoom());
    });

    map.on("load", () => {
      setLoading(false);
      setMapReady(true);
    });

    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
      setMapReady(false);
    };
  }, []);

  // Changer le style de la carte quand le thème change
  useEffect(() => {
    if (mapInstance.current) {
      mapInstance.current.setStyle(isDarkMap ? DARK_STYLE : LIGHT_STYLE);
    }
  }, [isDarkMap]);

  // Resize la carte quand le sidebar s'ouvre/ferme
  useEffect(() => {
    if (mapInstance.current) {
      setTimeout(() => mapInstance.current?.resize(), 500);
    }
  }, [isMenuOpen]);

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
      <div
        ref={mapContainer}
        className={`absolute inset-0 transition-all duration-500 ease-in-out ${
          isMenuOpen ? 'left-72' : 'left-0'
        }`}
      />

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
