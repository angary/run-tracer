import { Button } from "@/components/ui/button";

interface ColorPickerProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
}

const colors = [
  { name: "Red", value: "#ff0000ff" },
  { name: "Blue", value: "#3e48ffff" },
  { name: "Green", value: "#00ff00ff" },
  { name: "Purple", value: "#6f32ffff" },
  { name: "Orange", value: "#ff6a00ff" },
  { name: "Pink", value: "#ff0095ff" },
  { name: "Yellow", value: "#ffff00ff" },
  { name: "Cyan", value: "#00ffffff" },
];

const ColorPicker: React.FC<ColorPickerProps> = ({
  selectedColor,
  onColorChange,
}) => {
  return (
    <div className="space-y-4 text-center">
      <h4 className="text-sm font-medium text-white">Polyline Color</h4>
      <div className="grid grid-cols-4 gap-2">
        {colors.map((color) => {
          const isSelected = selectedColor === color.value;
          return (
            <Button
              key={color.value}
              variant={isSelected ? "default" : "outline"}
              className={`h-10 flex flex-col items-center justify-center p-2 ${
                isSelected ? "text-black" : "text-white"
              }`}
              onClick={() => onColorChange(color.value)}
            >
              <div
                className="w-4 h-4 rounded-full mb-1 border border-border"
                style={{ backgroundColor: color.value }}
              />
              <span
                className={`text-xs ${
                  isSelected ? "text-black" : "text-white"
                }`}
              >
                {color.name}
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default ColorPicker;
