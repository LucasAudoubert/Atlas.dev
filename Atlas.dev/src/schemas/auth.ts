// ─── Types des formulaires ────────────────────────────────────────────────────

export type AuthMode = "sign_in" | "sign_up";

export type LoginInput = {
  email: string;
  password: string;
};

export type RegisterInput = {
  email: string;
  password: string;
};

export type OAuthProvider = "github" | "google";

// ─── Résultat générique d'une opération auth ─────────────────────────────────

export type AuthResult =
  | { success: true; message?: string }
  | { success: false; error: string };

// ─── Validation basique côté client ──────────────────────────────────────────

export function validateEmail(email: string): string | null {
  if (!email) return "L'email est requis.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Email invalide.";
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return "Le mot de passe est requis.";
  if (password.length < 6)
    return "Le mot de passe doit contenir au moins 6 caractères.";
  return null;
}

export function validateLoginInput(input: LoginInput): string | null {
  return validateEmail(input.email) ?? validatePassword(input.password);
}

export function validateRegisterInput(input: RegisterInput): string | null {
  return validateEmail(input.email) ?? validatePassword(input.password);
}
