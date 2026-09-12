"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { isInBrazil } from "@/lib/alerts/geo";
import { ALERT_LEVELS, LEVEL_META } from "@/lib/alerts/levels";
import { addLocalReport, readLocalReports } from "@/lib/alerts/localReports";
import type { AlertLevel, FireAlert } from "@/lib/alerts/types";
import { FireLegend } from "./FireLegend";
import { MapView } from "./MapView";
import { ReportFireModal } from "./ReportFireModal";

type MapLayer = "map" | "satellite";

const MAX_VISIBLE_ALERTS = 280;

const LEVEL_PRIORITY: Record<AlertLevel, number> = {
  critico: 0,
  alto: 1,
  medio: 2,
  baixo: 3,
};

interface FiresMeta {
  count: number;
  inpe: number;
  nasa: number;
  inpeSource: string | null;
  nasaEnabled: boolean;
  updatedAt: string;
  errors?: string[];
}

export default function FireMap() {
  const [alerts, setAlerts] = useState<FireAlert[]>([]);
  const [meta, setMeta] = useState<FiresMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [layer, setLayer] = useState<MapLayer>("map");
  const [modalOpen, setModalOpen] = useState(false);
  const [pickMode, setPickMode] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [levelFilter, setLevelFilter] = useState<AlertLevel | "all">("all");
  const [refreshing, setRefreshing] = useState(false);
  const [partialWarning, setPartialWarning] = useState<string | null>(null);

  const loadSatellite = useCallback(async (fresh = false) => {
    const url = fresh ? "/api/fires?refresh=1" : "/api/fires";
    const firesRes = await fetch(url, fresh ? { cache: "no-store" } : undefined);

    if (!firesRes.ok) {
      throw new Error("Falha ao buscar focos de satélite.");
    }

    const firesData = (await firesRes.json()) as {
      alerts: FireAlert[];
      meta: FiresMeta;
    };

    return {
      satellite: firesData.alerts,
      meta: firesData.meta,
    };
  }, []);

  const mergeAlerts = useCallback((satellite: FireAlert[]) => {
    const local = readLocalReports();
    return [...local, ...satellite];
  }, []);

  useEffect(() => {
    loadSatellite()
      .then(({ satellite, meta: m }) => {
        setAlerts(mergeAlerts(satellite));
        setMeta(m);
        if (m.errors?.length) {
          if (satellite.length === 0) {
            setError(m.errors.join(" "));
          } else {
            setPartialWarning(m.errors.join(" "));
          }
        }
      })
      .catch(() => setError("Não foi possível carregar os focos de queimada."))
      .finally(() => setLoading(false));
  }, [loadSatellite, mergeAlerts]);

  async function refreshData() {
    setRefreshing(true);
    setError(null);
    setPartialWarning(null);
    try {
      const { satellite, meta: m } = await loadSatellite(true);
      setAlerts(mergeAlerts(satellite));
      setMeta(m);
      if (m.errors?.length) {
        if (satellite.length === 0) {
          setError(m.errors.join(" "));
        } else {
          setPartialWarning(m.errors.join(" "));
        }
      }
    } catch {
      setError("Não foi possível atualizar os dados.");
    } finally {
      setRefreshing(false);
    }
  }

  function openReport() {
    setError(null);
    setCoords(null);
    setPickMode(false);
    setModalOpen(true);
  }

  function closeReport() {
    setModalOpen(false);
    setPickMode(false);
    setCoords(null);
    setError(null);
  }

  function handleMapClick(lat: number, lng: number) {
    if (!pickMode) return;
    if (!isInBrazil(lat, lng)) {
      setError("Marque um ponto dentro do Brasil.");
      return;
    }
    setCoords({ lat, lng });
    setError(null);
  }

  function handleGeolocation() {
    if (!navigator.geolocation) {
      setError("Geolocalização não disponível neste navegador.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        if (!isInBrazil(lat, lng)) {
          setError("Sua localização está fora do Brasil.");
          return;
        }
        setCoords({ lat, lng });
        setPickMode(false);
        setError(null);
      },
      () => setError("Não foi possível obter sua localização."),
    );
  }

  async function handleSubmit(data: {
    lat: number;
    lng: number;
    level: AlertLevel;
    description?: string;
  }) {
    setSubmitting(true);
    setError(null);
    try {
      addLocalReport(data);
      const { satellite, meta: m } = await loadSatellite();
      setAlerts(mergeAlerts(satellite));
      setMeta(m);
      closeReport();
    } catch {
      setError("Não foi possível salvar o reporte neste aparelho.");
    } finally {
      setSubmitting(false);
    }
  }

  const filteredAlerts = useMemo(() => {
    const byLevel =
      levelFilter === "all"
        ? alerts
        : alerts.filter((a) => a.level === levelFilter);

    const users = byLevel.filter((a) => a.source === "user");
    const sats = byLevel
      .filter((a) => a.source !== "user")
      .sort(
        (a, b) =>
          LEVEL_PRIORITY[a.level] - LEVEL_PRIORITY[b.level] ||
          (b.frp ?? 0) - (a.frp ?? 0),
      );

    return [...users, ...sats].slice(0, MAX_VISIBLE_ALERTS);
  }, [alerts, levelFilter]);

  const levelCounts = ALERT_LEVELS.reduce(
    (acc, level) => {
      acc[level] = alerts.filter((a) => a.level === level).length;
      return acc;
    },
    {} as Record<AlertLevel, number>,
  );

  const sourceLabel =
    meta && meta.inpe > 0
      ? `INPE · ${meta.inpe} focos${meta.nasa > 0 ? ` · NASA ${meta.nasa}` : ""}`
      : meta?.nasa
        ? `NASA FIRMS · ${meta.nasa} focos`
        : null;

  const freshnessLabel =
    meta?.inpeSource === "inpe-10min"
      ? " · ~10 min"
      : meta?.inpeSource === "inpe-daily"
        ? " · diário"
        : null;

  return (
    <div className="relative h-[calc(100svh-8.5rem-env(safe-area-inset-bottom))] w-full md:h-[calc(100svh-4rem)]">
      {loading ? (
        <div className="flex h-full flex-col items-center justify-center gap-4 bg-mist-soft text-ash">
          <div className="h-12 w-12 animate-pulse-soft rounded-full border-2 border-forest/30 border-t-forest" />
          <p>Carregando focos de satélite...</p>
        </div>
      ) : (
        <MapView
          alerts={filteredAlerts}
          layer={layer}
          pickMode={pickMode && modalOpen}
          onMapClick={handleMapClick}
          selectedCoords={coords}
        />
      )}

      {/* z-[1100]: above Leaflet controls (z-index 1000) */}
      {sourceLabel ? (
        <div className="pointer-events-none absolute left-3 top-14 z-[1100] flex items-center gap-2 sm:top-16">
          <div className="pointer-events-auto rounded-lg border border-forest/15 bg-white/95 px-3 py-1.5 text-xs font-medium text-forest shadow-md backdrop-blur-sm">
            {sourceLabel}
            {freshnessLabel}
            <span className="ml-1 text-ash/70">
              · {filteredAlerts.length} visíveis
            </span>
          </div>
          <button
            type="button"
            onClick={refreshData}
            disabled={refreshing}
            aria-label="Atualizar dados"
            className="pointer-events-auto flex h-8 w-8 items-center justify-center rounded-lg border border-forest/15 bg-white/95 text-forest shadow-md backdrop-blur-sm transition hover:bg-mist-soft disabled:opacity-50"
          >
            <span className={refreshing ? "animate-spin" : ""}>↻</span>
          </button>
        </div>
      ) : null}

      {partialWarning ? (
        <div className="pointer-events-none absolute inset-x-0 top-[7.5rem] z-[1100] flex justify-center px-3 sm:top-[8.5rem]">
          <p className="pointer-events-auto max-w-md rounded-lg border border-burn/20 bg-white/95 px-3 py-1.5 text-center text-[11px] text-burn shadow-md">
            {partialWarning}
          </p>
        </div>
      ) : null}

      <div className="pointer-events-none absolute left-3 top-[4.5rem] z-[1100] sm:top-[5.5rem]">
        <div className="pointer-events-auto flex flex-wrap gap-1 rounded-lg border border-forest/15 bg-white/95 p-1 shadow-md backdrop-blur-sm">
          <button
            type="button"
            onClick={() => setLevelFilter("all")}
            className={`rounded-md px-2 py-1 text-[10px] font-semibold uppercase ${
              levelFilter === "all"
                ? "bg-forest text-mist"
                : "text-ash hover:bg-forest/10"
            }`}
          >
            Todos ({alerts.length})
          </button>
          {ALERT_LEVELS.map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setLevelFilter(level)}
              className={`rounded-md px-2 py-1 text-[10px] font-semibold uppercase ${
                levelFilter === level
                  ? "text-mist"
                  : "text-ash hover:bg-forest/10"
              }`}
              style={
                levelFilter === level
                  ? { backgroundColor: LEVEL_META[level].color }
                  : undefined
              }
            >
              {LEVEL_META[level].label} ({levelCounts[level]})
            </button>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-3 z-[1100] flex justify-center px-3">
        <div
          className="pointer-events-auto inline-flex rounded-lg border border-forest/15 bg-white/95 p-1 shadow-md backdrop-blur-sm"
          role="tablist"
          aria-label="Tipo de mapa"
        >
          {(["map", "satellite"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              role="tab"
              aria-selected={layer === mode}
              onClick={() => setLayer(mode)}
              className={`rounded-md px-4 py-1.5 text-sm font-semibold transition ${
                layer === mode
                  ? "bg-forest text-mist"
                  : "text-forest hover:bg-forest/10"
              }`}
            >
              {mode === "map" ? "Mapa" : "Satélite"}
            </button>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-24 left-3 z-[1100] sm:bottom-6">
        <div className="pointer-events-auto">
          <FireLegend />
        </div>
      </div>

      <button
        type="button"
        onClick={openReport}
        aria-label="Reportar queimada"
        className="absolute bottom-28 right-4 z-[1100] flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-3xl font-light text-white shadow-lg transition hover:bg-red-700 md:bottom-6"
      >
        +
      </button>

      {error && !modalOpen ? (
        <div className="absolute bottom-24 right-4 z-[1100] max-w-xs rounded-lg bg-burn px-3 py-2 text-sm text-white shadow-md">
          {error}
        </div>
      ) : null}

      <ReportFireModal
        open={modalOpen}
        onClose={closeReport}
        onSubmit={handleSubmit}
        coords={coords}
        pickMode={pickMode}
        onStartPickMode={() => {
          setPickMode(true);
          setCoords(null);
          setError(null);
        }}
        onUseGeolocation={handleGeolocation}
        submitting={submitting}
        error={error}
      />
    </div>
  );
}
