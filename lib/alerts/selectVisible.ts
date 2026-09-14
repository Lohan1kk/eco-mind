import type { AlertLevel, FireAlert } from "./types";

const LEVEL_ORDER: AlertLevel[] = ["critico", "alto", "medio", "baixo"];

/**
 * Cap visible pins without dropping entire severity classes.
 * Round-robin by level so "baixo" (and others) always appear when present.
 */
export function selectVisibleAlerts(
  alerts: FireAlert[],
  limit: number,
): FireAlert[] {
  if (alerts.length <= limit) return alerts;

  const users = alerts.filter((a) => a.source === "user");
  const sats = alerts.filter((a) => a.source !== "user");

  const buckets: Record<AlertLevel, FireAlert[]> = {
    critico: [],
    alto: [],
    medio: [],
    baixo: [],
  };
  for (const a of sats) {
    buckets[a.level].push(a);
  }
  for (const level of LEVEL_ORDER) {
    buckets[level].sort((a, b) => (b.frp ?? 0) - (a.frp ?? 0));
  }

  const remaining = Math.max(0, limit - users.length);
  const picked: FireAlert[] = [];
  const indices: Record<AlertLevel, number> = {
    critico: 0,
    alto: 0,
    medio: 0,
    baixo: 0,
  };

  // Guarantee a minimum share per level that has data
  const active = LEVEL_ORDER.filter((l) => buckets[l].length > 0);
  const minEach = Math.max(8, Math.floor(remaining / (active.length * 2)));

  for (const level of active) {
    const take = Math.min(minEach, buckets[level].length, remaining - picked.length);
    picked.push(...buckets[level].slice(0, take));
    indices[level] = take;
  }

  // Fill the rest round-robin (keeps mix realistic on screen)
  let progressed = true;
  while (picked.length < remaining && progressed) {
    progressed = false;
    for (const level of active) {
      if (picked.length >= remaining) break;
      const i = indices[level];
      if (i >= buckets[level].length) continue;
      picked.push(buckets[level][i]);
      indices[level] = i + 1;
      progressed = true;
    }
  }

  return [...users, ...picked].slice(0, limit);
}
