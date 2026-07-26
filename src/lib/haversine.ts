/** Haversine distance in miles between two [lat, lng] points */
export function haversineMi(a: [number, number], b: [number, number]): number {
  const R = 3959; // Earth radius in miles
  const dLat = ((b[0] - a[0]) * Math.PI) / 180;
  const dLon = ((b[1] - a[1]) * Math.PI) / 180;
  const lat1 = (a[0] * Math.PI) / 180;
  const lat2 = (b[0] * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

/** Same as haversineMi but returns km (for compatibility with existing map page) */
export function haversineKm(a: [number, number], b: [number, number]): number {
  return haversineMi(a, b) * 1.60934;
}
