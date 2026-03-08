import { useRef, useState, useCallback, type MutableRefObject } from "react";
import { motion } from "framer-motion";
import maplibregl from "maplibre-gl";
import { fetchClosestImageId } from "../../lib/mapillaryApi";
import { useAtlasStore } from "../../store/useAtlasStore";

interface Props {
  mapInstance: MutableRefObject<maplibregl.Map | null>;
  /** ref to the map's DOM container for hit-testing */
  mapContainer: MutableRefObject<HTMLDivElement | null>;
}

/** Google-style stick-figure pegman SVG */
const PegmanSVG = ({
  size = 36,
  color = "#34d399",
}: {
  size?: number;
  color?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* head */}
    <circle cx="12" cy="5" r="4" fill={color} />
    {/* body */}
    <line
      x1="12"
      y1="9"
      x2="12"
      y2="22"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    {/* arms */}
    <line
      x1="5"
      y1="14"
      x2="19"
      y2="14"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    {/* left leg */}
    <line
      x1="12"
      y1="22"
      x2="6"
      y2="32"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    {/* right leg */}
    <line
      x1="12"
      y1="22"
      x2="18"
      y2="32"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);

export const PegmanControl = ({ mapInstance, mapContainer }: Props) => {
  const { setStreetViewImageId, streetViewImageId } = useAtlasStore();
  const panelOpen = streetViewImageId !== null;
  const [isDragging, setIsDragging] = useState(false);

  // Floating clone that follows the cursor
  const cloneRef = useRef<HTMLDivElement | null>(null);
  // Drop-indicator ring shown on the map
  const indicatorRef = useRef<HTMLDivElement | null>(null);
  // Whether the cursor is currently over the map
  const overMapRef = useRef(false);

  const createClone = useCallback((x: number, y: number) => {
    const clone = document.createElement("div");
    clone.style.cssText = `
      position: fixed;
      pointer-events: none;
      z-index: 9999;
      left: ${x - 18}px;
      top: ${y - 18}px;
      transition: transform 0.06s ease;
      filter: drop-shadow(0 4px 12px rgba(52,211,153,0.6));
    `;
    clone.innerHTML = `<svg width="36" height="36" viewBox="0 0 24 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="5" r="4" fill="#34d399"/>
      <line x1="12" y1="9" x2="12" y2="22" stroke="#34d399" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="5" y1="14" x2="19" y2="14" stroke="#34d399" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="12" y1="22" x2="6" y2="32" stroke="#34d399" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="12" y1="22" x2="18" y2="32" stroke="#34d399" stroke-width="2.5" stroke-linecap="round"/>
    </svg>`;
    document.body.appendChild(clone);
    cloneRef.current = clone;
  }, []);

  const createIndicator = useCallback(() => {
    const el = document.createElement("div");
    el.style.cssText = `
      position: fixed;
      pointer-events: none;
      z-index: 9998;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 3px solid #34d399;
      background: rgba(52,211,153,0.15);
      transform: translate(-50%, -50%);
      display: none;
      box-shadow: 0 0 0 6px rgba(52,211,153,0.10);
    `;
    document.body.appendChild(el);
    indicatorRef.current = el;
  }, []);

  const removeOverlays = useCallback(() => {
    cloneRef.current?.remove();
    cloneRef.current = null;
    indicatorRef.current?.remove();
    indicatorRef.current = null;
  }, []);

  const isOverMap = useCallback(
    (clientX: number, clientY: number) => {
      const rect = mapContainer.current?.getBoundingClientRect();
      if (!rect) return false;
      return (
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
      );
    },
    [mapContainer],
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      setIsDragging(true);
      createClone(e.clientX, e.clientY);
      createIndicator();
      document.body.style.cursor = "grabbing";
      document.body.style.userSelect = "none";
    },
    [createClone, createIndicator],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging) return;

      // Move flying clone
      if (cloneRef.current) {
        cloneRef.current.style.left = `${e.clientX - 18}px`;
        cloneRef.current.style.top = `${e.clientY - 18}px`;
      }

      // Show/move indicator on map
      const over = isOverMap(e.clientX, e.clientY);
      overMapRef.current = over;
      if (indicatorRef.current) {
        if (over) {
          indicatorRef.current.style.display = "block";
          indicatorRef.current.style.left = `${e.clientX}px`;
          indicatorRef.current.style.top = `${e.clientY}px`;
        } else {
          indicatorRef.current.style.display = "none";
        }
      }
    },
    [isDragging, isOverMap],
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging) return;
      setIsDragging(false);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";

      const over = overMapRef.current;
      removeOverlays();

      if (over && mapInstance.current && mapContainer.current) {
        const rect = mapContainer.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const lngLat = mapInstance.current.unproject([x, y]);

        fetchClosestImageId(lngLat.lng, lngLat.lat).then((id) => {
          setStreetViewImageId(id ?? "__not_found__");
        });
      }
    },
    [
      isDragging,
      mapInstance,
      mapContainer,
      removeOverlays,
      setStreetViewImageId,
    ],
  );

  return (
    <>
      {/* Circular pegman button — sits above MapLibre's native controls (zoom + geolocate ~160px) */}
      <motion.div
        animate={{ bottom: panelOpen ? "calc(45vh + 16px)" : "170px" }}
        transition={{ type: "spring", stiffness: 300, damping: 35 }}
        className="absolute right-[10px] z-[45] select-none"
        style={{ pointerEvents: "auto" }}
      >
        <div
          className={`
            w-[42px] h-[42px] rounded-full
            bg-slate-900/95 backdrop-blur-xl
            border-2 transition-colors duration-150
            ${isDragging ? "border-emerald-400 scale-110" : "border-slate-600 hover:border-emerald-500"}
            shadow-lg flex items-center justify-center
            cursor-grab active:cursor-grabbing
          `}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          title="Glisse-moi sur la carte pour ouvrir Street View"
        >
          <PegmanSVG size={26} />
        </div>

        {/* Tooltip label visible while dragging */}
        {isDragging && (
          <div className="absolute right-[50px] top-1/2 -translate-y-1/2 whitespace-nowrap bg-slate-900/95 border border-slate-700 text-emerald-400 text-[11px] font-mono px-2.5 py-1 rounded-lg shadow-lg pointer-events-none">
            Lâche sur la carte
          </div>
        )}
      </motion.div>
    </>
  );
};
