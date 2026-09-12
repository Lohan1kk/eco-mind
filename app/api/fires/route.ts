import { NextResponse } from "next/server";
import { fetchNasaFirmsFires } from "@/lib/alerts/firms";
import { fetchInpeFires } from "@/lib/alerts/inpe";
import type { FireAlert } from "@/lib/alerts/types";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fresh = searchParams.get("refresh") === "1";

  const firmsKey = process.env.FIRMS_MAP_KEY;
  let inpeAlerts: FireAlert[] = [];
  let inpeSource: string | null = null;
  let nasaAlerts: FireAlert[] = [];
  const errors: string[] = [];

  try {
    const inpe = await fetchInpeFires({ fresh });
    inpeAlerts = inpe.alerts;
    inpeSource = inpe.source;
  } catch {
    errors.push("INPE indisponível no momento.");
  }

  if (firmsKey) {
    try {
      nasaAlerts = await fetchNasaFirmsFires(firmsKey, 1, { fresh });
    } catch {
      errors.push("NASA FIRMS indisponível.");
    }
  }

  const alerts = [...inpeAlerts, ...nasaAlerts];

  return NextResponse.json({
    alerts,
    meta: {
      count: alerts.length,
      inpe: inpeAlerts.length,
      nasa: nasaAlerts.length,
      inpeSource,
      nasaEnabled: Boolean(firmsKey),
      updatedAt: new Date().toISOString(),
      errors: errors.length ? errors : undefined,
    },
  });
}
