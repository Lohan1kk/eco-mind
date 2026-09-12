"use client";

import { useEffect } from "react";
import { ALERT_LEVELS, LEVEL_META } from "@/lib/alerts/levels";
import type { AlertLevel } from "@/lib/alerts/types";

interface ReportFireModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    lat: number;
    lng: number;
    level: AlertLevel;
    description?: string;
  }) => Promise<void>;
  coords: { lat: number; lng: number } | null;
  pickMode: boolean;
  onStartPickMode: () => void;
  onCancelPickMode: () => void;
  onUseGeolocation: () => void;
  submitting: boolean;
  error: string | null;
}

export function ReportFireModal({
  open,
  onClose,
  onSubmit,
  coords,
  pickMode,
  onStartPickMode,
  onCancelPickMode,
  onUseGeolocation,
  submitting,
  error,
}: ReportFireModalProps) {
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (pickMode) onCancelPickMode();
        else onClose();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, pickMode, onCancelPickMode, onClose]);

  if (!open) return null;

  // Compact banner while picking — full overlay would block the map.
  if (pickMode) {
    return (
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[1200] flex justify-center p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <div className="pointer-events-auto flex w-full max-w-md items-center gap-3 rounded-xl border border-forest/15 bg-white/95 px-4 py-3 shadow-lg backdrop-blur-sm">
          <p className="flex-1 text-sm font-medium text-forest">
            Toque no mapa para marcar o foco
          </p>
          <button
            type="button"
            onClick={onCancelPickMode}
            className="rounded-md bg-forest/10 px-3 py-1.5 text-sm font-semibold text-forest"
          >
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!coords) return;

    const form = e.currentTarget;
    const level = (form.elements.namedItem("level") as HTMLSelectElement).value;
    const description = (
      form.elements.namedItem("description") as HTMLTextAreaElement
    ).value;

    if (!ALERT_LEVELS.includes(level as AlertLevel)) return;

    await onSubmit({
      lat: coords.lat,
      lng: coords.lng,
      level: level as AlertLevel,
      description: description.trim() || undefined,
    });
  }

  return (
    <div
      className="fixed inset-0 z-[1200] flex items-end justify-center bg-ink/50 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-title"
    >
      <div className="w-full max-w-md rounded-xl bg-mist p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              id="report-title"
              className="font-display text-xl font-semibold text-forest"
            >
              Reportar queimada
            </h2>
            <p className="mt-1 text-sm text-ash">
              O reporte fica salvo neste aparelho (não sincroniza na nuvem).
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-2 py-1 text-sm text-ash hover:bg-forest/10"
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <p className="text-sm font-semibold text-ink">Localização</p>
            {coords ? (
              <p className="mt-1 text-sm text-ash">
                {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
              </p>
            ) : (
              <p className="mt-1 text-sm text-burn">
                Escolha uma forma de definir o local.
              </p>
            )}
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={onStartPickMode}
                className="rounded-md bg-forest/10 px-3 py-1.5 text-sm font-medium text-forest"
              >
                Marcar no mapa
              </button>
              <button
                type="button"
                onClick={onUseGeolocation}
                className="rounded-md bg-forest/10 px-3 py-1.5 text-sm font-medium text-forest"
              >
                Usar minha localização
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="level"
              className="block text-sm font-semibold text-ink"
            >
              Nível de alerta
            </label>
            <select
              id="level"
              name="level"
              defaultValue="medio"
              className="mt-1.5 w-full rounded-md border border-forest/20 bg-white px-3 py-2 text-ink outline-none focus:border-forest-mid focus:ring-2 focus:ring-sprout/60"
            >
              {ALERT_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {LEVEL_META[level].label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-semibold text-ink"
            >
              Descrição (opcional)
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              maxLength={500}
              placeholder="Ex.: fumaça visível, área de mata..."
              className="mt-1.5 w-full resize-y rounded-md border border-forest/20 bg-white px-3 py-2 text-ink outline-none focus:border-forest-mid focus:ring-2 focus:ring-sprout/60"
            />
          </div>

          {error ? (
            <p role="alert" className="text-sm font-medium text-burn">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={!coords || submitting}
            className="w-full rounded-md bg-forest px-4 py-3 text-sm font-semibold text-mist transition hover:bg-forest-mid disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Salvando..." : "Salvar neste aparelho"}
          </button>
        </form>
      </div>
    </div>
  );
}
