import { frpToLevel } from "./frp";
import type { FireAlert } from "./types";

/**
 * Demo / fallback worldwide fires when satellite feeds are unavailable.
 * Marked as source "seed" so the UI can label them clearly.
 */
const SEED_POINTS: Array<{
  lat: number;
  lng: number;
  frp: number;
  place: string;
}> = [
  { lat: -7.2, lng: -55.1, frp: 95, place: "Amazônia (BR)" },
  { lat: -15.8, lng: -56.1, frp: 42, place: "Pantanal (BR)" },
  { lat: -12.5, lng: -48.5, frp: 28, place: "Cerrado (BR)" },
  { lat: -22.9, lng: -43.2, frp: 8, place: "Rio de Janeiro (BR)" },
  { lat: 37.2, lng: -121.8, frp: 110, place: "Califórnia (EUA)" },
  { lat: 45.5, lng: -122.6, frp: 55, place: "Oregon (EUA)" },
  { lat: 34.0, lng: -118.2, frp: 18, place: "Los Angeles (EUA)" },
  { lat: -25.3, lng: 131.0, frp: 70, place: "Austrália central" },
  { lat: -33.8, lng: 151.2, frp: 15, place: "Sydney (AU)" },
  { lat: -15.0, lng: 25.0, frp: 48, place: "África central" },
  { lat: 6.5, lng: 3.4, frp: 22, place: "Nigéria" },
  { lat: -1.3, lng: 36.8, frp: 12, place: "Quênia" },
  { lat: 39.0, lng: 22.0, frp: 65, place: "Grécia" },
  { lat: 41.9, lng: 12.5, frp: 30, place: "Itália" },
  { lat: 40.4, lng: -3.7, frp: 25, place: "Espanha" },
  { lat: 55.7, lng: 37.6, frp: 10, place: "Rússia europeia" },
  { lat: 60.0, lng: 100.0, frp: 88, place: "Sibéria" },
  { lat: 28.6, lng: 77.2, frp: 20, place: "Índia norte" },
  { lat: -6.2, lng: 106.8, frp: 35, place: "Indonésia" },
  { lat: 19.4, lng: -99.1, frp: 16, place: "México" },
  { lat: -33.4, lng: -70.6, frp: 40, place: "Chile" },
  { lat: -34.6, lng: -58.4, frp: 9, place: "Argentina" },
  { lat: 51.5, lng: -0.1, frp: 5, place: "Reino Unido" },
  { lat: 35.7, lng: 139.7, frp: 7, place: "Japão" },
  { lat: -26.2, lng: 28.0, frp: 33, place: "África do Sul" },
  { lat: 31.2, lng: 121.5, frp: 14, place: "China leste" },
  { lat: 13.7, lng: 100.5, frp: 27, place: "Tailândia" },
  { lat: 4.7, lng: -74.1, frp: 38, place: "Colômbia" },
  { lat: -12.0, lng: -77.0, frp: 11, place: "Peru" },
  { lat: 64.1, lng: -21.9, frp: 6, place: "Islândia" },
];

export function buildSeedFires(): FireAlert[] {
  const now = Date.now();
  return SEED_POINTS.map((p, i) => ({
    id: `seed-${i}-${p.lat}-${p.lng}`,
    lat: p.lat,
    lng: p.lng,
    level: frpToLevel(p.frp),
    description: `Demonstração · ${p.place}`,
    reportedAt: new Date(now - i * 3600_000).toISOString(),
    source: "seed" as const,
    satelite: "EcoMind seed",
    frp: p.frp,
  }));
}
