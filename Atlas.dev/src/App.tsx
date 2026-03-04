import "./App.css";
import { useNavigate } from "react-router-dom";
import HeroBackground from "./components/Background/HeroBackground";
import MainButton from "./components/buttons/mainButton";

function App() {
  const navigate = useNavigate();

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
            <MainButton onClick={() => navigate("/auth")} />
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
