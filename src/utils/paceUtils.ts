import type { Activity } from "@/types";

/**
 * Converts HSL color values to hex format
 * @param h Hue (0-360)
 * @param s Saturation (0-100)
 * @param l Lightness (0-100)
 * @returns Hex color string
 */
function hslToHex(h: number, s: number, l: number): string {
  const hDecimal = l / 100;
  const a = (s * Math.min(hDecimal, 1 - hDecimal)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = hDecimal - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

/**
 * Calculate speed in kilometers per hour
 * @param activity - The activity object containing distance and moving_time
 * @returns speed in km/h
 */
export function calculateSpeed(activity: Activity): number {
  // distance is in meters, moving_time is in seconds
  if (activity.moving_time === 0) return 0;
  
  // Convert to km/h: (meters/second) * 3.6
  const speedKmh = (activity.distance / activity.moving_time) * 3.6;
  
  return speedKmh;
}

/**
 * Get color based on speed using HSV color wheel
 * Blue (240°) for slow speeds to Violet (300°) for fast speeds
 * @param speed - speed in km/h
 * @returns hex color string
 */
export function getSpeedColor(speed: number): string {
  // Clamp speed between 10 and 17 km/h for color calculation
  const clampedSpeed = Math.max(10, Math.min(17, speed));
  
  // Normalize to 0-1 range (0 = slow/10kmh, 1 = fast/17kmh)
  const normalized = (clampedSpeed - 10) / (17 - 10);
  
  // Map to HSV hues: 240° (blue) for slow to 300° (violet) for fast
  // Going through: blue (240°) -> cyan (180°) -> green (120°) -> yellow (60°) -> red (0°) -> violet (300°)
  // We need to go backwards through the color wheel, then forward to violet
  let hue;
  if (normalized <= 0.8) {
    // Blue to red: 240° down to 0°
    hue = 240 - (normalized / 0.8) * 240;
  } else {
    // Red to violet: 0° to 300° (going the long way around)
    const factor = (normalized - 0.8) / 0.2;
    hue = 360 - (60 * factor); // 360° to 300°
  }
  
  return hslToHex(hue, 100, 50);
}
