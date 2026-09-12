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

function latestDailyFilename(): string {
  const now = new Date();
  const y = now.getUTCFullYear();
  const m = String(now.getUTCMonth() + 1).padStart(2, "0");
  const d = String(now.getUTCDate()).padStart(2, "0");
  return `focos_diario_br_${y}${m}${d}.csv`;
}

function fetchOpts(fresh: boolean, revalidate: number): RequestInit {
  return fresh
    ? { cache: "no-store" }
    : { next: { revalidate } };
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
          level: "medio" as const,
          description: satelite ? `Satélite ${satelite}` : undefined,
          reportedAt,
          source: "inpe" as const,
          satelite,
        },
      ];
    })
    .slice(0, 280);
}

function parseDailyCsv(text: string, limit: number): FireAlert[] {
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

  return rows
    .sort((a, b) => (b.frp ?? 0) - (a.frp ?? 0))
    .slice(0, limit);
}

export async function fetchInpeFires(options?: {
  fresh?: boolean;
}): Promise<{
  alerts: FireAlert[];
  source: "inpe-10min" | "inpe-daily";
}> {
  const fresh = Boolean(options?.fresh);

  const latest10 = await findLatest10MinFile(fresh);
  if (latest10) {
    const res = await fetch(
      `${INPE_10MIN_DIR}${latest10}`,
      fetchOpts(fresh, 600),
    );
    if (res.ok) {
      const alerts = parse10MinCsv(await res.text());
      if (alerts.length > 0) {
        return { alerts, source: "inpe-10min" };
      }
    }
  }

  const dailyUrl = `${INPE_DAILY_BR}${latestDailyFilename()}`;
  let res = await fetch(dailyUrl, fetchOpts(fresh, 3600));

  if (!res.ok) {
    const yesterday = new Date();
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);
    const y = yesterday.getUTCFullYear();
    const m = String(yesterday.getUTCMonth() + 1).padStart(2, "0");
    const d = String(yesterday.getUTCDate()).padStart(2, "0");
    res = await fetch(
      `${INPE_DAILY_BR}focos_diario_br_${y}${m}${d}.csv`,
      fetchOpts(fresh, 3600),
    );
  }

  if (!res.ok) {
    throw new Error("INPE indisponível.");
  }

  const alerts = parseDailyCsv(await res.text(), 300);
  return { alerts, source: "inpe-daily" };
}
