import { supabase } from "../lib/supabase";

// ─── Types ────────────────────────────────────────────────────────────────────

export type UserProfile = {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

// ─── Lecture du profil ────────────────────────────────────────────────────────

/**
 * Récupère le profil de l'utilisateur connecté depuis public.profiles.
 */
export async function getProfile(): Promise<UserProfile | null> {
  const { data, error } = await supabase.from("profiles").select("*").single();

  if (error || !data) return null;
  return data as UserProfile;
}

/**
 * Met à jour les informations du profil.
 */
export async function updateProfile(
  updates: Partial<
    Pick<UserProfile, "first_name" | "last_name" | "avatar_url">
  >,
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from("profiles")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", (await supabase.auth.getUser()).data.user?.id ?? "");

  if (error) return { success: false, error: error.message };
  return { success: true };
}
