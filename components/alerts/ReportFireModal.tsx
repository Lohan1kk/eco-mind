"use client";

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
  onUseGeolocation,
  submitting,
  error,
}: ReportFireModalProps) {
  if (!open) return null;

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
              Informe o local e o nível. O reporte fica salvo neste aparelho.
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
                {pickMode
                  ? "Clique no mapa para marcar o local."
                  : "Escolha uma forma de definir o local."}
              </p>
            )}
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={onStartPickMode}
                className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                  pickMode
                    ? "bg-forest text-mist"
                    : "bg-forest/10 text-forest"
                }`}
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
            <label htmlFor="level" className="block text-sm font-semibold text-ink">
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
            {submitting ? "Enviando..." : "Enviar alerta"}
          </button>
        </form>
      </div>
    </div>
  );
}
