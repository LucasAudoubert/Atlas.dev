import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAtlasStore } from "../../store/useAtlasStore";
import { useAuth } from "../../hooks/useAuth";
import { useEffect, useState, type ReactNode } from "react";
import { getProfile, type UserProfile } from "../../api/user";
import {
  Map as MapIcon,
  Settings,
  X,
  LogIn,
  UserPlus,
  MapPin,
  ChevronDown,
  Layers,
  Moon,
  Sun,
  Navigation,
  Globe,
  Compass,
  Camera,
} from "lucide-react";
import { MAP_LAYERS } from "../../schemas/mapLayer";
import { PinList } from "../map/PinList";
import LogoutButton from "../buttons/logoutButtn/logoutButton";

export const Sidebar = () => {
  const {
    isMenuOpen,
    toggleMenu,
    mapStyleUrl,
    setMapStyle,
    pins,
    streetViewMode,
    toggleStreetViewMode,
  } = useAtlasStore();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isPinsOpen, setIsPinsOpen] = useState(true);
  const [isLayersOpen, setIsLayersOpen] = useState(false);

  const LAYER_ICONS: Record<string, ReactNode> = {
    dark: <Moon size={14} />,
    light: <Sun size={14} />,
    voyager: <Navigation size={14} />,
    terrain: <Globe size={14} />,
    bright: <MapIcon size={14} />,
    liberty: <Compass size={14} />,
  };

  useEffect(() => {
    if (user) getProfile().then(setProfile);
    else setProfile(null);
  }, [user]);

  const displayName = profile?.first_name
    ? `${profile.first_name}${profile.last_name ? " " + profile.last_name : ""}`
    : (user?.user_metadata?.full_name ?? null);

  const avatarLetter = (profile?.first_name ?? user?.email ?? "?")
    .charAt(0)
    .toUpperCase();

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
      className="absolute top-0 h-screen bg-slate-900/95 backdrop-blur-xl border-r border-slate-800 z-50 text-white shadow-2xl flex flex-col"
    >
      {/* ── Header ────────────────────────────────────── */}
      <div className="flex justify-between items-center px-5 pt-5 pb-4 border-b border-slate-800">
        <h2 className="text-lg font-bold tracking-tighter">
          ATLAS<span className="text-emerald-400">.DEV</span>
        </h2>
        <button
          onClick={toggleMenu}
          className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800"
        >
          <X size={18} />
        </button>
      </div>

      {/* ── Nav ───────────────────────────────────────── */}
      <nav className="flex flex-col gap-1 px-3 pt-4">
        {[
          { icon: <MapIcon size={17} />, label: "Ma Carte" },
          { icon: <Settings size={17} />, label: "Configuration" },
        ].map(({ icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer transition-all"
          >
            {icon}
            <span>{label}</span>
          </div>
        ))}

        {/* Street View toggle */}
        <button
          onClick={toggleStreetViewMode}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
            streetViewMode
              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/40"
              : "text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent"
          }`}
        >
          <Camera size={17} />
          <span>Street View</span>
          {streetViewMode && (
            <span className="ml-auto text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
              ACTIF
            </span>
          )}
        </button>

        {/* Couches — collapsible */}
        <button
          onClick={() => setIsLayersOpen((v) => !v)}
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Layers size={17} />
            <span>Couches</span>
          </div>
          <motion.div
            animate={{ rotate: isLayersOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={13} />
          </motion.div>
        </button>

        <AnimatePresence initial={false}>
          {isLayersOpen && (
            <motion.div
              key="layers"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.18 }}
              style={{ overflow: "hidden" }}
            >
              <div className="grid grid-cols-2 gap-1.5 px-1 pb-1 pt-0.5">
                {MAP_LAYERS.map((layer) => {
                  const active = mapStyleUrl === layer.url;
                  return (
                    <button
                      key={layer.id}
                      onClick={() => setMapStyle(layer.url)}
                      className={`flex flex-col items-start gap-1 px-2.5 py-2 rounded-xl border text-left transition-all ${
                        active
                          ? "bg-emerald-500/15 border-emerald-500/50 text-emerald-400"
                          : "bg-slate-800/60 border-slate-700/50 text-slate-400 hover:border-slate-600 hover:text-white"
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        {LAYER_ICONS[layer.id]}
                        <span className="text-xs font-medium">
                          {layer.label}
                        </span>
                      </span>
                      <span className="text-[10px] opacity-60 truncate w-full">
                        {layer.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── Pin List ──────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-3 mt-2 min-h-0">
        {/* Collapsible header */}
        <button
          onClick={() => setIsPinsOpen((v) => !v)}
          className="w-full flex items-center justify-between px-2 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors group"
        >
          <div className="flex items-center gap-2">
            <MapPin size={15} />
            <span className="text-xs font-semibold uppercase tracking-wider">
              Mes Pins
            </span>
            <span className="text-[11px] bg-slate-800 group-hover:bg-slate-700 rounded-full px-1.5 py-0.5 text-slate-400">
              {pins.length}
            </span>
          </div>
          <motion.div
            animate={{ rotate: isPinsOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={14} />
          </motion.div>
        </button>

        <AnimatePresence initial={false}>
          {isPinsOpen && (
            <motion.div
              key="pinlist"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ overflow: "hidden" }}
            >
              <div className="pt-1 pb-2">
                <PinList />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Separator ─────────────────────────────────── */}
      <div className="px-5 pt-3 pb-1">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-px bg-slate-800" />
          <span className="text-[10px] text-white/70 uppercase tracking-widest">
            Compte
          </span>
          <div className="flex-1 h-px bg-slate-800" />
        </div>
      </div>

      {/* ── Footer / Profil ───────────────────────────── */}
      <div
        className="px-4 pb-14 pt-4"
        style={{
          paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 1.5rem)",
        }}
      >
        {user ? (
          <div className="flex flex-col gap-3">
            {/* Profile card */}
            <div className="flex flex-col items-center gap-2 py-2">
              <div className="w-14 h-14 rounded-full bg-emerald-400/20 flex items-center justify-center text-emerald-400 text-xl font-bold border-2 border-emerald-400/40">
                {avatarLetter}
              </div>
              <div className="flex flex-col items-center min-w-0">
                <span className="text-sm font-semibold text-white truncate">
                  {displayName ?? "Mon compte"}
                </span>
                <span className="text-[11px] text-slate-500 truncate">
                  {user.email}
                </span>
              </div>
            </div>

            {/* Logout */}
            <div className="flex justify-center mb-1">
              <LogoutButton onClick={handleSignOut} label="Déconnexion" />
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <p className="text-[11px] text-white/70 uppercase tracking-wider px-1 mb-1">
              Compte
            </p>
            <div
              onClick={() => {
                toggleMenu();
                navigate("/auth");
              }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer transition-all"
            >
              <LogIn size={17} /> <span>Se connecter</span>
            </div>
            <div
              onClick={() => {
                toggleMenu();
                navigate("/auth");
              }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer transition-all"
            >
              <UserPlus size={17} /> <span>S'inscrire</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};
