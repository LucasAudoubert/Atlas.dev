import { useAtlasStore } from "../../store/useAtlasStore";

interface MapViewProps {
  mapContainer: React.RefObject<HTMLDivElement | null>;
}

export const MapView = ({ mapContainer }: MapViewProps) => {
  const { isMenuOpen } = useAtlasStore();

  return (
    <div
      ref={mapContainer}
      className={`absolute inset-0 transition-all duration-500 ease-in-out ${
        isMenuOpen ? "left-72" : "left-0"
      }`}
    />
  );
};
