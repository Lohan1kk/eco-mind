"use client";

import { useEffect } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { BRAZIL_CENTER, BRAZIL_DEFAULT_ZOOM } from "@/lib/alerts/geo";
import { LEVEL_META } from "@/lib/alerts/levels";
import type { FireAlert } from "@/lib/alerts/types";
import { createPinIcon } from "./createPinIcon";

type MapLayer = "map" | "satellite";

const TILES: Record<MapLayer, { url: string; attribution: string }> = {
  map: {
    // Carto Voyager — more reliable than OSM on some hosts
    url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
  },
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution:
      "Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics",
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

function InvalidateOnChange({ layer }: { layer: MapLayer }) {
  const map = useMap();
  useEffect(() => {
    const id = window.setTimeout(() => map.invalidateSize(), 80);
    return () => window.clearTimeout(id);
  }, [map, layer]);
  return null;
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
  const tile = TILES[layer];

  return (
    <MapContainer
      center={BRAZIL_CENTER}
      zoom={BRAZIL_DEFAULT_ZOOM}
      className="z-0 h-full w-full"
      scrollWheelZoom
      preferCanvas
    >
      <TileLayer
        key={layer}
        attribution={tile.attribution}
        url={tile.url}
        maxZoom={19}
      />
      <InvalidateOnChange layer={layer} />
      <MapClickHandler enabled={pickMode} onClick={onMapClick} />

      {alerts.map((alert) => (
        <Marker
          key={alert.id}
          position={[alert.lat, alert.lng]}
          icon={createPinIcon(alert.level)}
        >
          <Popup>
            <div className="min-w-[170px] text-sm">
              <p className="font-semibold text-ink">
                {LEVEL_META[alert.level].label}
              </p>
              {alert.municipio ? (
                <p className="mt-1 text-ash">
                  {[alert.municipio, alert.estado].filter(Boolean).join(" · ")}
                </p>
              ) : alert.description ? (
                <p className="mt-1 text-ash">{alert.description}</p>
              ) : null}
              {alert.satelite ? (
                <p className="mt-1 text-xs text-ash/80">
                  Satélite: {alert.satelite}
                </p>
              ) : null}
              <p className="mt-2 text-xs text-ash/80">
                {new Date(alert.reportedAt).toLocaleString("pt-BR")}
              </p>
              <p className="mt-1 text-[10px] uppercase tracking-wide text-ash/60">
                {alert.source === "inpe"
                  ? "INPE"
                  : alert.source === "nasa"
                    ? "NASA FIRMS"
                    : alert.source === "user"
                      ? "Reporte comunitário"
                      : "EcoMind"}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}

      {selectedCoords ? (
        <Marker
          position={[selectedCoords.lat, selectedCoords.lng]}
          icon={createPinIcon("critico")}
        />
      ) : null}
    </MapContainer>
  );
}
