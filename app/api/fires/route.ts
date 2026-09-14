import { NextResponse } from "next/server";
import {
  fetchNasaFirmsFires,
  fetchNasaFirmsGlobal,
} from "@/lib/alerts/firms";
import { fetchInpeFires } from "@/lib/alerts/inpe";
import { buildSeedFires } from "@/lib/alerts/seed";
import type { FireAlert } from "@/lib/alerts/types";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fresh = searchParams.get("refresh") === "1";

  const firmsKey = process.env.FIRMS_MAP_KEY?.trim();

  let inpeAlerts: FireAlert[] = [];
  let inpeSource: string | null = null;
  let nasaAlerts: FireAlert[] = [];
  let seedAlerts: FireAlert[] = [];
  const errors: string[] = [];

  try {
    const inpe = await fetchInpeFires({ fresh });
    inpeAlerts = inpe.alerts;
    inpeSource = inpe.source;
  } catch {
    errors.push("INPE indisponível no momento.");
  }

  try {
    nasaAlerts = await fetchNasaFirmsGlobal({ fresh, limit: 450 });
  } catch {
    errors.push("NASA FIRMS global indisponível.");
  }

  // Optional MAP KEY: denser real Brazil pull from FIRMS area API
  if (firmsKey) {
    try {
      const brazilFirms = await fetchNasaFirmsFires(firmsKey, 1, { fresh });
      const seen = new Set(
        nasaAlerts.map((a) => `${a.lat.toFixed(2)}:${a.lng.toFixed(2)}`),
      );
      for (const alert of brazilFirms) {
        const key = `${alert.lat.toFixed(2)}:${alert.lng.toFixed(2)}`;
        if (seen.has(key)) continue;
        seen.add(key);
        nasaAlerts.push(alert);
      }
    } catch {
      errors.push("NASA FIRMS (chave) indisponível.");
    }
  }

  if (inpeAlerts.length === 0 && nasaAlerts.length === 0) {
    seedAlerts = buildSeedFires();
    errors.push(
      "Usando focos de demonstração mundiais (satélite indisponível).",
    );
  }

  const alerts = [...inpeAlerts, ...nasaAlerts, ...seedAlerts];

  return NextResponse.json({
    alerts,
    meta: {
      count: alerts.length,
      inpe: inpeAlerts.length,
      nasa: nasaAlerts.length,
      seed: seedAlerts.length,
      inpeSource,
      nasaEnabled: true,
      firmsKeyConfigured: Boolean(firmsKey),
      worldwide: nasaAlerts.length > 0 || seedAlerts.length > 0,
      updatedAt: new Date().toISOString(),
      errors: errors.length ? errors : undefined,
    },
  });
}
