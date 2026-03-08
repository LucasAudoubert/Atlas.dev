import { useRef, useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useAtlasStore } from "../store/useAtlasStore";
import { pinColorToFilter } from "../schemas/pin";
import { fetchClosestImageId } from "../lib/mapillaryApi";

export const useMapLogic = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<maplibregl.Map | null>(null);
  const markers = useRef<Record<string, maplibregl.Marker>>({});
  const [loading, setLoading] = useState(true);

  const {
    viewState,
    setViewState,
    mapStyleUrl,
    isMenuOpen,
    setMapReady,
    pins,
    selectedSpotId,
    setSelectedSpot,
    setPendingPin,
    streetViewMode,
    streetViewImageId,
    setStreetViewImageId,
  } = useAtlasStore();

  // Ref so the map click handler always sees the latest value
  const streetViewModeRef = useRef(streetViewMode);
  useEffect(() => {
    streetViewModeRef.current = streetViewMode;
  }, [streetViewMode]);

  useEffect(() => {
    if (!mapContainer.current || mapInstance.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: mapStyleUrl,
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
      if (streetViewModeRef.current) {
        fetchClosestImageId(e.lngLat.lng, e.lngLat.lat).then((id) => {
          // Always open the panel — show error inside if no image found
          setStreetViewImageId(id ?? "__not_found__");
        });
      } else {
        setPendingPin({ lng: e.lngLat.lng, lat: e.lngLat.lat });
      }
    });

    // Update cursor to crosshair when in street-view mode
    map.getCanvas().style.cursor = "";

    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
      setMapReady(false);
    };
  }, []);

  useEffect(() => {
    if (mapInstance.current) {
      mapInstance.current.setStyle(mapStyleUrl);
    }
  }, [mapStyleUrl]);

  useEffect(() => {
    if (mapInstance.current) {
      setTimeout(() => mapInstance.current?.resize(), 500);
    }
  }, [isMenuOpen]);

  // Resize map when Street View panel opens / closes
  useEffect(() => {
    if (mapInstance.current) {
      setTimeout(() => mapInstance.current?.resize(), 350);
    }
  }, [streetViewImageId]);

  // Update cursor style when street view mode toggles
  useEffect(() => {
    if (mapInstance.current) {
      mapInstance.current.getCanvas().style.cursor = streetViewMode
        ? "crosshair"
        : "";
    }
  }, [streetViewMode]);

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
