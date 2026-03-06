import { supabase } from "../lib/supabase";
import { type Pin, type PinResult } from "../schemas/pin";

// ─── Create ───────────────────────────────────────────────────────────────────

/**
 * Persists a pin in Supabase for the currently authenticated user.
 * The caller is responsible for checking that a session exists before calling.
 */
export async function createPinRemote(
  pin: Omit<Pin, "user_id" | "created_at">,
): Promise<PinResult> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Non authentifié." };
  }

  const { data, error } = await supabase
    .from("pins")
    .insert({
      id: pin.id,
      user_id: user.id,
      name: pin.name,
      description: pin.description ?? null,
      lng: pin.lng,
      lat: pin.lat,
      color: pin.color,
    })
    .select()
    .single();

  if (error || !data) {
    return { success: false, error: error?.message ?? "Erreur inconnue." };
  }

  return {
    success: true,
    pin: {
      id: data.id,
      name: data.name,
      description: data.description ?? undefined,
      lng: data.lng,
      lat: data.lat,
      color: data.color,
      user_id: data.user_id,
      created_at: data.created_at,
    },
  };
}

// ─── Read ─────────────────────────────────────────────────────────────────────

/**
 * Loads all pins for the currently authenticated user from Supabase.
 * Returns an empty array if not authenticated or on error.
 */
export async function getUserPins(): Promise<Pin[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("pins")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id,
    name: row.name,
    description: row.description ?? undefined,
    lng: row.lng,
    lat: row.lat,
    color: row.color,
    user_id: row.user_id,
    created_at: row.created_at,
  }));
}

// ─── Delete ───────────────────────────────────────────────────────────────────

/**
 * Deletes a pin from Supabase by ID.
 * Only works if the current user owns the pin (enforced by RLS).
 */
export async function deletePinRemote(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase.from("pins").delete().eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}
