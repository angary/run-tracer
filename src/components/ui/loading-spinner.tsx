import { Loader2 } from "lucide-react";

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background dark">
      <Loader2 className="h-10 w-10 animate-spin text-white" />
    </div>
  );
};

export default LoadingSpinner;
