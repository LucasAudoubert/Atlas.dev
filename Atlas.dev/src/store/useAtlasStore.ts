import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type Pin } from "../schemas/pin";
import { DEFAULT_MAP_STYLE } from "../schemas/mapLayer";

// Re-export Pin so imports from the store continue to work
export type { Pin };

// ─── Types ────────────────────────────────────────────────────────────────────

interface AtlasState {
  viewState: { lng: number; lat: number; zoom: number };
  selectedSpotId: string | null;
  isMenuOpen: boolean;
  mapStyleUrl: string;
  isMapReady: boolean;
  /** Temporary coords while the user fills the pin creation form. */
  pendingPin: { lng: number; lat: number } | null;
  pins: Pin[];
  /** When true, map clicks open Street View instead of the pin form. */
  streetViewMode: boolean;
  /** The currently displayed Mapillary image ID, null when panel is closed. */
  streetViewImageId: string | null;

  setViewState: (lng: number, lat: number, zoom: number) => void;
  setSelectedSpot: (id: string | null) => void;
  toggleMenu: () => void;
  setMapStyle: (url: string) => void;
  setMapReady: (ready: boolean) => void;
  setPendingPin: (coords: { lng: number; lat: number } | null) => void;
  addPin: (pin: Pin) => void;
  removePin: (id: string) => void;
  /** Merges remote Supabase pins without duplicating local ones. */
  hydrateRemotePins: (remotePins: Pin[]) => void;
  toggleStreetViewMode: () => void;
  setStreetViewImageId: (id: string | null) => void;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useAtlasStore = create<AtlasState>()(
  persist(
    (set, get) => ({
      viewState: { lng: 2.3522, lat: 48.8566, zoom: 12 },
      selectedSpotId: null,
      isMenuOpen: false,
      mapStyleUrl: DEFAULT_MAP_STYLE,
      isMapReady: false,
      pendingPin: null,
      pins: [],
      streetViewMode: false,
      streetViewImageId: null,

      setViewState: (lng, lat, zoom) => set({ viewState: { lng, lat, zoom } }),
      setSelectedSpot: (id) => set({ selectedSpotId: id }),
      toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
      setMapStyle: (url) => set({ mapStyleUrl: url }),
      setMapReady: (ready) => set({ isMapReady: ready }),
      setPendingPin: (coords) => set({ pendingPin: coords }),

      addPin: (pin) => {
        if (get().pins.some((p) => p.id === pin.id)) return;
        set((state) => ({ pins: [...state.pins, pin] }));
      },

      removePin: (id) =>
        set((state) => ({ pins: state.pins.filter((p) => p.id !== id) })),

      hydrateRemotePins: (remotePins) => {
        const localIds = new Set(get().pins.map((p) => p.id));
        const newRemote = remotePins.filter((p) => !localIds.has(p.id));
        if (newRemote.length > 0)
          set((state) => ({ pins: [...state.pins, ...newRemote] }));
      },

      toggleStreetViewMode: () =>
        set((state) => ({
          streetViewMode: !state.streetViewMode,
          // closing mode also closes the panel
          streetViewImageId: state.streetViewMode
            ? null
            : state.streetViewImageId,
        })),

      setStreetViewImageId: (id) => set({ streetViewImageId: id }),
    }),
    {
      name: "atlas-pins",
      // Only persist pins — all other state is transient
      partialize: (state) => ({ pins: state.pins }),
    },
  ),
);
