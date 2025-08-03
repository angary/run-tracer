import React, { useEffect, useState, useRef } from "react";
import { Polyline, useMapEvents } from "react-leaflet";
import { LatLng } from "leaflet";
import type { Activity } from "@/types";

interface AnimatedMarkerProps {
  positions: LatLng[];
  activity: Activity;
  speed: number;
  color: string;
  trailLength: number;
}

interface TrailPoint {
  position: LatLng;
  index: number;
}

const AnimatedMarker: React.FC<AnimatedMarkerProps> = ({
  positions,
  activity,
  speed,
  color,
  trailLength,
}) => {
  const [currentPosition, setCurrentPosition] = useState<LatLng | null>(
    positions.length > 0 ? positions[0] : null
  );
  const [trail, setTrail] = useState<TrailPoint[]>([]);
  const [isZooming, setIsZooming] = useState(false);
  const animationFrameIdRef = useRef<number>(undefined);
  const lastUpdateTimeRef = useRef<number>(0);
  const currentIndexRef = useRef(0);
  const numSegments = Math.floor(trailLength / 2);

  // Handle map zoom events to pause/resume animation
  useMapEvents({
    zoomstart: () => setIsZooming(true),
    zoomend: () => setIsZooming(false),
  });

  useEffect(() => {
    // Stop animation when zooming or if there are no positions
    if (isZooming || positions.length === 0) {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = undefined;
      }
      return;
    }

    // Calculate animation interval based on activity moving time and speed
    const baseDuration = activity.moving_time * 1000; // Convert to milliseconds
    const animationDuration = baseDuration / speed;
    const intervalTime = animationDuration / positions.length;

    const animate = (timestamp: number) => {
      if (lastUpdateTimeRef.current === 0) {
        lastUpdateTimeRef.current = timestamp;
      }

      const deltaTime = timestamp - lastUpdateTimeRef.current;

      // Advance animation frame if enough time has passed
      if (deltaTime >= intervalTime) {
        currentIndexRef.current =
          (currentIndexRef.current + 1) % positions.length;
        const newPosition = positions[currentIndexRef.current];
        setCurrentPosition(newPosition);

        // Update trail
        setTrail(() => {
          const newTrail: TrailPoint[] = [];
          // Calculate the actual span in terms of indices for each segment
          const segmentSpan = Math.max(1, Math.floor(trailLength / numSegments));

          for (let i = 0; i < numSegments; i++) {
            const trailIndex = currentIndexRef.current - (i * segmentSpan);
            if (trailIndex >= 0) {
              newTrail.unshift({ position: positions[trailIndex], index: trailIndex });
            } else {
              // If we go beyond the start of the current activity, stop adding segments
              break;
            }
          }
          return newTrail;
        });

        // Update the last update time
        lastUpdateTimeRef.current = timestamp;
      }

      // Request the next frame
      animationFrameIdRef.current = requestAnimationFrame(animate);
    };

    // Start the animation loop
    animationFrameIdRef.current = requestAnimationFrame(animate);

    // Cleanup function to cancel animation frame
    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      // Reset time for the next effect run
      lastUpdateTimeRef.current = 0;
    };
  }, [positions, activity.moving_time, speed, isZooming, trailLength]);

  if (!currentPosition || positions.length === 0 || isZooming) {
    return null;
  }

  // Create fading trail with individual segments
  const trailPositions = trail.map((point) => point.position);

  const trailLayers = [];
  if (trailPositions.length > 1) {
    // Create individual segments between consecutive points
    for (let i = 0; i < trailPositions.length - 1; i++) {
      const segmentPositions = [trailPositions[i], trailPositions[i + 1]];

      // Calculate opacity based on position in trail (0 = oldest, 1 = newest)
      const opacity = i / (numSegments - 1);

      trailLayers.push(
        <Polyline
          key={`trail-segment-${i}`}
          positions={segmentPositions}
          pathOptions={{
            color: color,
            opacity: opacity * 0.8,
            weight: 3,
            lineCap: "butt",
            lineJoin: "round",
          }}
        />
      );
    }
  }

  return <>{trailLayers}</>;
};

export default React.memo(AnimatedMarker);