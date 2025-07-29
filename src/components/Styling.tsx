import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

interface StylingProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
  stylingType: string;
  onStylingTypeChange: (type: string) => void;
  opacity: number;
  onOpacityChange: (opacity: number) => void;
}

const colors = [
  { name: "Red", value: "#ff0000" },
  { name: "Blue", value: "#0066ff" },
  { name: "Green", value: "#00ff00" },
  { name: "Purple", value: "#8800ff" },
  { name: "Orange", value: "#ff6600" },
  { name: "Pink", value: "#ff0099" },
  { name: "Yellow", value: "#ffff00" },
  { name: "Cyan", value: "#00ffff" },
];

const Styling: React.FC<StylingProps> = ({
  selectedColor,
  onColorChange,
  stylingType,
  onStylingTypeChange,
  opacity,
  onOpacityChange
}) => {
  const handleStylingTypeChange = (type: string) => {
    onStylingTypeChange(type);
  };

  return (
    <div className="space-y-4 text-center">

      <div className="space-y-3">
        <h5 className="text-xs font-medium text-white">Route opacity <span className="text-gray-400">({(opacity * 100).toFixed(0)}%)</span></h5>
        <Slider
          value={[opacity * 100]}
          max={100}
          step={1}
          onValueChange={(value) => onOpacityChange(value[0] / 100)}
          className="w-full"
        />
      </div>

      <Select value={stylingType} onValueChange={handleStylingTypeChange}>
        <SelectTrigger className="w-full bg-card border-border text-card-foreground focus:ring-ring data-[state=open]:bg-secondary data-[state=open]:border-input">
          <SelectValue placeholder="Select styling type" />
        </SelectTrigger>
        <SelectContent className="dark bg-card border-border z-[10000]">
          <SelectItem
            value="static"
            className="text-card-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
          >
            Static Color
          </SelectItem>
          <SelectItem
            value="chronological"
            className="text-card-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
          >
            Chronological
          </SelectItem>
        </SelectContent>
      </Select>

      {stylingType === "static" && (
        <div className="space-y-3">
          <h5 className="text-xs font-medium text-white">Select Color</h5>
          <div className="w-full grid grid-cols-4 gap-2">
            {colors.map((color) => {
              const isSelected = selectedColor === color.value;
              return (
                <Button
                  key={color.value}
                  variant={isSelected ? "default" : "outline"}
                  className={`w-full h-10 flex flex-col items-center justify-center p-2 ${isSelected ? "text-black" : "text-white"
                    }`}
                  onClick={() => onColorChange(color.value)}
                >
                  <span
                    className={`text-xs ${isSelected ? "text-black" : "text-white"
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
          <h5 className="text-xs font-medium text-white">
            Chronological Coloring
          </h5>
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
    </div>
  );
};

export default Styling;