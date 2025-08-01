const ChronologicalStyling: React.FC = () => {
  return (
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
  );
};

export default ChronologicalStyling;
