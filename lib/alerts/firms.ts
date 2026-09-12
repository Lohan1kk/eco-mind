import { BRAZIL_BBOX_FIRMS } from "./geo";
import { frpToLevel } from "./frp";
import type { FireAlert } from "./types";

const FIRMS_SOURCES = [
  "VIIRS_NOAA20_NRT",
  "VIIRS_SNPP_NRT",
  "MODIS_NRT",
] as const;

function parseFirmsCsv(text: string): FireAlert[] {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];

  const header = lines[0].split(",").map((h) => h.trim().toLowerCase());
  const latIdx = header.indexOf("latitude");
  const lngIdx = header.indexOf("longitude");
  const frpIdx = header.findIndex((h) => h.includes("frp"));
  const dateIdx = header.indexOf("acq_date");
  const timeIdx = header.indexOf("acq_time");
  const satIdx = header.indexOf("satellite");

  if (latIdx === -1 || lngIdx === -1) return [];

  return lines.slice(1).flatMap((line, index) => {
    const parts = line.split(",");
    const lat = Number.parseFloat(parts[latIdx]);
    const lng = Number.parseFloat(parts[lngIdx]);
    if (Number.isNaN(lat) || Number.isNaN(lng)) return [];

    const frp = frpIdx >= 0 ? Number.parseFloat(parts[frpIdx]) : Number.NaN;
    const date = dateIdx >= 0 ? parts[dateIdx] : "";
    const time = timeIdx >= 0 ? parts[timeIdx]?.padStart(4, "0") : "0000";
    const satelite = satIdx >= 0 ? parts[satIdx] : "NASA FIRMS";

    const reportedAt =
      date && time
        ? `${date}T${time.slice(0, 2)}:${time.slice(2, 4)}:00.000Z`
        : new Date().toISOString();

    return [
      {
        id: `nasa-${index}-${lat.toFixed(4)}-${lng.toFixed(4)}`,
        lat,
        lng,
        level: frpToLevel(Number.isNaN(frp) ? null : frp),
        description: `NASA FIRMS · ${satelite}`,
        reportedAt,
        source: "nasa" as const,
        satelite,
        frp: Number.isNaN(frp) ? undefined : frp,
      },
    ];
  });
}

export async function fetchNasaFirmsFires(
  mapKey: string,
  days = 1,
  options?: { fresh?: boolean },
): Promise<FireAlert[]> {
  const fresh = Boolean(options?.fresh);
  const fetchInit: RequestInit = fresh
    ? { cache: "no-store" }
    : { next: { revalidate: 3600 } };

  const batches = await Promise.all(
    FIRMS_SOURCES.map(async (source) => {
      const url = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${mapKey}/${source}/${BRAZIL_BBOX_FIRMS}/${days}`;
      try {
        const res = await fetch(url, fetchInit);
        if (!res.ok) return [] as FireAlert[];
        return parseFirmsCsv(await res.text());
      } catch {
        return [] as FireAlert[];
      }
    }),
  );

  const all = batches.flat();
  const seen = new Set<string>();
  return all.filter((alert) => {
    const key = `${alert.lat.toFixed(3)}:${alert.lng.toFixed(3)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
