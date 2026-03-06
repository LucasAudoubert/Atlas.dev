import { useState } from "react";
import { signIn, signUp, signInWithOAuth } from "../../api/auth";
import {
  type AuthMode,
  type OAuthProvider,
  validateLoginInput,
  validateRegisterInput,
} from "../../schemas/auth";

const FONT = "font-['Source_Code_Pro',monospace]";

const AuthForm = () => {
  const [mode, setMode] = useState<AuthMode>("sign_in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const switchMode = (next: AuthMode) => {
    setMode(next);
    setError(null);
    setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    const input = { email, password };
    const validationError =
      mode === "sign_in"
        ? validateLoginInput(input)
        : validateRegisterInput(input);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    const result =
      mode === "sign_in" ? await signIn(input) : await signUp(input);
    setSubmitting(false);

    if (!result.success) {
      setError(result.error);
    } else if (result.message) {
      setMessage(result.message);
    }
  };

  const handleOAuth = async (provider: OAuthProvider) => {
    const result = await signInWithOAuth(provider);
    if (!result.success) setError(result.error);
  };

  return (
    <div
      className={`bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-10 shadow-2xl ${FONT}`}
    >
      {/* OAuth */}
      <div className="flex flex-col gap-4 mb-10">
        <button
          type="button"
          onClick={() => handleOAuth("github")}
          className={`flex items-center justify-center gap-3 w-full rounded-xl border border-slate-700 bg-[#1e293b] px-5 py-4 text-base text-slate-200 hover:border-slate-500 transition-colors cursor-pointer ${FONT}`}
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          Continuer avec GitHub
        </button>
        <button
          type="button"
          onClick={() => handleOAuth("google")}
          className={`flex items-center justify-center gap-3 w-full rounded-xl border border-slate-700 bg-[#1e293b] px-5 py-4 text-base text-slate-200 hover:border-slate-500 transition-colors cursor-pointer ${FONT}`}
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continuer avec Google
        </button>
      </div>

      {/* Separator */}
      <div className="flex items-center gap-4 mb-10">
        <div className="flex-1 h-px bg-slate-700" />
        <span className={`text-xs text-slate-500 ${FONT}`}>ou</span>
        <div className="flex-1 h-px bg-slate-700" />
      </div>

      {/* Email / Password */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-7">
        <div>
          <label className={`block text-base text-slate-300 mb-3 ${FONT}`}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre@email.com"
            required
            className={`w-full rounded-xl border border-slate-700 bg-[#1e293b] px-5 py-5 text-base text-slate-100 placeholder-slate-500 outline-none focus:border-emerald-400 transition-colors ${FONT}`}
          />
        </div>
        <div>
          <label className={`block text-base text-slate-300 mb-3 ${FONT}`}>
            Mot de passe
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={
              mode === "sign_in"
                ? "Votre mot de passe"
                : "Choisissez un mot de passe"
            }
            required
            className={`w-full rounded-xl border border-slate-700 bg-[#1e293b] px-5 py-5 text-base text-slate-100 placeholder-slate-500 outline-none focus:border-emerald-400 transition-colors ${FONT}`}
          />
        </div>

        {error && <p className={`text-red-400 text-sm ${FONT}`}>{error}</p>}
        {message && (
          <p className={`text-emerald-400 text-sm ${FONT}`}>{message}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className={`w-full rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 px-5 py-5 text-lg font-semibold text-white transition-colors cursor-pointer ${FONT}`}
        >
          {submitting
            ? "..."
            : mode === "sign_in"
              ? "Se connecter"
              : "S'inscrire"}
        </button>
      </form>

      {/* Toggle mode */}
      <p className={`text-center text-base text-slate-400 mt-10 ${FONT}`}>
        {mode === "sign_in" ? (
          <>
            Pas encore de compte ?{" "}
            <button
              type="button"
              onClick={() => switchMode("sign_up")}
              className="text-emerald-400 hover:text-emerald-300 underline cursor-pointer"
            >
              Inscrivez-vous
            </button>
          </>
        ) : (
          <>
            Déjà un compte ?{" "}
            <button
              type="button"
              onClick={() => switchMode("sign_in")}
              className="text-emerald-400 hover:text-emerald-300 underline cursor-pointer"
            >
              Connectez-vous
            </button>
          </>
        )}
      </p>
    </div>
  );
};

export default AuthForm;
