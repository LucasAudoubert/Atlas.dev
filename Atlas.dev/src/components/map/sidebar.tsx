import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAtlasStore } from "../../store/useAtlasStore";
import { useAuth } from "../../hooks/useAuth";
import {
  Map as MapIcon,
  Layers,
  Settings,
  X,
  Moon,
  Sun,
  LogOut,
} from "lucide-react";

export const Sidebar = () => {
  const { isMenuOpen, toggleMenu, isDarkMap, toggleMapTheme } = useAtlasStore();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: isMenuOpen ? 0 : -300 }}
      className="absolute top-0 left-0 h-screen w-72 bg-slate-900/90 backdrop-blur-xl border-r border-slate-800 z-50 p-6 text-white shadow-2xl flex flex-col"
    >
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-xl font-bold tracking-tighter">
          ATLAS<span className="text-emerald-400">.DEV</span>
        </h2>
        <button
          onClick={toggleMenu}
          className="hover:text-emerald-400 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="space-y-6 flex-1">
        <div className="flex items-center gap-4 text-slate-400 hover:text-emerald-400 cursor-pointer transition-all">
          <MapIcon size={20} /> <span>Ma Carte</span>
        </div>
        <div className="flex items-center gap-4 text-slate-400 hover:text-emerald-400 cursor-pointer transition-all">
          <Layers size={20} /> <span>Couches (Layers)</span>
        </div>
        <div className="flex items-center gap-4 text-slate-400 hover:text-emerald-400 cursor-pointer transition-all">
          <Settings size={20} /> <span>Configuration</span>
        </div>
        <div
          onClick={toggleMapTheme}
          className="flex items-center gap-4 text-slate-400 hover:text-emerald-400 cursor-pointer transition-all"
        >
          {isDarkMap ? <Sun size={20} /> : <Moon size={20} />}
          <span>{isDarkMap ? "Thème Clair" : "Thème Sombre"}</span>
        </div>
      </nav>

      {/* User info + Logout */}
      <div className="border-t border-slate-800 pt-4 mt-4">
        {user && (
          <p className="text-xs text-slate-500 truncate mb-3">{user.email}</p>
        )}
        <div
          onClick={handleSignOut}
          className="flex items-center gap-4 text-slate-400 hover:text-red-400 cursor-pointer transition-all"
        >
          <LogOut size={20} /> <span>Se déconnecter</span>
        </div>
      </div>
    </motion.div>
  );
};
