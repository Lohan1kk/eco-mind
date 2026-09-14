import { NextResponse } from "next/server";
import { fetchNasaFirmsGlobal } from "@/lib/alerts/firms";
import { fetchInpeFires } from "@/lib/alerts/inpe";
import { buildSeedFires } from "@/lib/alerts/seed";
import type { FireAlert } from "@/lib/alerts/types";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fresh = searchParams.get("refresh") === "1";

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
    nasaAlerts = await fetchNasaFirmsGlobal({ fresh, limit: 420 });
  } catch {
    errors.push("NASA FIRMS global indisponível.");
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
      worldwide: nasaAlerts.length > 0 || seedAlerts.length > 0,
      updatedAt: new Date().toISOString(),
      errors: errors.length ? errors : undefined,
    },
  });
}
