import type { StylingType } from "@/types";
import LiveModeControls from "./styling-options/LiveModeControls";
import RouteStylingControls from "./styling-options/RouteStylingControls";

interface StylingProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
  stylingType: StylingType;
  onStylingTypeChange: (type: StylingType) => void;
  opacity: number;
  onOpacityChange: (opacity: number) => void;
  liveMode: boolean;
  onLiveModeChange: (enabled: boolean) => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
}

const Styling: React.FC<StylingProps> = ({
  selectedColor,
  onColorChange,
  stylingType,
  onStylingTypeChange,
  opacity,
  onOpacityChange,
  liveMode,
  onLiveModeChange,
  speed,
  onSpeedChange,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10 text-center">
      {/* Left Column - Live Mode */}
      <LiveModeControls
        liveMode={liveMode}
        onLiveModeChange={onLiveModeChange}
        speed={speed}
        onSpeedChange={onSpeedChange}
      />

      {/* Right Column - Route Styling */}
      <RouteStylingControls
        selectedColor={selectedColor}
        onColorChange={onColorChange}
        stylingType={stylingType}
        onStylingTypeChange={onStylingTypeChange}
        opacity={opacity}
        onOpacityChange={onOpacityChange}
      />
    </div>
  );
};

export default Styling;
