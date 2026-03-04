import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "../lib/supabase";
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";

const AuthPage = () => {
  const { session, loading } = useAuth();

  // Si déjà connecté, rediriger vers la carte
  if (!loading && session) {
    return <Navigate to="/map" replace />;
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#1a1c24]">
      <div className="w-full max-w-md p-8">
        <h1 className="text-4xl font-bold text-center mb-2 tracking-tighter text-white">
          Atlas<span className="text-emerald-400">.dev</span>
        </h1>
        <p className="text-slate-400 text-center mb-8 text-sm">
          Connectez-vous pour accéder à votre carte
        </p>

        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-2xl">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: "#34d399",
                    brandAccent: "#10b981",
                    inputBackground: "#1e293b",
                    inputText: "#f8fafc",
                    inputBorder: "#334155",
                    inputBorderFocus: "#34d399",
                    inputBorderHover: "#475569",
                    inputPlaceholder: "#64748b",
                    messageText: "#f8fafc",
                    messageTextDanger: "#f87171",
                    anchorTextColor: "#34d399",
                    anchorTextHoverColor: "#6ee7b7",
                  },
                  space: {
                    buttonPadding: "12px 16px",
                    inputPadding: "12px 16px",
                  },
                  borderWidths: {
                    buttonBorderWidth: "1px",
                    inputBorderWidth: "1px",
                  },
                  radii: {
                    borderRadiusButton: "12px",
                    buttonBorderRadius: "12px",
                    inputBorderRadius: "12px",
                  },
                  fonts: {
                    bodyFontFamily: "'Source Code Pro', monospace",
                    buttonFontFamily: "'Source Code Pro', monospace",
                    inputFontFamily: "'Source Code Pro', monospace",
                    labelFontFamily: "'Source Code Pro', monospace",
                  },
                },
              },
              className: {
                container: "auth-container",
                button: "auth-button",
                input: "auth-input",
              },
            }}
            providers={["github", "google"]}
            redirectTo={`${window.location.origin}/map`}
            localization={{
              variables: {
                sign_in: {
                  email_label: "Email",
                  password_label: "Mot de passe",
                  button_label: "Se connecter",
                  link_text: "Vous avez déjà un compte ? Connectez-vous",
                  email_input_placeholder: "votre@email.com",
                  password_input_placeholder: "Votre mot de passe",
                },
                sign_up: {
                  email_label: "Email",
                  password_label: "Mot de passe",
                  button_label: "S'inscrire",
                  link_text: "Pas encore de compte ? Inscrivez-vous",
                  email_input_placeholder: "votre@email.com",
                  password_input_placeholder: "Choisissez un mot de passe",
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
