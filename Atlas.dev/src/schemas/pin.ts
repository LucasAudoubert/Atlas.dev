// ─── Available Colors ─────────────────────────────────────────────────────────

export const PIN_COLORS = [
  { label: "Emerald", value: "#10b981" },
  { label: "Red", value: "#ef4444" },
  { label: "Blue", value: "#3b82f6" },
  { label: "Amber", value: "#f59e0b" },
  { label: "Purple", value: "#8b5cf6" },
  { label: "Pink", value: "#ec4899" },
  { label: "Cyan", value: "#06b6d4" },
  { label: "White", value: "#f8fafc" },
] as const;

export type PinColor = (typeof PIN_COLORS)[number]["value"];

export const DEFAULT_PIN_COLOR: PinColor = "#10b981";

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * Represents a map pin — usable by both guest and authenticated users.
 * `user_id` is null for guest-only (localStorage) pins.
 */
export type Pin = {
  id: string;
  name: string;
  description?: string;
  lng: number;
  lat: number;
  color: PinColor;
  user_id?: string | null;
  created_at?: string;
};

export type PinInput = Omit<Pin, "id" | "created_at" | "user_id">;

export type PinResult =
  | { success: true; pin: Pin }
  | { success: false; error: string };

// ─── Validation ───────────────────────────────────────────────────────────────

export function validatePinInput(input: PinInput): string | null {
  if (!input.name || input.name.trim().length === 0) {
    return "Le nom du pin est requis.";
  }
  if (input.name.trim().length > 80) {
    return "Le nom ne peut pas dépasser 80 caractères.";
  }
  if (input.description && input.description.length > 500) {
    return "La description ne peut pas dépasser 500 caractères.";
  }
  if (typeof input.lng !== "number" || input.lng < -180 || input.lng > 180) {
    return "Longitude invalide.";
  }
  if (typeof input.lat !== "number" || input.lat < -90 || input.lat > 90) {
    return "Latitude invalide.";
  }
  const validColors = PIN_COLORS.map((c) => c.value);
  if (!validColors.includes(input.color as PinColor)) {
    return "Couleur invalide.";
  }
  return null;
}

// ─── Color → CSS filter ───────────────────────────────────────────────────────
//
// Converts a pin color to a CSS filter chain that recolors pin.png
// using: brightness(0) saturate(100%) → black, then colorize via
// invert + sepia + saturate + hue-rotate + brightness.
//
// Values pre-computed for each palette color.

const COLOR_FILTERS: Record<string, string> = {
  "#10b981":
    "brightness(0) saturate(100%) invert(59%) sepia(73%) saturate(400%) hue-rotate(116deg) brightness(95%)",
  "#ef4444":
    "brightness(0) saturate(100%) invert(34%) sepia(90%) saturate(600%) hue-rotate(340deg) brightness(105%)",
  "#3b82f6":
    "brightness(0) saturate(100%) invert(42%) sepia(80%) saturate(500%) hue-rotate(200deg) brightness(100%)",
  "#f59e0b":
    "brightness(0) saturate(100%) invert(70%) sepia(70%) saturate(600%) hue-rotate(10deg) brightness(100%)",
  "#8b5cf6":
    "brightness(0) saturate(100%) invert(45%) sepia(60%) saturate(500%) hue-rotate(240deg) brightness(100%)",
  "#ec4899":
    "brightness(0) saturate(100%) invert(40%) sepia(80%) saturate(500%) hue-rotate(295deg) brightness(105%)",
  "#06b6d4":
    "brightness(0) saturate(100%) invert(60%) sepia(70%) saturate(500%) hue-rotate(165deg) brightness(100%)",
  "#f8fafc": "brightness(0) saturate(100%) invert(100%) brightness(105%)",
};

export function pinColorToFilter(color: string): string {
  return COLOR_FILTERS[color] ?? COLOR_FILTERS[DEFAULT_PIN_COLOR];
}
