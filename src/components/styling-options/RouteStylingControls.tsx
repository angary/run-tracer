import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import type { StylingType } from "@/types";
import StaticStyling from "./StaticStyling";
import ChronologicalStyling from "./ChronologicalStyling";
import PaceStyling from "./PaceStyling";

interface RouteStylingControlsProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
  stylingType: StylingType;
  onStylingTypeChange: (type: StylingType) => void;
  opacity: number;
  onOpacityChange: (opacity: number) => void;
}

const selectItemClassName = "text-xs text-card-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground";

const RouteStylingControls: React.FC<RouteStylingControlsProps> = ({
  selectedColor,
  onColorChange,
  stylingType,
  onStylingTypeChange,
  opacity,
  onOpacityChange,
}) => {
  const handleStylingTypeChange = (type: string) => {
    onStylingTypeChange(type as StylingType);
  };

  // Render the appropriate styling component based on current type
  const renderStylingOptions = () => {
    switch (stylingType) {
      case "static":
        return (
          <StaticStyling
            selectedColor={selectedColor}
            onColorChange={onColorChange}
          />
        );
      case "chronological":
        return <ChronologicalStyling />;
      case "pace":
        return <PaceStyling />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-white">Route styling</h4>
      <div className="space-y-3">
        <h5 className="text-xs font-medium text-white">
          Opacity <span className="text-gray-400">({(opacity * 100).toFixed(0)}%)</span>
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
            <SelectItem value="static" className={selectItemClassName}>
              Static Color
            </SelectItem>
            <SelectItem value="chronological" className={selectItemClassName}>
              Chronological
            </SelectItem>
            <SelectItem value="pace" className={selectItemClassName}>
              Speed
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {renderStylingOptions()}
    </div>
  );
};

export default RouteStylingControls;
