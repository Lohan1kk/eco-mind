import L from "leaflet";
import { LEVEL_META } from "@/lib/alerts/levels";
import type { AlertLevel } from "@/lib/alerts/types";

const iconCache = new Map<string, L.DivIcon>();

/** Larger visual + invisible hit pad for finger taps on mobile. */
export function createPinIcon(
  level: AlertLevel,
  options?: { selected?: boolean },
): L.DivIcon {
  const selected = Boolean(options?.selected);
  const cacheKey = `${level}-${selected ? "sel" : "def"}`;
  const cached = iconCache.get(cacheKey);
  if (cached) return cached;

  const color = LEVEL_META[level].color;
  const size = selected ? 28 : 22;
  const hit = 44; // Apple HIG minimum touch target
  const offset = (hit - size) / 2;

  const icon = L.divIcon({
    className: "fire-pin-icon",
    html: `<div style="width:${hit}px;height:${hit}px;display:flex;align-items:center;justify-content:center;">
      <div style="background:${color};width:${size}px;height:${size}px;border-radius:50%;border:2.5px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.4);${selected ? "outline:3px solid rgba(220,38,38,0.45);" : ""}"></div>
    </div>`,
    iconSize: [hit, hit],
    iconAnchor: [hit / 2, hit / 2],
    popupAnchor: [0, -(offset + size / 2)],
  });

  iconCache.set(cacheKey, icon);
  return icon;
}
