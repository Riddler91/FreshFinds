/**
 * Static zip code → lat/lng lookup for major US cities.
 * Covers the "Wave 1" and key expansion cities from the business plan.
 */
const ZIP_DB: Record<string, { lat: number; lng: number; city: string; state: string }> = {
  // Austin, TX
  "78701": { lat: 30.2672, lng: -97.7431, city: "Austin", state: "TX" },
  "78702": { lat: 30.2615, lng: -97.7150, city: "Austin", state: "TX" },
  "78703": { lat: 30.2850, lng: -97.7750, city: "Austin", state: "TX" },
  "78704": { lat: 30.2450, lng: -97.7700, city: "Austin", state: "TX" },
  "78705": { lat: 30.2950, lng: -97.7400, city: "Austin", state: "TX" },
  // Nashville, TN
  "37201": { lat: 36.1627, lng: -86.7816, city: "Nashville", state: "TN" },
  "37203": { lat: 36.1525, lng: -86.7887, city: "Nashville", state: "TN" },
  "37204": { lat: 36.1100, lng: -86.7700, city: "Nashville", state: "TN" },
  "37206": { lat: 36.1900, lng: -86.7300, city: "Nashville", state: "TN" },
  "37209": { lat: 36.1700, lng: -86.8600, city: "Nashville", state: "TN" },
  "37211": { lat: 36.0700, lng: -86.7200, city: "Nashville", state: "TN" },
  // Knoxville, TN
  "37902": { lat: 35.9606, lng: -83.9207, city: "Knoxville", state: "TN" },
  "37919": { lat: 35.9200, lng: -84.0000, city: "Knoxville", state: "TN" },
  // Chattanooga, TN
  "37402": { lat: 35.0456, lng: -85.3097, city: "Chattanooga", state: "TN" },
  "37421": { lat: 35.0300, lng: -85.1600, city: "Chattanooga", state: "TN" },
  // Charlotte, NC
  "28202": { lat: 35.2271, lng: -80.8431, city: "Charlotte", state: "NC" },
  "28203": { lat: 35.2100, lng: -80.8600, city: "Charlotte", state: "NC" },
  "28204": { lat: 35.2200, lng: -80.8200, city: "Charlotte", state: "NC" },
  "28205": { lat: 35.2300, lng: -80.7900, city: "Charlotte", state: "NC" },
  "28210": { lat: 35.1300, lng: -80.8300, city: "Charlotte", state: "NC" },
  // Raleigh, NC
  "27601": { lat: 35.7796, lng: -78.6382, city: "Raleigh", state: "NC" },
  "27603": { lat: 35.7200, lng: -78.6500, city: "Raleigh", state: "NC" },
  "27606": { lat: 35.7500, lng: -78.7200, city: "Raleigh", state: "NC" },
  // Asheville, NC
  "28801": { lat: 35.5951, lng: -82.5515, city: "Asheville", state: "NC" },
  "28803": { lat: 35.5400, lng: -82.5200, city: "Asheville", state: "NC" },
  // Charleston, SC
  "29401": { lat: 32.7765, lng: -79.9311, city: "Charleston", state: "SC" },
  "29403": { lat: 32.8000, lng: -79.9500, city: "Charleston", state: "SC" },
  "29407": { lat: 32.7900, lng: -80.0000, city: "Charleston", state: "SC" },
  // Greenville, SC
  "29601": { lat: 34.8526, lng: -82.3940, city: "Greenville", state: "SC" },
  "29607": { lat: 34.8200, lng: -82.3200, city: "Greenville", state: "SC" },
  // Columbia, SC
  "29201": { lat: 34.0007, lng: -81.0348, city: "Columbia", state: "SC" },
  "29205": { lat: 33.9900, lng: -80.9900, city: "Columbia", state: "SC" },
  // Richmond, VA
  "23219": { lat: 37.5407, lng: -77.4360, city: "Richmond", state: "VA" },
  "23220": { lat: 37.5500, lng: -77.4700, city: "Richmond", state: "VA" },
  "23221": { lat: 37.5600, lng: -77.5000, city: "Richmond", state: "VA" },
  // Little Rock, AR
  "72201": { lat: 34.7465, lng: -92.2896, city: "Little Rock", state: "AR" },
  "72202": { lat: 34.7400, lng: -92.2700, city: "Little Rock", state: "AR" },
  // Fayetteville, AR
  "72701": { lat: 36.0626, lng: -94.1574, city: "Fayetteville", state: "AR" },
  "72703": { lat: 36.1000, lng: -94.1300, city: "Fayetteville", state: "AR" },
  // Wichita, KS
  "67202": { lat: 37.6872, lng: -97.3301, city: "Wichita", state: "KS" },
  "67206": { lat: 37.7000, lng: -97.2300, city: "Wichita", state: "KS" },
  // Kansas City (MO side, but close to KS)
  "64101": { lat: 39.0997, lng: -94.5786, city: "Kansas City", state: "MO" },
  "64106": { lat: 39.1000, lng: -94.5700, city: "Kansas City", state: "MO" },
  // Norfolk, VA
  "23510": { lat: 36.8468, lng: -76.2859, city: "Norfolk", state: "VA" },
  "23517": { lat: 36.8700, lng: -76.3000, city: "Norfolk", state: "VA" },
  // Roanoke, VA
  "24011": { lat: 37.2710, lng: -79.9414, city: "Roanoke", state: "VA" },
  "24016": { lat: 37.2700, lng: -79.9400, city: "Roanoke", state: "VA" },
};

