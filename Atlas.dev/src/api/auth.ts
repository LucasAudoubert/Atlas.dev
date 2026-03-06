import { supabase } from "../lib/supabase";
import type {
  AuthResult,
  LoginInput,
  OAuthProvider,
  RegisterInput,
} from "../schemas/auth";

// ─── Email / Password ─────────────────────────────────────────────────────────

/**
 * Connecte un utilisateur avec email + mot de passe.
 */
export async function signIn(input: LoginInput): Promise<AuthResult> {
  const { error } = await supabase.auth.signInWithPassword({
    email: input.email,
    password: input.password,
  });

  if (error) return { success: false, error: error.message };
  return { success: true };
}

/**
 * Crée un compte avec email + mot de passe.
 * Envoie un email de confirmation.
 */
export async function signUp(input: RegisterInput): Promise<AuthResult> { // nom de la fonction signUp pour éviter conflit avec supabase.auth.signUp
  const { error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      emailRedirectTo: `${window.location.origin}/map`,
    },
  });

  if (error) return { success: false, error: error.message };
  return {
    success: true,
    message: "Vérifiez votre email pour confirmer votre inscription !",
  };
}

/**
 * Déconnecte l'utilisateur courant.
 */
export async function signOut(): Promise<AuthResult> {
  const { error } = await supabase.auth.signOut();

  if (error) return { success: false, error: error.message };
  return { success: true };
}

// ─── OAuth ────────────────────────────────────────────────────────────────────

/**
 * Lance le flux OAuth (GitHub ou Google).
 * Redirige vers /map après connexion.
 */
export async function signInWithOAuth(
  provider: OAuthProvider,
): Promise<AuthResult> {
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/map`,
    },
  });

  if (error) return { success: false, error: error.message };
  return { success: true };
}
