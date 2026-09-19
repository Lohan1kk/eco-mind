import { isInBrazil } from "./geo";
import { frpToLevel } from "./frp";
import type { FireAlert } from "./types";

const INPE_10MIN_DIR =
  "https://dataserver-coids.inpe.br/queimadas/queimadas/focos/csv/10min/";
const INPE_DAILY_BR =
  "https://dataserver-coids.inpe.br/queimadas/queimadas/focos/csv/diario/Brasil/";

function parseCsvLine(line: string): string[] {
  return line.split(",").map((cell) => cell.trim());
}

function safeIso(raw: string): string | null {
  const normalized = raw.trim().replace(" ", "T");
  const withZ = normalized.endsWith("Z") ? normalized : `${normalized}Z`;
  const parsed = new Date(withZ);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString();
}

function dailyFilename(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `focos_diario_br_${y}${m}${d}.csv`;
}

function fetchOpts(fresh: boolean, revalidate: number): RequestInit {
  return fresh ? { cache: "no-store" } : { next: { revalidate } };
}

async function findLatest10MinFile(fresh: boolean): Promise<string | null> {
  const res = await fetch(INPE_10MIN_DIR, fetchOpts(fresh, 300));
  if (!res.ok) return null;

  const html = await res.text();
  const matches = html.match(/focos_10min_\d{8}_\d{4}\.csv/g);
  if (!matches?.length) return null;

  return matches.sort().at(-1) ?? null;
}

function parse10MinCsv(text: string): FireAlert[] {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];

  return lines
    .slice(1)
    .flatMap((line, index) => {
      const parts = parseCsvLine(line);
      if (parts.length < 4) return [];

      const lat = Number.parseFloat(parts[0]);
      const lng = Number.parseFloat(parts[1]);
      if (Number.isNaN(lat) || Number.isNaN(lng)) return [];
      if (!isInBrazil(lat, lng)) return [];

      const satelite = parts[2];
      const reportedAt = safeIso(parts[3]);
      if (!reportedAt) return [];

      return [
        {
          id: `inpe-10m-${index}-${lat.toFixed(4)}-${lng.toFixed(4)}`,
          lat,
          lng,
          // 10-min CSV has no FRP — do not imply "médio"
          level: "baixo" as const,
          description: satelite ? `Satélite ${satelite}` : undefined,
          reportedAt,
          source: "inpe" as const,
          satelite,
        },
      ];
    })
    .slice(0, 280);
}

function parseDailyCsv(text: string): FireAlert[] {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];

  const rows = lines.slice(1).flatMap((line) => {
    const parts = parseCsvLine(line);
    if (parts.length < 16) return [];

    const id = parts[0];
    const lat = Number.parseFloat(parts[1]);
    const lng = Number.parseFloat(parts[2]);
    if (Number.isNaN(lat) || Number.isNaN(lng)) return [];

    const reportedAt = safeIso(parts[3]) ?? new Date().toISOString();
    const satelite = parts[4];
    const municipio = parts[5];
    const estado = parts[6];
    const bioma = parts[14];
    const frp = Number.parseFloat(parts[15]);

    const level = frpToLevel(Number.isNaN(frp) ? null : frp);
    const location = [municipio, estado].filter(Boolean).join(", ");

    return [
      {
        id: `inpe-${id}`,
        lat,
        lng,
        level,
        description: location || undefined,
        reportedAt,
        source: "inpe" as const,
        satelite,
        municipio,
        estado,
        bioma,
        frp: Number.isNaN(frp) ? undefined : frp,
      },
    ];
  });

  return rows.sort((a, b) => (b.frp ?? 0) - (a.frp ?? 0));
}

