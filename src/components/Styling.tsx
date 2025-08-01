import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import type { StylingType } from "@/types";

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

const colors = [
  { name: "Red", value: "#ff0000" },
  { name: "Green", value: "#00ff00" },
  { name: "Blue", value: "#0066ff" },
  { name: "Yellow", value: "#ffff00" },
];

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
  const handleStylingTypeChange = (type: string) => {
    onStylingTypeChange(type as StylingType);
  };

  // Logarithmic scale mapping functions
  const sliderToSpeed = (sliderValue: number) => {
    return Math.round(Math.pow(10, ((sliderValue - 1) / 99) * 3));
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
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10 text-center">
      {/* Left Column - Live Mode */}
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
              onValueChange={(value) =>
                onSpeedChange(snapToKeyValues(value[0]))
              }
              className={`w-full ${
                !liveMode ? "opacity-50 pointer-events-none" : ""
              }`}
              disabled={!liveMode}
            />
            {/* Speed markers */}
            <div
              className={`relative mt-2 h-4 ${!liveMode ? "opacity-50" : ""}`}
            >
              {[1, 10, 100, 1000].map((speedMark) => {
                const sliderPos = speedToSlider(speedMark);
                const leftPercent = ((sliderPos - 1) / 99) * 100;
                return (
                  <div
                    key={speedMark}
                    className="absolute transform -translate-x-1/2"
                    style={{ left: `${leftPercent}%` }}
                  >
                    <div
                      className={`w-0.5 h-2 mx-auto ${
                        !liveMode ? "bg-gray-600" : "bg-gray-400"
                      }`}
                    ></div>
                    <div
                      className={`text-xs mt-0.5 whitespace-nowrap ${
                        !liveMode ? "text-gray-600" : "text-gray-400"
                      }`}
                    >
                      {speedMark}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Route Styling */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-white">Route styling</h4>
        <div className="space-y-3">
          <h5 className="text-xs font-medium text-white">
            Opacity{" "}
            <span className="text-gray-400">
              ({(opacity * 100).toFixed(0)}%)
            </span>
          </h5>
          <Slider
            value={[opacity * 100]}
            max={100}
            step={1}
            onValueChange={(value) => onOpacityChange(value[0] / 100)}
            className="w-full"
          />
        </div>

        <div className="space-y-3">
          <h5 className="text-xs font-medium text-white">Color mode</h5>
          <Select value={stylingType} onValueChange={handleStylingTypeChange}>
            <SelectTrigger className="w-full text-xs bg-card border-border text-card-foreground focus:ring-ring data-[state=open]:bg-secondary data-[state=open]:border-input">
              <SelectValue placeholder="Select styling type" />
            </SelectTrigger>
            <SelectContent className="dark bg-card border-border z-[10000]">
              <SelectItem
                value="static"
                className="text-xs text-card-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
              >
                Static Color
              </SelectItem>
              <SelectItem
                value="chronological"
                className="text-xs text-card-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
              >
                Chronological
              </SelectItem>
              <SelectItem
                value="pace"
                className="text-xs text-card-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
              >
                Speed
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {stylingType === "static" && (
          <div className="space-y-3">
            <div className="w-full grid grid-cols-4 gap-2">
              {colors.map((color) => {
                const isSelected = selectedColor === color.value;
                return (
                  <Button
                    key={color.value}
                    variant={isSelected ? "default" : "outline"}
                    className={`w-full h-10 flex flex-col items-center justify-center p-2 text-xs ${
                      isSelected ? "text-black" : "text-white"
                    }`}
                    onClick={() => onColorChange(color.value)}
                  >
                    <span
                      className={`text-xs ${
                        isSelected ? "text-black" : "text-white"
                      }`}
                    >
                      {color.name}
                    </span>
                    <div
                      className="w-6 rounded-full border-2"
                      style={{ backgroundColor: color.value }}
                    />
                  </Button>
                );
              })}
            </div>
          </div>
        )}

        {stylingType === "chronological" && (
          <div className="space-y-3">
            <p className="text-xs text-gray-400">
              Oldest runs are violet, newest runs are red
            </p>
            <div
              className="w-full h-[4px] rounded-full"
              style={{
                background:
                  "linear-gradient(to right, #8800ff, #0066ff, #00ff00, #ffff00, #ff6600, #ff0000)",
              }}
            />
          </div>
        )}
        {stylingType === "pace" && (
          <div className="space-y-3">
            <div className="relative">
              <div
                className="w-full h-[4px] rounded-full"
                style={{
                  background:
                    "linear-gradient(to right, #0080ff, #00ffff, #00ff00, #ffff00, #ff8000, #ff0000, #ff00c0)",
                }}
              />
              {/* Speed markers */}
              <div className="relative mt-2 h-8">
                {[
                  { speed: 10, pace: "6:00" },
                  { speed: 13.5, pace: "4:27" },
                  { speed: 17, pace: "3:32" },
                ].map((speedData, index) => {
                  const leftPercent = (index / 2) * 100;
                  return (
                    <div
                      key={speedData.speed}
                      className="absolute transform -translate-x-1/2"
                      style={{ left: `${leftPercent}%` }}
                    >
                      <div className="w-0.5 h-2 bg-gray-400 mx-auto"></div>
                      <div className="text-xs text-gray-400 mt-0.5 whitespace-nowrap">
                        {speedData.speed}km/h
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5 whitespace-nowrap">
                        {speedData.pace}min/km
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Styling;
