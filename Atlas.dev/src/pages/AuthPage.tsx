import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";
import AuthForm from "../components/auth/AuthForm";

const AuthPage = () => {
  const { session, loading } = useAuth();

  if (!loading && session) {
    return <Navigate to="/map" replace />;
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#1a1c24]">
      <div className="w-full max-w-md px-6 py-16">
        <h1 className="text-6xl font-bold text-center mb-4 tracking-tighter text-white font-['Source_Code_Pro',monospace]">
          Atlas<span className="text-emerald-400">.dev</span>
        </h1>
        <p className="text-slate-400 text-center mb-12 text-base font-['Source_Code_Pro',monospace]">
          Connectez-vous pour accéder à votre carte
        </p>
        <AuthForm />
      </div>
    </div>
  );
};

export default AuthPage;
