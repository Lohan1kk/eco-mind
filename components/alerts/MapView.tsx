"use client";

import { useEffect, useMemo } from "react";
import {
  CircleMarker,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { usePerfProfile } from "@/components/hooks/usePerfProfile";
import { WORLD_CENTER, WORLD_DEFAULT_ZOOM } from "@/lib/alerts/geo";
import { LEVEL_META } from "@/lib/alerts/levels";
import type { FireAlert } from "@/lib/alerts/types";
import { createPinIcon } from "./createPinIcon";

type MapLayer = "map" | "satellite";

const TILES: Record<
  MapLayer,
  { url: string; attribution: string; maxZoom: number }
> = {
  map: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
  },
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution:
      "Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics",
    maxZoom: 19,
  },
};

function MapClickHandler({
  enabled,
  onClick,
}: {
  enabled: boolean;
  onClick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      if (!enabled) return;
      onClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function FixMapSize({ layer }: { layer: MapLayer }) {
  const map = useMap();
  useEffect(() => {
    const bump = () => map.invalidateSize({ animate: false });
    const t1 = window.setTimeout(bump, 40);
    const t2 = window.setTimeout(bump, 280);
    window.addEventListener("orientationchange", bump);
    window.addEventListener("resize", bump);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener("orientationchange", bump);
      window.removeEventListener("resize", bump);
    };
  }, [map, layer]);
  return null;
}

function formatReportedAt(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString("pt-BR");
}

function AlertPopup({ alert }: { alert: FireAlert }) {
  return (
    <div className="min-w-[160px] max-w-[220px] text-sm">
      <p
        className="font-semibold"
        style={{ color: LEVEL_META[alert.level].color }}
      >
        {LEVEL_META[alert.level].label}
      </p>
      {alert.frp != null ? (
        <p className="mt-1 text-xs font-medium text-ink">
          FRP {alert.frp.toFixed(1)} MW
        </p>
      ) : null}
      {alert.municipio ? (
        <p className="mt-1 text-ash">
          {[alert.municipio, alert.estado].filter(Boolean).join(" · ")}
        </p>
      ) : alert.description ? (
        <p className="mt-1 text-ash">{alert.description}</p>
      ) : null}
      {alert.bioma ? (
        <p className="mt-1 text-xs text-ash/80">Bioma: {alert.bioma}</p>
      ) : null}
      {alert.satelite ? (
        <p className="mt-1 text-xs text-ash/80">Satélite: {alert.satelite}</p>
      ) : null}
      <p className="mt-2 text-xs text-ash/80">
        {formatReportedAt(alert.reportedAt)}
      </p>
      <p className="mt-1 text-[10px] uppercase tracking-wide text-ash/60">
        {alert.source === "inpe"
          ? "INPE Brasil"
          : alert.source === "nasa"
            ? "NASA FIRMS · mundo"
            : alert.source === "user"
              ? "Reporte neste aparelho"
              : alert.source === "seed"
                ? "Demonstração EcoMind"
                : "EcoMind"}
      </p>
    </div>
  );
}

interface MapViewProps {
  alerts: FireAlert[];
  layer: MapLayer;
  pickMode: boolean;
  onMapClick: (lat: number, lng: number) => void;
  selectedCoords: { lat: number; lng: number } | null;
}

export function MapView({
  alerts,
  layer,
  pickMode,
  onMapClick,
  selectedCoords,
}: MapViewProps) {
  const perf = usePerfProfile();
  const tile = TILES[layer];
  const isTouch = perf.tier !== "high";
  const pinRadius = isTouch ? 6 : 5;

  const pathByLevel = useMemo(() => {
    const out = {} as Record<
      FireAlert["level"],
      { color: string; weight: number; fillColor: string; fillOpacity: number }
    >;
    for (const level of Object.keys(LEVEL_META) as FireAlert["level"][]) {
      out[level] = {
        color: "#ffffff",
        weight: isTouch ? 2 : 1.5,
        fillColor: LEVEL_META[level].color,
        fillOpacity: 0.92,
      };
    }
    return out;
  }, [isTouch]);

  return (
    <MapContainer
      center={WORLD_CENTER}
      zoom={isTouch ? 3 : WORLD_DEFAULT_ZOOM}
      className="z-0 h-full w-full touch-manipulation"
      style={{ height: "100%", width: "100%" }}
      scrollWheelZoom={!isTouch}
      preferCanvas
      zoomControl={!isTouch}
      attributionControl={!isTouch}
      tapTolerance={18}
      maxZoom={isTouch ? 12 : 19}
      minZoom={2}
    >
      <TileLayer
        key={layer}
        attribution={tile.attribution}
        url={tile.url}
        maxZoom={isTouch ? 12 : tile.maxZoom}
        updateWhenZooming={!isTouch}
        updateWhenIdle
        keepBuffer={isTouch ? 1 : 2}
      />
      <FixMapSize layer={layer} />
      <MapClickHandler enabled={pickMode} onClick={onMapClick} />

      {alerts.map((alert) =>
        alert.source === "user" ? (
          <Marker
            key={alert.id}
            position={[alert.lat, alert.lng]}
            icon={createPinIcon(alert.level)}
          >
            <Popup autoPanPadding={[48, 48]}>
              <AlertPopup alert={alert} />
            </Popup>
          </Marker>
        ) : (
          <CircleMarker
            key={alert.id}
            center={[alert.lat, alert.lng]}
            radius={pinRadius}
            pathOptions={pathByLevel[alert.level]}
          >
            <Popup autoPanPadding={[48, 48]}>
              <AlertPopup alert={alert} />
            </Popup>
          </CircleMarker>
        ),
      )}

      {selectedCoords ? (
        <CircleMarker
          center={[selectedCoords.lat, selectedCoords.lng]}
          radius={9}
          pathOptions={{
            color: "#fff",
            weight: 2,
            fillColor: LEVEL_META.critico.color,
            fillOpacity: 1,
          }}
        />
      ) : null}
    </MapContainer>
  );
}
