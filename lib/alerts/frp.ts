import type { AlertLevel } from "./types";

/**
 * Maps Fire Radiative Power (MW) to display level.
 * Used by INPE daily and NASA FIRMS (both expose FRP).
 */
export function frpToLevel(frp: number | null | undefined): AlertLevel {
  if (frp == null || Number.isNaN(frp)) return "medio";
  if (frp >= 80) return "critico";
  if (frp >= 35) return "alto";
  if (frp >= 12) return "medio";
  return "baixo";
}

/** Fallback when FRP is missing — VIIRS bright_ti4 (Kelvin). */
export function brightnessToLevel(
  bright: number | null | undefined,
): AlertLevel {
  if (bright == null || Number.isNaN(bright)) return "medio";
  if (bright >= 360) return "critico";
  if (bright >= 340) return "alto";
  if (bright >= 320) return "medio";
  return "baixo";
}

export function resolveFireLevel(options: {
  frp?: number | null;
  brightness?: number | null;
}): AlertLevel {
  if (options.frp != null && !Number.isNaN(options.frp)) {
    return frpToLevel(options.frp);
  }
  return brightnessToLevel(options.brightness);
}
