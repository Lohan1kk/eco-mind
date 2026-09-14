import type { FireAlert } from "./types";

const CACHE_KEY = "ecomind-fires-cache-v1";

export interface FiresCacheMeta {
  count: number;
  inpe: number;
  nasa: number;
  inpeSource: string | null;
  nasaEnabled: boolean;
  updatedAt: string;
  errors?: string[];
}

interface FiresCachePayload {
  alerts: FireAlert[];
  meta: FiresCacheMeta;
  savedAt: string;
}

export function readFiresCache(): FiresCachePayload | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as FiresCachePayload;
    if (!Array.isArray(parsed.alerts) || !parsed.meta) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeFiresCache(
  alerts: FireAlert[],
  meta: FiresCacheMeta,
): void {
  if (typeof window === "undefined") return;
  try {
    const payload: FiresCachePayload = {
      alerts,
      meta,
      savedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
  } catch {
    // Quota / private mode — ignore.
  }
}
