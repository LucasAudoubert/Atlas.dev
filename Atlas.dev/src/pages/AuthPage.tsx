import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";

const AuthPage = () => {
  const { session, loading } = useAuth();
  const [mode, setMode] = useState<"sign_in" | "sign_up">("sign_in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!loading && session) {
    return <Navigate to="/map" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setSubmitting(true);

    try {
      if (mode === "sign_in") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/map` },
        });
        if (error) throw error;
        setMessage("Vérifiez votre email pour confirmer votre inscription !");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setSubmitting(false);
    }
  };

  const handleOAuth = async (provider: "github" | "google") => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/map` },
    });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#1a1c24]">
      <div className="w-full max-w-md p-8">
        <h1 className="text-4xl font-bold text-center mb-2 tracking-tighter text-white font-['Source_Code_Pro',monospace]">
          Atlas<span className="text-emerald-400">.dev</span>
        </h1>
        <p className="text-slate-400 text-center mb-8 text-sm font-['Source_Code_Pro',monospace]">
          {mode === "sign_in"
            ? "Connectez-vous pour accéder à votre carte"
            : "Créez votre compte"}
        </p>

        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-2xl">
          {/* OAuth buttons */}
          <div className="flex flex-col gap-3 mb-6">
            <button
              type="button"
              onClick={() => handleOAuth("github")}
              className="flex items-center justify-center gap-3 w-full rounded-xl border border-slate-700 bg-[#1e293b] px-4 py-3 text-sm text-slate-200 hover:border-slate-500 transition-colors font-['Source_Code_Pro',monospace] cursor-pointer"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              Continuer avec GitHub
            </button>
            <button
              type="button"
              onClick={() => handleOAuth("google")}
              className="flex items-center justify-center gap-3 w-full rounded-xl border border-slate-700 bg-[#1e293b] px-4 py-3 text-sm text-slate-200 hover:border-slate-500 transition-colors font-['Source_Code_Pro',monospace] cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
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
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-slate-700" />
            <span className="text-xs text-slate-500 font-['Source_Code_Pro',monospace]">
              ou
            </span>
            <div className="flex-1 h-px bg-slate-700" />
          </div>

          {/* Email / Password form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm text-slate-300 mb-1.5 font-['Source_Code_Pro',monospace]">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                required
                className="w-full rounded-xl border border-slate-700 bg-[#1e293b] px-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-emerald-400 transition-colors font-['Source_Code_Pro',monospace]"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-1.5 font-['Source_Code_Pro',monospace]">
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
                className="w-full rounded-xl border border-slate-700 bg-[#1e293b] px-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-emerald-400 transition-colors font-['Source_Code_Pro',monospace]"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm font-['Source_Code_Pro',monospace]">
                {error}
              </p>
            )}
            {message && (
              <p className="text-emerald-400 text-sm font-['Source_Code_Pro',monospace]">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 px-4 py-3 text-sm font-semibold text-white transition-colors font-['Source_Code_Pro',monospace] cursor-pointer"
            >
              {submitting
                ? "..."
                : mode === "sign_in"
                  ? "Se connecter"
                  : "S'inscrire"}
            </button>
          </form>

          {/* Toggle mode */}
          <p className="text-center text-sm text-slate-400 mt-5 font-['Source_Code_Pro',monospace]">
            {mode === "sign_in" ? (
              <>
                Pas encore de compte ?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("sign_up");
                    setError(null);
                    setMessage(null);
                  }}
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
                  onClick={() => {
                    setMode("sign_in");
                    setError(null);
                    setMessage(null);
                  }}
                  className="text-emerald-400 hover:text-emerald-300 underline cursor-pointer"
                >
                  Connectez-vous
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
