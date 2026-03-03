import "./App.css";
import HeroBackground from "./components/Background/HeroBackground";

function App() {
  return (
    <>
      <main className="relative h-screen w-full flex items-center justify-center bg-[#1a1c24] text-white">
        <HeroBackground />

        <div className="relative z-10 max-w-xl text-center">
          <h1 className="text-6xl font-bold mb-4 tracking-tighter">
            Atlas<span className="text-emerald-400">.dev</span>
          </h1>
          <p className="text-slate-400 text-lg mb-8">
            La visualisation de données géographiques du futur. Précis, rapide,
            et entièrement personnalisable.
          </p>
          <button className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold py-3 px-8 rounded-lg transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)]">
            Go!
          </button>
        </div>
      </main>
    </>
  );
}

export default App;
