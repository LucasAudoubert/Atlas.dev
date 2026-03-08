import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader, AlertTriangle } from "lucide-react";
import { Viewer } from "mapillary-js";
import "mapillary-js/dist/mapillary.css";
import { useAtlasStore } from "../../store/useAtlasStore";

const FONT = "font-['Source_Code_Pro',monospace]";

type Status = "idle" | "loading" | "ready" | "error";

export const StreetView = () => {
  const { streetViewImageId, setStreetViewImageId, toggleStreetViewMode } =
    useAtlasStore();

  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Viewer | null>(null);
  const [status, setStatus] = useState<Status>("idle");

  const isOpen = streetViewImageId !== null;

  const handleClose = () => {
    setStreetViewImageId(null);
  };

  // ── Initialize or move viewer when imageId changes ────────────────────────
  useEffect(() => {
    if (!streetViewImageId || !containerRef.current) return;

    // Sentinel: API found no nearby image
    if (streetViewImageId === "__not_found__") {
      setStatus("error");
      return;
    }

    const token = import.meta.env.VITE_MAPILLARY_ACCESS_TOKEN as
      | string
      | undefined;
    if (!token || token === "your_token_here") {
      setStatus("error");
      return;
    }

    setStatus("loading");

    if (!viewerRef.current) {
      // First time: create viewer
      try {
        const viewer = new Viewer({
          accessToken: token,
          container: containerRef.current,
          imageId: streetViewImageId,
          component: {
            cover: false,
            // zoom: false, // optional - disable zoom UI
          },
        });

        viewer.on("load" as any, () => setStatus("ready"));
        viewer.on("dataloading" as any, () => setStatus("loading"));
        viewer.on("image" as any, () => setStatus("ready"));

        viewerRef.current = viewer;
      } catch (e) {
        console.error("[StreetView] Viewer init failed:", e);
        setStatus("error");
      }
    } else {
      // Subsequent: just navigate
      viewerRef.current
        .moveTo(streetViewImageId)
        .then(() => setStatus("ready"))
        .catch(() => setStatus("error"));
    }
  }, [streetViewImageId]);

  // ── Destroy viewer when panel is closed ───────────────────────────────────
  useEffect(() => {
    if (!isOpen && viewerRef.current) {
      viewerRef.current.remove();
      viewerRef.current = null;
      setStatus("idle");
    }
  }, [isOpen]);

  const tokenMissing =
    !import.meta.env.VITE_MAPILLARY_ACCESS_TOKEN ||
    import.meta.env.VITE_MAPILLARY_ACCESS_TOKEN === "your_token_here";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="streetview"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 35 }}
          className="absolute bottom-0 left-0 right-0 z-[40] flex flex-col"
          style={{ height: "45vh" }}
        >
          {/* ── Header bar ─────────────────────────────── */}
          <div
            className={`flex items-center justify-between px-4 py-2.5 bg-slate-900/95 backdrop-blur-xl border-t border-slate-700 flex-shrink-0 ${FONT}`}
          >
            <div className="flex items-center gap-2 text-emerald-400">
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
              <span className="text-xs font-semibold uppercase tracking-wider">
                Street View
              </span>
              {status === "loading" && (
                <Loader size={12} className="animate-spin text-slate-400" />
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Toggle Street View mode off */}
              <button
                onClick={toggleStreetViewMode}
                className="text-xs text-slate-500 hover:text-white transition-colors px-2 py-1 rounded-lg hover:bg-slate-800"
              >
                Désactiver le mode
              </button>
              <button
                onClick={handleClose}
                className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* ── Viewer container ───────────────────────── */}
          <div className="relative flex-1 bg-slate-950 overflow-hidden">
            {/* Status overlays */}
            {status === "loading" && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-950">
                <div className="flex flex-col items-center gap-3 text-slate-400">
                  <Loader size={28} className="animate-spin text-emerald-400" />
                  <p className={`text-xs ${FONT}`}>Chargement du panorama…</p>
                </div>
              </div>
            )}
            {status === "error" && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-950">
                <div className="flex flex-col items-center gap-3 text-slate-400 max-w-xs text-center px-6">
                  <AlertTriangle size={28} className="text-amber-400" />
                  {tokenMissing ? (
                    <>
                      <p className={`text-sm font-semibold text-white ${FONT}`}>
                        Token Mapillary manquant
                      </p>
                      <p className={`text-xs ${FONT}`}>
                        Crée un compte sur{" "}
                        <a
                          href="https://www.mapillary.com/dashboard/developers"
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-400 underline"
                        >
                          mapillary.com
                        </a>{" "}
                        et ajoute{" "}
                        <code className="text-emerald-300">
                          VITE_MAPILLARY_ACCESS_TOKEN
                        </code>{" "}
                        dans <code>.env.local</code>.
                      </p>
                    </>
                  ) : (
                    <>
                      <p className={`text-sm font-semibold text-white ${FONT}`}>
                        Aucune image disponible ici
                      </p>
                      <p className={`text-xs ${FONT}`}>
                        Clique ailleurs sur la carte pour chercher un panorama
                        disponible.
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* The actual Mapillary viewer mounts here */}
            <div ref={containerRef} className="w-full h-full" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
