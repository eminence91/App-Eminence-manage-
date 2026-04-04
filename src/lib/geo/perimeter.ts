/**
 * Earth's mean radius in meters.
 */
const EARTH_RADIUS_M = 6_371_000;

/**
 * Convert degrees to radians.
 */
function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Calculate the distance in meters between two coordinates using the Haversine formula.
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_M * c;
}

/**
 * Check whether an agent's position is within the allowed perimeter of a site.
 *
 * @param agentLat  Agent latitude
 * @param agentLng  Agent longitude
 * @param siteLat   Site latitude
 * @param siteLng   Site longitude
 * @param radiusMeters  Allowed radius in meters
 * @returns true if the agent is within the perimeter
 */
export function isWithinPerimeter(
  agentLat: number,
  agentLng: number,
  siteLat: number,
  siteLng: number,
  radiusMeters: number
): boolean {
  const distance = calculateDistance(agentLat, agentLng, siteLat, siteLng);
  return distance <= radiusMeters;
}
