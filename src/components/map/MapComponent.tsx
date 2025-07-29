import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { Activity } from "@/types";
import { Polyline } from "react-leaflet";
import polyline from "@mapbox/polyline";
import { LatLng } from "leaflet";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { getRainbowColor } from "../../utils/colorUtils";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Settings, X } from "lucide-react";
import Styling from "../Styling";

interface MapComponentProps {
  activities: Activity[];
}

const MapComponent: React.FC<MapComponentProps> = ({ activities }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#ff0000ff");
  const [stylingType, setStylingType] = useState("static");
  const [opacity, setOpacity] = useState(0.5);

  // Currently set to Sydney
  const defaultCenter: [number, number] = [-33.85, 151.15];

  const activitiesWithPolylines = activities.filter(
    (a) => a.map?.summary_polyline?.length > 0
  );
  const positions = activitiesWithPolylines.map((a) =>
    polyline.decode(a.map.summary_polyline).map((l) => new LatLng(l[0], l[1]))
  );

  return (
    <div className="relative h-screen w-full">
      <MapContainer
        center={defaultCenter}
        zoom={12.5}
        zoomDelta={0.5}
        zoomSnap={0.25}
        wheelPxPerZoomLevel={40}
        style={{ height: "100vh", width: "100%" }}
        attributionControl={false} // Show leaflet icon
        zoomControl={false} // Show zoom buttons
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png" />
        {positions.map((position, index) => {
          const color =
            stylingType === "chronological"
              ? getRainbowColor(index / (activitiesWithPolylines.length - 1))
              : selectedColor;

          return (
            <Polyline
              key={index}
              pathOptions={{ color, opacity }}
              positions={position}
            />
          );
        })}
      </MapContainer>

      <div className="z-[9999] relative">
        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <DrawerTrigger asChild>
            <Button
              className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-[1000] bg-dark/20 backdrop-blur-[2px]"
              size="lg"
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </DrawerTrigger>
          <DrawerContent className="!z-[9999] dark bg-dark/20 border-border backdrop-blur-[6px]">
            <div className="p-4 flex flex-col items-center relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDrawerOpen(false)}
                className="absolute top-2 right-2"
              >
                <X className="h-4 w-4" />
              </Button>
              <Styling
                selectedColor={selectedColor}
                onColorChange={setSelectedColor}
                stylingType={stylingType}
                onStylingTypeChange={setStylingType}
                opacity={opacity}
                onOpacityChange={setOpacity}
              />
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
};

export default MapComponent;
