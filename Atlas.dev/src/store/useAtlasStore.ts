import { create } from "zustand";

interface AtlasState {
  viewState: { lng: number; lat: number; zoom: number };
  selectedSpotId: string | null;
  isMenuOpen: boolean;
  isDarkMap: boolean;
  setViewState: (lng: number, lat: number, zoom: number) => void;
  setSelectedSpot: (id: string | null) => void;
  toggleMenu: () => void;
  toggleMapTheme: () => void;
}

export const useAtlasStore = create<AtlasState>((set) => ({
  viewState: { lng: 2.3522, lat: 48.8566, zoom: 12 },
  selectedSpotId: null,
  isMenuOpen: false,
  isDarkMap: true,
  setViewState: (lng, lat, zoom) => set({ viewState: { lng, lat, zoom } }),
  setSelectedSpot: (id) => set({ selectedSpotId: id }),
  toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
  toggleMapTheme: () => set((state) => ({ isDarkMap: !state.isDarkMap })),
}));
