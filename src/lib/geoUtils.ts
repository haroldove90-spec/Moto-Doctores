/**
 * Haversine Formula: Calculates the distance between two points on the Earth's surface
 * (given their latitude and longitude) in kilometers.
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
}

/**
 * Finds the nearest doctor within a specified radius (default 10km).
 */
export function findNearestDoctor(
  patientLat: number,
  patientLon: number,
  doctors: Array<{ id: string; lat: number; lon: number; name: string }>
) {
  const MAX_RADIUS_KM = 10;
  let nearestDoctor = null;
  let minDistance = Infinity;

  for (const doctor of doctors) {
    const distance = calculateDistance(
      patientLat,
      patientLon,
      doctor.lat,
      doctor.lon
    );

    if (distance <= MAX_RADIUS_KM && distance < minDistance) {
      minDistance = distance;
      nearestDoctor = { ...doctor, distance: Math.round(distance * 100) / 100 };
    }
  }

  return nearestDoctor;
}
