import { isAlertLevel } from "./levels";
import type { AlertLevel, FireAlert } from "./types";

const STORAGE_KEY = "ecomind-local-fire-reports";

function isValidReport(value: unknown): value is FireAlert {
  if (!value || typeof value !== "object") return false;
  const a = value as FireAlert;
  return (
    typeof a.id === "string" &&
    typeof a.lat === "number" &&
    typeof a.lng === "number" &&
    Number.isFinite(a.lat) &&
    Number.isFinite(a.lng) &&
    isAlertLevel(a.level) &&
    typeof a.reportedAt === "string" &&
    a.source === "user"
  );
}

export function readLocalReports(): FireAlert[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidReport);
  } catch {
    return [];
  }
}

export function addLocalReport(input: {
  lat: number;
  lng: number;
  level: AlertLevel;
  description?: string;
}): FireAlert {
  const alert: FireAlert = {
    id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    lat: input.lat,
    lng: input.lng,
    level: input.level,
    description: input.description?.trim() || undefined,
    reportedAt: new Date().toISOString(),
    source: "user",
  };

  const existing = readLocalReports();
  const next = [...existing, alert];
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return alert;
}
