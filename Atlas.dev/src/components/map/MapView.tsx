import { useAtlasStore } from "../../store/useAtlasStore";

interface MapViewProps {
  mapContainer: React.RefObject<HTMLDivElement | null>;
}

export const MapView = ({ mapContainer }: MapViewProps) => {
  const { isMenuOpen } = useAtlasStore();

  const sidebarWidth = isMenuOpen ? 240 : 0;

  return (
    <div
      ref={mapContainer}
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        left: sidebarWidth,
        width: `calc(100% - ${sidebarWidth}px)`,
        height: "100%",
        transition: "left 0.5s ease-in-out, width 0.5s ease-in-out",
      }}
    />
  );
};
