import polyline from "@mapbox/polyline";
import { LatLng } from "leaflet";

// Easily adjustable target distance for resampling
export const RESAMPLE_DISTANCE = 15; // meters

/**
 * Calculate distance between two GPS coordinates using Haversine formula
 */
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000; // Earth's radius in meters
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Linear interpolation between two GPS points
 */
function interpolatePoint(
  point1: LatLng,
  point2: LatLng,
  distanceFromPoint1: number,
  totalSegmentDistance: number
): LatLng {
  const ratio = distanceFromPoint1 / totalSegmentDistance;

  const lat = point1.lat + (point2.lat - point1.lat) * ratio;
  const lng = point1.lng + (point2.lng - point1.lng) * ratio;

  return new LatLng(lat, lng);
}

/**
 * Preprocess route by resampling at uniform distance intervals
 */
export function preprocessRoute(
  encodedPolyline: string,
  targetDistance: number = RESAMPLE_DISTANCE
): LatLng[] {
  // Decode polyline to get original points
  const decodedPoints = polyline.decode(encodedPolyline);
  const originalPositions = decodedPoints.map(([lat, lng]) => new LatLng(lat, lng));

  if (originalPositions.length < 2) {
    return originalPositions;
  }

  // Calculate cumulative distances along the route
  const cumulativeDistances: number[] = [0];
  let totalDistance = 0;

  for (let i = 1; i < originalPositions.length; i++) {
    const prev = originalPositions[i - 1];
    const curr = originalPositions[i];
    const segmentDistance = calculateDistance(prev.lat, prev.lng, curr.lat, curr.lng);
    totalDistance += segmentDistance;
    cumulativeDistances.push(totalDistance);
  }



  // Generate new points at uniform distance intervals
  const resampledPositions: LatLng[] = [originalPositions[0]]; // Always include start point
  let currentTargetDistance = targetDistance;

  for (let i = 1; i < originalPositions.length; i++) {
    const segmentStart = originalPositions[i - 1];
    const segmentEnd = originalPositions[i];
    const segmentStartDistance = cumulativeDistances[i - 1];
    const segmentEndDistance = cumulativeDistances[i];
    const segmentLength = segmentEndDistance - segmentStartDistance;

    // Add points at target intervals within this segment
    while (currentTargetDistance <= segmentEndDistance) {
      const distanceFromSegmentStart = currentTargetDistance - segmentStartDistance;

      if (distanceFromSegmentStart > 0 && distanceFromSegmentStart < segmentLength) {
        const interpolatedPoint = interpolatePoint(
          segmentStart,
          segmentEnd,
          distanceFromSegmentStart,
          segmentLength
        );
        resampledPositions.push(interpolatedPoint);
      }

      currentTargetDistance += targetDistance;
    }
  }

  // Always include the end point if it's not already very close to the last added point
  const lastPoint = originalPositions[originalPositions.length - 1];
  const lastAddedPoint = resampledPositions[resampledPositions.length - 1];
  const distanceToEnd = calculateDistance(
    lastAddedPoint.lat, lastAddedPoint.lng,
    lastPoint.lat, lastPoint.lng
  );

  if (distanceToEnd > targetDistance / 4) { // Add end point if it's > 25% of target distance away
    resampledPositions.push(lastPoint);
  }

  return resampledPositions;
}

// Cache for preprocessed routes
const routeCache = new Map<string, LatLng[]>();

/**
 * Get preprocessed route with caching
 */
export function getPreprocessedRoute(
  encodedPolyline: string,
  targetDistance: number = RESAMPLE_DISTANCE
): LatLng[] {
  const cacheKey = `${encodedPolyline}-${targetDistance}`;

  if (routeCache.has(cacheKey)) {
    return routeCache.get(cacheKey)!;
  }

  const preprocessedRoute = preprocessRoute(encodedPolyline, targetDistance);
  routeCache.set(cacheKey, preprocessedRoute);

  return preprocessedRoute;
}

/**
 * Clear the route cache (useful for memory management)
 */
export function clearRouteCache(): void {
  routeCache.clear();
}
