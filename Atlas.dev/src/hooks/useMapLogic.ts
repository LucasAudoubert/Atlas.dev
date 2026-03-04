import { useRef, useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useAtlasStore } from "../store/useAtlasStore";

const DARK_STYLE =
  "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";
const LIGHT_STYLE =
  "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

export const useMapLogic = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<maplibregl.Map | null>(null);
  const [loading, setLoading] = useState(true);

  const { viewState, setViewState, isDarkMap, isMenuOpen, setMapReady } =
    useAtlasStore();

  // Initialisation de la carte
  useEffect(() => {
    if (!mapContainer.current || mapInstance.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: isDarkMap ? DARK_STYLE : LIGHT_STYLE,
      center: [viewState.lng, viewState.lat],
      zoom: viewState.zoom,
    });

    map.on("load", () => {
      setLoading(false);
      setMapReady(true);
      setTimeout(() => map.resize(), 0);
    });

    map.addControl(new maplibregl.NavigationControl(), "bottom-right");
    map.addControl(
      new maplibregl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
      }),
      "bottom-right",
    );

    map.on("moveend", () => {
      const center = map.getCenter();
      setViewState(center.lng, center.lat, map.getZoom());
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

  return { mapContainer, mapInstance, loading };
};
