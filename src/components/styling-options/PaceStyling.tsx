import { MAX_SPEED, MIN_SPEED } from "@/utils/paceUtils";

const PaceStyling: React.FC = () => {
  const MID_SPEED = (MAX_SPEED + MIN_SPEED) / 2;
  const getPace = (speed: number): string => {
    const seconds = 3600 / speed;
    return new Date(seconds * 1000).toISOString().substring(14, 14 + 5).replace(/^0+/, '');
  }

  return (
    <div className="space-y-3">
      <div className="relative flex flex-col items-center">
        <div
          className="w-4/5 h-[4px] rounded-full"
          style={{
            background:
              "linear-gradient(to right, #8000ff, #0080ff, #00ffff, #00ff00, #ffff00, #ff8000, #ff0000, #ff00c0)",
          }}
        />
        {/* Speed markers */}
        <div className="relative w-4/5 mt-2 h-8">
          {[MIN_SPEED, MID_SPEED, MAX_SPEED].map((speed, index) => {
            const leftPercent = (index / 2) * 100;
            return (
              <div
                key={speed}
                className="absolute transform -translate-x-1/2"
                style={{ left: `${leftPercent}%` }}
              >
                <div className="w-0.5 h-2 bg-gray-400 mx-auto"></div>
                <div className="text-xs text-gray-400 mt-0.5 whitespace-nowrap">
                  {speed}km/h
                </div>
                <div className="text-xs text-gray-500 mt-0.5 whitespace-nowrap">
                  {getPace(speed)}min/km
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PaceStyling;
