import { useRef, useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useAtlasStore } from "../store/useAtlasStore";
import { pinColorToFilter } from "../schemas/pin";

const DARK_STYLE =
  "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";
const LIGHT_STYLE =
  "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

export const useMapLogic = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<maplibregl.Map | null>(null);
  const markers = useRef<Record<string, maplibregl.Marker>>({});
  const [loading, setLoading] = useState(true);

  const {
    viewState,
    setViewState,
    isDarkMap,
    isMenuOpen,
    setMapReady,
    pins,
    selectedSpotId,
    setSelectedSpot,
    setPendingPin,
  } = useAtlasStore();

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
      map.resize();
      setTimeout(() => map.resize(), 100);
      setTimeout(() => map.resize(), 500);
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

    map.on("click", (e) => {
      setPendingPin({ lng: e.lngLat.lng, lat: e.lngLat.lat });
    });

    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
      setMapReady(false);
    };
  }, []);

  useEffect(() => {
    if (mapInstance.current) {
      mapInstance.current.setStyle(isDarkMap ? DARK_STYLE : LIGHT_STYLE);
    }
  }, [isDarkMap]);

  useEffect(() => {
    if (mapInstance.current) {
      setTimeout(() => mapInstance.current?.resize(), 500);
    }
  }, [isMenuOpen]);

  useEffect(() => {
    if (!mapInstance.current) return;
    const map = mapInstance.current;

    pins.forEach((pin) => {
      if (!markers.current[pin.id]) {
        const el = document.createElement("img");
        el.src = "/map/pin.png";
        el.style.width = "36px";
        el.style.height = "36px";
        el.style.cursor = "pointer";
        el.style.filter = pinColorToFilter(pin.color ?? "#10b981");

        const popup = new maplibregl.Popup({ offset: 30 }).setHTML(
          `<div style="font-family:monospace;padding:4px 2px">
            <strong>${pin.name}</strong>
            ${pin.description ? `<p style="margin:4px 0 0;font-size:12px;opacity:.8">${pin.description}</p>` : ""}
          </div>`,
        );

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([pin.lng, pin.lat])
          .setPopup(popup)
          .addTo(map);

        el.addEventListener("click", () => {
          setSelectedSpot(pin.id);
        });

        markers.current[pin.id] = marker;
      }
    });

    Object.keys(markers.current).forEach((id) => {
      const exists = pins.find((p) => p.id === id);
      if (!exists) {
        markers.current[id].remove();
        delete markers.current[id];
      }
    });
  }, [pins]);

  useEffect(() => {
    if (!mapInstance.current || !selectedSpotId) return;

    const pin = pins.find((p) => p.id === selectedSpotId);
    if (!pin) return;

    mapInstance.current.flyTo({
      center: [pin.lng, pin.lat],
      zoom: 15,
      duration: 800,
    });

    const marker = markers.current[selectedSpotId];
    marker?.togglePopup();
  }, [selectedSpotId]);

  return { mapContainer, mapInstance, loading };
};
