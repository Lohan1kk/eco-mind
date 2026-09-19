import { NextResponse } from "next/server";
import { dedupeFireAlerts } from "@/lib/alerts/dedupe";
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
  let nasaOk = false;
  let seedAlerts: FireAlert[] = [];
  const errors: string[] = [];

  const [inpeResult, nasaResult] = await Promise.allSettled([
    fetchInpeFires({ fresh }),
    fetchNasaFirmsGlobal({ fresh, limit: 450 }),
  ]);

  if (inpeResult.status === "fulfilled") {
    inpeAlerts = inpeResult.value.alerts;
    inpeSource = inpeResult.value.source;
  } else {
    errors.push("INPE indisponível no momento.");
  }

  if (nasaResult.status === "fulfilled") {
    nasaAlerts = nasaResult.value;
    nasaOk = nasaAlerts.length > 0;
  } else {
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
      if (brazilFirms.length > 0) nasaOk = true;
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

  const alerts = dedupeFireAlerts([
    ...inpeAlerts,
    ...nasaAlerts,
    ...seedAlerts,
  ]);

  return NextResponse.json({
    alerts,
    meta: {
      count: alerts.length,
      inpe: inpeAlerts.length,
      nasa: nasaAlerts.length,
      seed: seedAlerts.length,
      inpeSource,
      nasaEnabled: nasaOk,
      firmsKeyConfigured: Boolean(firmsKey),
      worldwide: nasaOk || seedAlerts.length > 0,
      updatedAt: new Date().toISOString(),
      errors: errors.length ? errors : undefined,
    },
  });
}
