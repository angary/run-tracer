import { useEffect, useState, useRef } from "react";
import { Polyline, useMapEvents } from "react-leaflet";
import { LatLng } from "leaflet";
import type { Activity } from "@/types";

interface AnimatedMarkerProps {
  positions: LatLng[];
  activity: Activity;
  speed?: number; // Speed multiplier for animation (default: 1)
  color?: string; // Color of the marker to match the polyline
}

interface TrailPoint {
  position: LatLng;
  index: number;
}

const AnimatedMarker: React.FC<AnimatedMarkerProps> = ({ 
  positions, 
  activity, 
  speed = 1,
  color = "#ffffff"
}) => {
  const [currentPosition, setCurrentPosition] = useState<LatLng | null>(
    positions.length > 0 ? positions[0] : null
  );
  const [trail, setTrail] = useState<TrailPoint[]>([]);
  const [isZooming, setIsZooming] = useState(false);
  const animationRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const currentIndexRef = useRef(0);
  const TRAIL_LENGTH = 40; // Number of trail segments

  // Handle map zoom events to pause/resume animation
  useMapEvents({
    zoomstart: () => {
      setIsZooming(true);
      // Pause animation but keep current position
      if (animationRef.current) {
        clearInterval(animationRef.current);
        animationRef.current = undefined;
      }
    },
    zoomend: () => {
      setIsZooming(false);
      // Animation will resume in the effect below
    },
  });

  useEffect(() => {
    if (positions.length === 0 || isZooming) return;

    // Calculate animation duration based on activity moving time and speed
    // Base the animation on the actual activity duration, scaled by speed
    const baseDuration = activity.moving_time * 1000; // Convert to milliseconds
    const animationDuration = baseDuration / speed;
    const intervalTime = animationDuration / positions.length;
    
    const animate = () => {
      currentIndexRef.current = (currentIndexRef.current + 1) % positions.length;
      const newPosition = positions[currentIndexRef.current];
      setCurrentPosition(newPosition);
      
      // Update trail
      setTrail(prevTrail => {
        // If we're restarting at the beginning, clear the trail completely
        if (currentIndexRef.current === 0) {
          return [];
        }
        
        const newTrail = [...prevTrail, { position: newPosition, index: currentIndexRef.current }];
        // Keep only the last TRAIL_LENGTH points
        return newTrail.slice(-TRAIL_LENGTH);
      });
    };

    // Start the animation
    const interval = setInterval(animate, intervalTime);
    animationRef.current = interval;

    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    };
  }, [positions, activity.moving_time, speed, isZooming]);

  if (!currentPosition || positions.length === 0 || isZooming) {
    return null;
  }

  // Create fading trail with individual segments
  const trailPositions = trail.map(point => point.position);
  
  const trailLayers = [];
  if (trailPositions.length > 1) {
    // Create individual segments between consecutive points
    for (let i = 0; i < trailPositions.length - 1; i++) {
      const segmentPositions = [trailPositions[i], trailPositions[i + 1]];
      
      // Calculate opacity based on position in trail (0 = oldest, 1 = newest)
      const opacity = i / (trailPositions.length - 1);
      
      trailLayers.push(
        <Polyline
          key={`trail-segment-${i}`}
          positions={segmentPositions}
          pathOptions={{
            color: color,
            opacity: opacity * 0.8,
            weight: 3.5,
            lineCap: "butt",
            lineJoin: "round",
          }}
        />
      );
    }
  }

  return (
    <>
      {trailLayers}
    </>
  );
};

export default AnimatedMarker;
