import "./App.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HeroBackground from "./components/Background/HeroBackground";
import MainButton from "./components/buttons/mainButton";
import LoginButton from "./components/buttons/login/loginButton";
import RegisterButton from "./components/buttons/register/registerButton";
import RegisterForm from "./components/forms/register/registerForm";
import { supabase } from "./lib/supabase";

function App() {
  const navigate = useNavigate();
  const [showRegister, setShowRegister] = useState(false);

  const handleRegisterSubmit = async (data: {
    username: string;
    lastname: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    if (data.password !== data.confirmPassword) {
      alert("Les mots de passe ne correspondent pas.");
      return;
    }

    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          first_name: data.username,
          last_name: data.lastname,
        },
      },
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Vérifiez votre email pour confirmer votre inscription !");
      setShowRegister(false);
    }
  };

  return (
    <>
      <main className="relative h-screen w-full flex items-center justify-center bg-[#1a1c24] text-white">
        <HeroBackground />

        <div className="relative z-10 max-w-xl text-center">
          <h1 className="text-6xl font-bold mb-4 tracking-tighter">
            Atlas<span className="text-emerald-400">.dev</span>
          </h1>

          <div
            style={{
              background: "rgba(255, 255, 255, 0.14)",
              borderRadius: "16px",
              boxShadow: " 4px 30px rgba(0, 0, 0, 0.1)",
              backdropFilter: "blur(5px)",
              WebkitBackdropFilter: "blur(5px)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              padding: "8px",
              marginTop: "15px",
            }}
          >
            <p className="text-white text-lg mb-8">
              Une seule carte pour toute les gouverner. Précise, rapide, et
              entièrement personnalisable.
            </p>
          </div>

          <div className="flex justify-center" style={{ marginTop: "48px" }}>
            <MainButton onClick={() => navigate("/map")} />
          </div>
          <div
            className="flex justify-center gap-4"
            style={{ marginTop: "20px" }}
          >
            <LoginButton onClick={() => navigate("/auth")} />
            <RegisterButton onClick={() => setShowRegister(true)} />
          </div>
        </div>
      </main>

      {/* Register Form Modal */}
      {showRegister && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setShowRegister(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <RegisterForm onSubmit={handleRegisterSubmit} />
          </div>
        </div>
      )}
    </>
  );
}

export default App;
