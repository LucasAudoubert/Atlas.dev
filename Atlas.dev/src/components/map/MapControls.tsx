import { Menu } from "lucide-react";
import { useAtlasStore } from "../../store/useAtlasStore";

export const MapControls = () => {
  const { isMenuOpen, toggleMenu } = useAtlasStore();

  return (
    <>
      {/* Le Bouton Burger (Flottant) */}
      {!isMenuOpen && (
        <button
          onClick={toggleMenu}
          className="absolute top-6 left-6 z-40 p-3 bg-slate-900/80 backdrop-blur-md border border-slate-700 text-white rounded-xl shadow-2xl hover:bg-slate-800 transition-all active:scale-95"
        >
          <Menu size={24} />
        </button>
      )}

      {/* Overlay sombre quand le menu est ouvert */}
      {isMenuOpen && (
        <div
          onClick={toggleMenu}
          className="absolute inset-0 bg-black/20 backdrop-blur-[2px] z-30 transition-all"
        />
      )}
    </>
  );
};
