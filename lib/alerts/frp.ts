import type { AlertLevel } from "./types";

/**
 * Maps Fire Radiative Power (MW) to display level.
 * Thresholds aligned with typical VIIRS/MODIS FRP distributions
 * (most detections are low-power; high FRP is rarer).
 *
 * Missing/invalid FRP must NOT become "médio" — that overstates intensity.
 */
export function frpToLevel(frp: number | null | undefined): AlertLevel {
  if (frp == null || Number.isNaN(frp) || frp < 0) return "baixo";
  if (frp >= 100) return "critico";
  if (frp >= 40) return "alto";
  if (frp >= 15) return "medio";
  return "baixo";
}

/** Fallback when FRP is missing — VIIRS bright_ti4 (Kelvin). */
export function brightnessToLevel(
  bright: number | null | undefined,
): AlertLevel {
  if (bright == null || Number.isNaN(bright) || bright <= 0) return "baixo";
  if (bright >= 360) return "critico";
  if (bright >= 340) return "alto";
  if (bright >= 320) return "medio";
  return "baixo";
}

export function resolveFireLevel(options: {
  frp?: number | null;
  brightness?: number | null;
}): AlertLevel {
  if (options.frp != null && !Number.isNaN(options.frp) && options.frp >= 0) {
    return frpToLevel(options.frp);
  }
  return brightnessToLevel(options.brightness);
}
