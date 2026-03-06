import { motion } from "framer-motion";
import { useAtlasStore } from "../../store/useAtlasStore";
import BurgerButton from "../buttons/burgerButton/burgerButton";

const SIDEBAR_WIDTH = 240;

export const MapControls = () => {
  const { isMenuOpen, toggleMenu } = useAtlasStore();

  return (
    <>
      {/* Bouton Burger — se décale quand la sidebar s'ouvre */}
      <motion.div
        onClick={toggleMenu}
        initial={false}
        animate={{ left: isMenuOpen ? SIDEBAR_WIDTH + 16 : 24 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{
          width: "fit-content",
          flexShrink: 0,
          top: 24,
          position: "absolute",
        }}
        className="z-[60] p-2 bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-xl shadow-2xl hover:bg-slate-800 active:scale-95 inline-flex items-center justify-center cursor-pointer"
      >
        <BurgerButton isOpen={isMenuOpen} style={{ pointerEvents: "none" }} />
      </motion.div>

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
