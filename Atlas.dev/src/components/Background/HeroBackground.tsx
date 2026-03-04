import RippleGrid from "./RippleGrid";

const HeroBackground = () => {
  return (
    <div className="absolute inset-0 z-0 bg-[#1a1c24] overflow-hidden flex items-center justify-center">
      <div style={{ width: "1080px", height: "1080px", position: "relative" }}>
        <RippleGrid
          enableRainbow={false}
          gridColor="#57ffb0"
          rippleIntensity={0.02}
          gridSize={10}
          gridThickness={9}
          fadeDistance={2.1}
          vignetteStrength={5}
          glowIntensity={0.3}
          opacity={1}
          gridRotation={0}
          mouseInteraction
          mouseInteractionRadius={1}
        />
      </div>
    </div>
  );
};

export default HeroBackground;