/** Keep Brazil coverage readable: mix severity levels, not only top FRP. */
function diversifyInpeLevels(alerts: FireAlert[], limit: number): FireAlert[] {
  const byLevel: Record<string, FireAlert[]> = {
    critico: [],
    alto: [],
    medio: [],
    baixo: [],
  };
  for (const a of alerts) {
    byLevel[a.level]?.push(a);
  }
  const quotas = {
    critico: Math.ceil(limit * 0.15),
    alto: Math.ceil(limit * 0.2),
    medio: Math.ceil(limit * 0.3),
    baixo: Math.ceil(limit * 0.35),
  };
  const picked: FireAlert[] = [];
  for (const level of ["critico", "alto", "medio", "baixo"] as const) {
    picked.push(...byLevel[level].slice(0, quotas[level]));
  }
  if (picked.length < limit) {
    const ids = new Set(picked.map((p) => p.id));
    for (const a of alerts) {
      if (ids.has(a.id)) continue;
      picked.push(a);
      if (picked.length >= limit) break;
    }
  }
  return picked.slice(0, limit);
}

async function fetchDailyCsvText(
  date: Date,
  fresh: boolean,
): Promise<string | null> {
  const res = await fetch(
    `${INPE_DAILY_BR}${dailyFilename(date)}`,
    fetchOpts(fresh, 3600),
  );
  if (!res.ok) return null;
  return res.text();
}

/**
 * Prefer a complete daily file. Mid-day "today" CSVs are often partial —
 * if today has far fewer rows than yesterday, use yesterday.
 */
function pickBestDaily(
  today: FireAlert[],
  yesterday: FireAlert[],
): FireAlert[] {
  if (today.length === 0) return yesterday;
  if (yesterday.length === 0) return today;
  // Incomplete today (e.g. morning file vs full previous day)
  if (today.length < yesterday.length * 0.4) return yesterday;
  return today;
}

export async function fetchInpeFires(options?: {
  fresh?: boolean;
}): Promise<{
  alerts: FireAlert[];
  source: "inpe-10min" | "inpe-daily";
}> {
  const fresh = Boolean(options?.fresh);

  const today = new Date();
  const yesterday = new Date();
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);

  const [todayText, yesterdayText] = await Promise.all([
    fetchDailyCsvText(today, fresh),
    fetchDailyCsvText(yesterday, fresh),
  ]);

  const todayAlerts = todayText ? parseDailyCsv(todayText) : [];
  const yesterdayAlerts = yesterdayText ? parseDailyCsv(yesterdayText) : [];
  const daily = pickBestDaily(todayAlerts, yesterdayAlerts);

  if (daily.length > 0) {
    // Overlay latest 10-min foci for fresher pins (no FRP → baixo)
    let merged = daily;
    try {
      const latest10 = await findLatest10MinFile(fresh);
      if (latest10) {
        const tenRes = await fetch(
          `${INPE_10MIN_DIR}${latest10}`,
          fetchOpts(fresh, 600),
        );
        if (tenRes.ok) {
          const recent = parse10MinCsv(await tenRes.text());
          if (recent.length > 0) {
            const byId = new Map(daily.map((a) => [a.id, a]));
            const cells = new Set(
              daily.map((a) => `${a.lat.toFixed(2)}:${a.lng.toFixed(2)}`),
            );
            for (const r of recent) {
              const cell = `${r.lat.toFixed(2)}:${r.lng.toFixed(2)}`;
              if (cells.has(cell)) continue;
              cells.add(cell);
              byId.set(r.id, r);
            }
            merged = [...byId.values()];
          }
        }
      }
    } catch {
      // keep daily only
    }

    return {
      alerts: diversifyInpeLevels(merged, 320),
      source: "inpe-daily",
    };
  }

  // Fallback: 10-min only
  const latest10 = await findLatest10MinFile(fresh);
  if (latest10) {
    const tenRes = await fetch(
      `${INPE_10MIN_DIR}${latest10}`,
      fetchOpts(fresh, 600),
    );
    if (tenRes.ok) {
      const alerts = parse10MinCsv(await tenRes.text());
      if (alerts.length > 0) {
        return { alerts, source: "inpe-10min" };
      }
    }
  }

  throw new Error("INPE indisponível.");
}
