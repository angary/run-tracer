import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface LiveModeControlsProps {
  liveMode: boolean;
  onLiveModeChange: (enabled: boolean) => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
}

const LiveModeControls: React.FC<LiveModeControlsProps> = ({
  liveMode,
  onLiveModeChange,
  speed,
  onSpeedChange,
}) => {
  // Logarithmic scale mapping functions
  const sliderToSpeed = (sliderValue: number) => {
    return Math.round(Math.pow(10, (sliderValue - 1) / 99 * 3));
  };

  const speedToSlider = (speed: number) => {
    return Math.round((Math.log10(speed) / 3) * 99 + 1);
  };

  const currentSliderValue = speedToSlider(speed);
  
  // Snap zones for key speed values
  const snapToKeyValues = (sliderValue: number) => {
    const keySpeedValues = [1, 10, 100, 1000];
    const snapThreshold = 3; // Snap if within 3 slider units
    
    for (const keySpeed of keySpeedValues) {
      const keySliderPos = speedToSlider(keySpeed);
      if (Math.abs(sliderValue - keySliderPos) <= snapThreshold) {
        return keySpeed;
      }
    }
    
    // If not near any key value, use normal logarithmic conversion
    return sliderToSpeed(sliderValue);
  };

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-white">Live mode</h4>
      <div className="space-y-3">
        <Button
          variant={liveMode ? "default" : "outline"}
          onClick={() => onLiveModeChange(!liveMode)}
          className={`w-full text-xs ${
            !liveMode ? "text-white hover:text-white" : ""
          }`}
        >
          {liveMode ? "Live Mode On (l)" : "Live Mode Off (l)"}
        </Button>
      </div>
      
      <div className="space-y-3">
        <h5
          className={`text-xs font-medium ${
            liveMode ? "text-white" : "text-gray-500"
          }`}
        >
          Speed <span className="text-gray-400">({speed})</span>
        </h5>
        <div className="relative">
          <Slider
            value={[currentSliderValue]}
            min={1}
            max={100}
            step={1}
            onValueChange={(value) => onSpeedChange(snapToKeyValues(value[0]))}
            className={`w-full ${
              !liveMode ? "opacity-50 pointer-events-none" : ""
            }`}
            disabled={!liveMode}
          />
          {/* Speed markers */}
          <div className={`relative mt-2 h-4 ${!liveMode ? "opacity-50" : ""}`}>
            {[1, 10, 100, 1000].map((speedMark) => {
              const sliderPos = speedToSlider(speedMark);
              const leftPercent = ((sliderPos - 1) / 99) * 100;
              return (
                <div
                  key={speedMark}
                  className="absolute transform -translate-x-1/2"
                  style={{ left: `${leftPercent}%` }}
                >
                  <div className={`w-0.5 h-2 mx-auto ${!liveMode ? "bg-gray-600" : "bg-gray-400"}`}></div>
                  <div className={`text-xs mt-0.5 whitespace-nowrap ${!liveMode ? "text-gray-600" : "text-gray-400"}`}>
                    {speedMark}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveModeControls;
