const PaceStyling: React.FC = () => {
  return (
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
  );
};

export default PaceStyling;
