/** Approximate bounding box for Brazil (Amazon + Noronha). */
export function isInBrazil(lat: number, lng: number): boolean {
  // East bound −32° includes Fernando de Noronha (~−32.4°); west covers Amazon.
  return lat >= -33.75 && lat <= 5.27 && lng >= -74.0 && lng <= -32.0;
}

/** FIRMS area API order: south, west, north, east */
export const BRAZIL_BBOX_FIRMS = "-33.75,-74.0,5.27,-32.0";

/** World view for the fire map. */
export const WORLD_CENTER: [number, number] = [10, 5];
export const WORLD_DEFAULT_ZOOM = 2;
