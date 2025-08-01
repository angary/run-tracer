import { Button } from "@/components/ui/button";

interface StaticStylingProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
}

const colors = [
  { name: "Red", value: "#ff0000" },
  { name: "Green", value: "#00ff00" },
  { name: "Blue", value: "#0066ff" },
  { name: "Yellow", value: "#ffff00" },
];

const StaticStyling: React.FC<StaticStylingProps> = ({
  selectedColor,
  onColorChange,
}) => {
  return (
    <div className="space-y-3">
      <div className="w-full grid grid-cols-4 gap-2">
        {colors.map((color) => {
          const isSelected = selectedColor === color.value;
          return (
            <Button
              key={color.value}
              variant={isSelected ? "default" : "outline"}
              className={`w-full h-10 flex flex-col items-center justify-center p-2 text-xs ${isSelected ? "text-black" : "text-white"
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
  );
};

export default StaticStyling;
