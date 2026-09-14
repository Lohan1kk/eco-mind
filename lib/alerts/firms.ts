import { resolveFireLevel } from "./frp";
import type { FireAlert } from "./types";

/**
 * Public FIRMS active-fire CSVs (no MAP_KEY required).
 * @see https://firms.modaps.eosdis.nasa.gov/active_fire/
 */
const GLOBAL_FEEDS = [
  "https://firms.modaps.eosdis.nasa.gov/data/active_fire/suomi-npp-viirs-c2/csv/SUOMI_VIIRS_C2_Global_24h.csv",
  "https://firms.modaps.eosdis.nasa.gov/data/active_fire/noaa-20-viirs-c2/csv/J1_VIIRS_C2_Global_24h.csv",
] as const;

function parseCsvLine(line: string): string[] {
  return line.split(",").map((cell) => cell.trim());
}

function parseFirmsCsv(text: string, sourceTag: string): FireAlert[] {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];

  const header = parseCsvLine(lines[0]).map((h) => h.toLowerCase());
  const latIdx = header.indexOf("latitude");
  const lngIdx = header.indexOf("longitude");
  const frpIdx = header.findIndex((h) => h === "frp");
  const brightIdx = header.findIndex(
    (h) => h.includes("bright_ti4") || h === "brightness",
  );
  const dateIdx = header.indexOf("acq_date");
  const timeIdx = header.indexOf("acq_time");
  const satIdx = header.indexOf("satellite");
  const confIdx = header.indexOf("confidence");

  if (latIdx === -1 || lngIdx === -1) return [];

  return lines.slice(1).flatMap((line, index) => {
    const parts = parseCsvLine(line);
    const lat = Number.parseFloat(parts[latIdx]);
    const lng = Number.parseFloat(parts[lngIdx]);
    if (Number.isNaN(lat) || Number.isNaN(lng)) return [];

    const confidence = confIdx >= 0 ? parts[confIdx]?.toLowerCase() : "";
    // Skip low-confidence VIIRS detections for a more realistic map
    if (confidence === "low" || confidence === "l") return [];

    const frp = frpIdx >= 0 ? Number.parseFloat(parts[frpIdx]) : Number.NaN;
    const bright =
      brightIdx >= 0 ? Number.parseFloat(parts[brightIdx]) : Number.NaN;
    const date = dateIdx >= 0 ? parts[dateIdx] : "";
    const time = timeIdx >= 0 ? parts[timeIdx]?.padStart(4, "0") : "0000";
    const satelite = satIdx >= 0 ? parts[satIdx] : "NASA FIRMS";

    const reportedAt =
      date && time
        ? `${date}T${time.slice(0, 2)}:${time.slice(2, 4)}:00.000Z`
        : new Date().toISOString();

    const level = resolveFireLevel({
      frp: Number.isNaN(frp) ? null : frp,
      brightness: Number.isNaN(bright) ? null : bright,
    });

    const confLabel = confidence ? ` · conf. ${confidence}` : "";

    return [
      {
        id: `nasa-${sourceTag}-${index}-${lat.toFixed(3)}-${lng.toFixed(3)}`,
        lat,
        lng,
        level,
        description: `NASA FIRMS · ${satelite}${confLabel}`,
        reportedAt,
        source: "nasa" as const,
        satelite,
        frp: Number.isNaN(frp) ? undefined : frp,
      },
    ];
  });
}

/**
 * Spread fires across a lat/lng grid and across severity levels
 * so the map shows identification (not only red crítico pins).
 */
