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
  LogIn,
  UserPlus,
} from "lucide-react";

import { PinList } from "../map/PinList";

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
      initial={false}
      animate={{ left: isMenuOpen ? 0 : -240 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={{ width: 240 }}
      className="absolute top-0 h-screen bg-slate-900/90 backdrop-blur-xl border-r border-slate-800 z-50 p-4 text-white shadow-2xl flex flex-col justify-between"
    >
      <div>
      <div className="flex justify-between items-center mb-8">
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

      <nav className="space-y-5">
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
      </div>
      <PinList />

      <div className="border-t border-slate-800 pt-3">
        {user ? (
          <>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-7 h-7 rounded-full bg-emerald-400/20 flex items-center justify-center text-emerald-400 text-xs font-bold shrink-0">
                {user.email?.charAt(0).toUpperCase()}
              </div>
              <p className="text-xs text-slate-400 truncate">
                {user.email}
              </p>
            </div>
            <div
              onClick={handleSignOut}
              className="flex items-center gap-3 text-sm text-slate-400 hover:text-red-400 cursor-pointer transition-all"
            >
              <LogOut size={16} /> <span>Se déconnecter</span>
            </div>
          </>
        ) : (
          <>
            <p className="text-xs text-slate-500 mb-2">
              Non connecté
            </p>
            <div className="flex items-center gap-4">
              <div
                onClick={() => { toggleMenu(); navigate("/auth"); }}
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-emerald-400 cursor-pointer transition-all"
              >
                <LogIn size={16} /> <span>Login</span>
              </div>
              <div
                onClick={() => { toggleMenu(); navigate("/auth"); }}
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-emerald-400 cursor-pointer transition-all"
              >
                <UserPlus size={16} /> <span>Register</span>
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};
