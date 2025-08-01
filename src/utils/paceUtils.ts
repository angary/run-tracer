import type { Activity } from "@/types";
import { hslToHex } from "./colorUtils";

export const MAX_SPEED = 16; // km/h
export const MIN_SPEED = 10; // km/h

/**
 * Calculate speed in kilometers per hour
 * @param activity - The activity object containing distance and moving_time
 * @returns speed in km/h
 */
export function calculateSpeed(activity: Activity): number {
  // distance is in meters, moving_time is in seconds
  if (activity.moving_time === 0) return 0;

  // Convert to km/h: (meters/second) * 3.6
  return (activity.distance / activity.moving_time) * 3.6;
}

/**
 * Get color based on speed. The color is calculated by interpolating between hue values
 * on the HSL color wheel. This implementation creates a gradient from purple to red, and
 * then to a reddish-violet for the highest speeds.
 * @param speed - speed in km/h
 * @returns hex color string
 */
export function getSpeedColor(speed: number): string {
  const clampedSpeed = Math.max(MIN_SPEED, Math.min(MAX_SPEED, speed));
  const normalized = (clampedSpeed - MIN_SPEED) / (MAX_SPEED - MIN_SPEED);

  // A single linear interpolation for the hue.
  // Starts at purple (270°), moves through red (at the 0.8 mark),
  // and ends at a reddish-violet (~293°).
  const hue = 270 - (270 / 0.8) * normalized;

  return hslToHex(hue, 100, 50);
}