function diversifyByGrid(alerts: FireAlert[], limit: number): FireAlert[] {
  const byLevel = {
    critico: [] as FireAlert[],
    alto: [] as FireAlert[],
    medio: [] as FireAlert[],
    baixo: [] as FireAlert[],
  };
  for (const a of alerts) {
    byLevel[a.level].push(a);
  }
  for (const list of Object.values(byLevel)) {
    list.sort((a, b) => (b.frp ?? 0) - (a.frp ?? 0));
  }

  const quotas = {
    // Natural-ish mix: most real detections are low/medium FRP
    critico: Math.ceil(limit * 0.12),
    alto: Math.ceil(limit * 0.18),
    medio: Math.ceil(limit * 0.30),
    baixo: Math.ceil(limit * 0.40),
  };

  const cellCap = Math.max(2, Math.ceil(limit / 90));
  const perCell = new Map<string, number>();
  const seen = new Set<string>();
  const picked: FireAlert[] = [];

  function tryPick(alert: FireAlert): boolean {
    const dedupe = `${alert.lat.toFixed(2)}:${alert.lng.toFixed(2)}`;
    if (seen.has(dedupe)) return false;
    const cell = `${Math.floor(alert.lat / 8)}:${Math.floor(alert.lng / 12)}`;
    const count = perCell.get(cell) ?? 0;
    if (count >= cellCap) return false;
    seen.add(dedupe);
    perCell.set(cell, count + 1);
    picked.push(alert);
    return true;
  }

  for (const level of ["critico", "alto", "medio", "baixo"] as const) {
    let taken = 0;
    for (const alert of byLevel[level]) {
      if (taken >= quotas[level]) break;
      if (tryPick(alert)) taken += 1;
    }
  }

  if (picked.length < limit) {
    const rest = [...alerts].sort((a, b) => (b.frp ?? 0) - (a.frp ?? 0));
    for (const alert of rest) {
      if (picked.length >= limit) break;
      tryPick(alert);
    }
  }

  return picked.slice(0, limit);
}

export async function fetchNasaFirmsGlobal(
  options?: { fresh?: boolean; limit?: number },
): Promise<FireAlert[]> {
  const fresh = Boolean(options?.fresh);
  const limit = options?.limit ?? 420;
  const fetchInit: RequestInit = fresh
    ? { cache: "no-store" }
    : { next: { revalidate: 1800 } };

  const batches = await Promise.all(
    GLOBAL_FEEDS.map(async (url, i) => {
      try {
        const res = await fetch(url, fetchInit);
        if (!res.ok) return [] as FireAlert[];
        const text = await res.text();
        // Sample across the file (not only the first lines) for geographic realism
        const lines = text.split("\n");
        const header = lines[0] ?? "";
        const body = lines.slice(1).filter(Boolean);
        const stride = Math.max(1, Math.floor(body.length / 8000));
        const sampled = body.filter((_, idx) => idx % stride === 0).slice(0, 8000);
        return parseFirmsCsv([header, ...sampled].join("\n"), `g${i}`);
      } catch {
        return [] as FireAlert[];
      }
    }),
  );

  return diversifyByGrid(batches.flat(), limit);
}

/** Optional key-based Brazil denser pull (legacy). */
export async function fetchNasaFirmsFires(
  mapKey: string,
  days = 1,
  options?: { fresh?: boolean },
): Promise<FireAlert[]> {
  const { BRAZIL_BBOX_FIRMS } = await import("./geo");
  const fresh = Boolean(options?.fresh);
  const fetchInit: RequestInit = fresh
    ? { cache: "no-store" }
    : { next: { revalidate: 3600 } };

  const sources = ["VIIRS_NOAA20_NRT", "VIIRS_SNPP_NRT", "MODIS_NRT"] as const;
  const batches = await Promise.all(
    sources.map(async (source) => {
      const url = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${mapKey}/${source}/${BRAZIL_BBOX_FIRMS}/${days}`;
      try {
        const res = await fetch(url, fetchInit);
        if (!res.ok) return [] as FireAlert[];
        return parseFirmsCsv(await res.text(), source);
      } catch {
        return [] as FireAlert[];
      }
    }),
  );

  return diversifyByGrid(batches.flat(), 200);
}
