import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { Activity, StylingType } from "@/types";
import { Polyline } from "react-leaflet";
import polyline from "@mapbox/polyline";
import { LatLng } from "leaflet";
import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { getRainbowColor } from "../utils/colorUtils";
import { calculateSpeed, getSpeedColor } from "../utils/paceUtils";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Settings } from "lucide-react";
import Styling from "./Styling";
import AnimatedMarker from "./AnimatedMarker";
import { getPreprocessedRoute } from "../utils/routePreprocessing";

interface MapProps {
  allActivities: Activity[];
}

const Map: React.FC<MapProps> = ({ allActivities }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#ff0000ff");
  const [stylingType, setStylingType] = useState<StylingType>("static");
  const [opacity, setOpacity] = useState(0.5);
  const [liveMode, setLiveMode] = useState(false);
  const [speed, setSpeed] = useState(100);

  const activities = allActivities.filter(
    (a) => a.map?.summary_polyline?.length > 0
  );

  const getColor = (
    stylingType: StylingType,
    activity: Activity,
    index: number
  ): string => {
    switch (stylingType) {
      case "static":
        return selectedColor;
      case "chronological":
        return getRainbowColor(index / (activities.length - 1));
      case "pace":
        return getSpeedColor(calculateSpeed(activity));
    }
  };

  // Memoize route processing to cache results and avoid recalculating
  const { positions, preprocessedPositions } = useMemo(() => {
    const originalPositions = activities.map((a) =>
      polyline.decode(a.map.summary_polyline).map((l) => new LatLng(l[0], l[1]))
    );

    const preprocessed = activities.map((a) =>
      getPreprocessedRoute(a.map.summary_polyline)
    );

    return {
      positions: originalPositions,
      preprocessedPositions: preprocessed,
    };
  }, [activities]);

  // Memoize color calculations to avoid recalculating on every render
  const colors = useMemo(() => {
    return activities.map((activity, index) =>
      getColor(stylingType, activity, index)
    );
  }, [activities, stylingType, selectedColor]);

  // Keyboard event listener for toggling live mode with 'l' key
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "l") {
        setLiveMode((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  return (
    <div className="relative h-screen w-screen">
      <MapContainer
        center={[-33.85, 151.15]} // Currently set to Sydney
        zoom={12.5}
        zoomDelta={0.5}
        zoomSnap={0}
        wheelPxPerZoomLevel={10}
        style={{ height: "100vh", width: "100vw" }}
        attributionControl={false}
        zoomControl={false}
        preferCanvas={true}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png"
          maxZoom={19}
          maxNativeZoom={18}
          keepBuffer={4}
          updateWhenZooming={true}
          updateWhenIdle={true}
          crossOrigin={true}
          detectRetina={true}
          subdomains={["a", "b", "c"]}
        />
        {positions.map((position, index) => (
          <Polyline
            key={index}
            pathOptions={{
              color: colors[index],
              opacity: liveMode ? opacity * 0.5 : opacity,
            }}
            positions={position}
          />
        ))}

        {liveMode &&
          preprocessedPositions.map((position, index) => (
            <AnimatedMarker
              key={`animated-${index}`}
              positions={position}
              activity={activities[index]}
              speed={speed}
              color={colors[index]}
            />
          ))}
      </MapContainer>

      <div className="z-[9999] relative">
        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <DrawerTrigger asChild>
            <Button
              className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 z-[1000] bg-dark/20 backdrop-blur-[2px] mb-safe ${
                isDrawerOpen ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
              style={{ bottom: "max(1rem, env(safe-area-inset-bottom))" }}
              size="lg"
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </DrawerTrigger>
          <DrawerContent className="!z-[9999] dark bg-dark/20 border-border backdrop-blur-[5px] max-w-xl mx-auto">
            <div className="p-4 flex flex-col items-stretch relative overflow-x-auto max-w-full w-full">
              <Styling
                selectedColor={selectedColor}
                onColorChange={setSelectedColor}
                stylingType={stylingType}
                onStylingTypeChange={setStylingType}
                opacity={opacity}
                onOpacityChange={setOpacity}
                liveMode={liveMode}
                onLiveModeChange={setLiveMode}
                speed={speed}
                onSpeedChange={setSpeed}
              />
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
};

export default Map;
