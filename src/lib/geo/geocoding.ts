const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

interface GeocodingResult {
  lat: number;
  lng: number;
  formatted_address: string;
}

/**
 * Geocode an address string to lat/lng coordinates using Google Maps Geocoding API.
 */
export async function geocodeAddress(
  address: string
): Promise<GeocodingResult | null> {
  if (!GOOGLE_MAPS_API_KEY) {
    console.error('Google Maps API key is not configured.');
    return null;
  }

  const encodedAddress = encodeURIComponent(address);
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${GOOGLE_MAPS_API_KEY}&region=fr&language=fr`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK' && data.results.length > 0) {
      const result = data.results[0];
      return {
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng,
        formatted_address: result.formatted_address,
      };
    }

    console.warn(`Geocoding failed for "${address}": ${data.status}`);
    return null;
  } catch (error) {
    console.error('Geocoding request failed:', error);
    return null;
  }
}

/**
 * Reverse geocode lat/lng coordinates to a human-readable address.
 */
export async function reverseGeocode(
  lat: number,
  lng: number
): Promise<string | null> {
  if (!GOOGLE_MAPS_API_KEY) {
    console.error('Google Maps API key is not configured.');
    return null;
  }

  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}&language=fr`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK' && data.results.length > 0) {
      return data.results[0].formatted_address;
    }

    console.warn(`Reverse geocoding failed for (${lat}, ${lng}): ${data.status}`);
    return null;
  } catch (error) {
    console.error('Reverse geocoding request failed:', error);
    return null;
  }
}
