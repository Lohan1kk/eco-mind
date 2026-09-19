import type { FireAlert } from "./types";

function cellKey(lat: number, lng: number): string {
  return `${lat.toFixed(2)}:${lng.toFixed(2)}`;
}

function rank(alert: FireAlert): number {
  const frp = alert.frp ?? -1;
  const time = Date.parse(alert.reportedAt) || 0;
  // Prefer richer Brazil metadata from INPE when FRP/time tie
  const sourceBoost = alert.source === "inpe" ? 1 : 0;
  return frp * 1e13 + time * 10 + sourceBoost;
}

/**
 * Collapse near-duplicate pins (same ~1km cell) across INPE / NASA / seed.
 * Keeps the strongest FRP (then newest, then INPE for municipio labels).
 */
export function dedupeFireAlerts(alerts: FireAlert[]): FireAlert[] {
  const byCell = new Map<string, FireAlert>();
  for (const alert of alerts) {
    const key = cellKey(alert.lat, alert.lng);
    const prev = byCell.get(key);
    if (!prev || rank(alert) > rank(prev)) {
      byCell.set(key, alert);
    }
  }
  return [...byCell.values()];
}
