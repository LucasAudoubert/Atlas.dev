import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, X } from "lucide-react";
import { useAtlasStore } from "../../store/useAtlasStore";
import { useAuth } from "../../hooks/useAuth";
import { createPinRemote } from "../../api/pin";
import {
  PIN_COLORS,
  DEFAULT_PIN_COLOR,
  validatePinInput,
  type PinColor,
} from "../../schemas/pin";
import PinName from "../input/pinName/pinName";

const FONT = "font-['Source_Code_Pro',monospace]";

export const PinCreationOverlay = () => {
  const { pendingPin, setPendingPin, addPin } = useAtlasStore();
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState<PinColor>(DEFAULT_PIN_COLOR);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setName("");
    setDescription("");
    setColor(DEFAULT_PIN_COLOR);
    setError(null);
    setSubmitting(false);
  };

  const handleCancel = () => {
    reset();
    setPendingPin(null);
  };

  const handleConfirm = async () => {
    if (!pendingPin) return;

    const input = {
      name: name.trim(),
      description: description.trim() || undefined,
      lng: pendingPin.lng,
      lat: pendingPin.lat,
      color,
    };

    const validationError = validatePinInput(input);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    setError(null);

    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    if (user) {
      // Authenticated: persist in Supabase
      const result = await createPinRemote({ id, ...input });
      if (!result.success) {
        setError(result.error);
        setSubmitting(false);
        return;
      }
      addPin({ ...result.pin });
    } else {
      // Guest: store locally only
      addPin({
        id,
        ...input,
        user_id: null,
        created_at: now,
      });
    }

    reset();
    setPendingPin(null);
  };

  return (
    <AnimatePresence>
      {pendingPin && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[65] bg-black/40 backdrop-blur-sm"
            onClick={handleCancel}
          />

          {/* Card */}
          <motion.div
            key="card"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] w-full max-w-sm bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl p-6 ${FONT}`}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-emerald-400" />
                <h3 className="font-bold text-white text-base tracking-tight">
                  Nouveau pin
                </h3>
              </div>
              <button
                onClick={handleCancel}
                className="text-slate-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800"
              >
                <X size={16} />
              </button>
            </div>

            {/* Coords */}
            <p className="text-[11px] text-slate-500 mb-5">
              {pendingPin.lat.toFixed(5)}, {pendingPin.lng.toFixed(5)}
            </p>

            {/* Name — uses PinName component */}
            <div className="mb-4">
              <PinName
                label="Nom du pin"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
                autoFocus
              />
            </div>

            {/* Description */}
            <div className="mb-5">
              <label className="block text-sm text-slate-400 mb-2">
                Description <span className="text-slate-600">(optionnel)</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ajouter une note..."
                rows={2}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-slate-100 placeholder-slate-600 outline-none focus:border-emerald-400 transition-colors resize-none"
              />
            </div>

            {/* Color picker */}
            <div className="mb-5">
              <label className="block text-sm text-slate-400 mb-2">
                Couleur
              </label>
              <div className="flex gap-2 flex-wrap">
                {PIN_COLORS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setColor(c.value as PinColor)}
                    title={c.label}
                    className="w-7 h-7 rounded-full border-2 transition-all"
                    style={{
                      backgroundColor: c.value,
                      borderColor: color === c.value ? "#fff" : "transparent",
                      boxShadow:
                        color === c.value ? `0 0 6px ${c.value}` : "none",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Error */}
            {error && <p className="text-red-400 text-xs mb-4">{error}</p>}

            {/* Guest notice */}
            {!user && (
              <p className="text-amber-500/80 text-[11px] mb-4">
                Non connecté — le pin sera sauvegardé localement uniquement.
              </p>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="flex-1 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirm}
                disabled={submitting || !name.trim()}
                className="flex-1 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 px-4 py-2.5 text-sm font-semibold text-white transition-colors"
              >
                {submitting ? "..." : "Créer"}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