/** City-level presets for quick-search buttons */
export const CITY_PRESETS = [
  { label: "Austin, TX", zip: "78701", lat: 30.2672, lng: -97.7431 },
  { label: "Nashville, TN", zip: "37203", lat: 36.1525, lng: -86.7887 },
  { label: "Charlotte, NC", zip: "28202", lat: 35.2271, lng: -80.8431 },
  { label: "Charleston, SC", zip: "29401", lat: 32.7765, lng: -79.9311 },
  { label: "Richmond, VA", zip: "23219", lat: 37.5407, lng: -77.4360 },
  { label: "Knoxville, TN", zip: "37902", lat: 35.9606, lng: -83.9207 },
  { label: "Raleigh, NC", zip: "27601", lat: 35.7796, lng: -78.6382 },
  { label: "Greenville, SC", zip: "29601", lat: 34.8526, lng: -82.3940 },
];

export interface GeocodeResult {
  lat: number;
  lng: number;
  city: string;
  state: string;
  displayName: string;
}

/** Try static lookup first, then fall back to Nominatim */
export async function geocodeZip(zip: string): Promise<GeocodeResult | null> {
  const cleaned = zip.trim().slice(0, 5);
  
  // Static lookup
  const entry = ZIP_DB[cleaned];
  if (entry) {
    return {
      lat: entry.lat,
      lng: entry.lng,
      city: entry.city,
      state: entry.state,
      displayName: `${entry.city}, ${entry.state} ${cleaned}`,
    };
  }

  // Fallback: Nominatim (OpenStreetMap)
  try {
    const url = `https://nominatim.openstreetmap.org/search?postalcode=${encodeURIComponent(cleaned)}&country=US&format=json&limit=1`;
    const res = await fetch(url, { headers: { "User-Agent": "FreshFinds/1.0" } });
    const data = await res.json();
    if (data.length > 0) {
      const r = data[0];
      const city = r.address?.city || r.address?.town || r.address?.county || "";
      const state = r.address?.state || "";
      return {
        lat: parseFloat(r.lat),
        lng: parseFloat(r.lon),
        city,
        state,
        displayName: `${city}, ${state} ${cleaned}`,
      };
    }
  } catch {
    // Nominatim unreachable — return null
  }

  return null;
}
