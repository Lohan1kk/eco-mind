/** Approximate bounding box for Brazil (includes northern Amazon). */
export function isInBrazil(lat: number, lng: number): boolean {
  return lat >= -33.75 && lat <= 5.27 && lng >= -74.0 && lng <= -34.0;
}

/** FIRMS area API order: south, west, north, east */
export const BRAZIL_BBOX_FIRMS = "-33.75,-74.0,5.27,-34.0";

/** World view for the fire map. */
export const WORLD_CENTER: [number, number] = [10, 5];
export const WORLD_DEFAULT_ZOOM = 2;
