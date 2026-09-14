"use client";

import { useState } from "react";
import { ALERT_LEVELS, LEVEL_META } from "@/lib/alerts/levels";

export function FireLegend({ compact = false }: { compact?: boolean }) {
  const [open, setOpen] = useState(!compact);

  if (compact && !open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg border border-forest/15 bg-white/95 px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-forest shadow-md backdrop-blur-sm"
        aria-expanded={false}
      >
        Legenda
      </button>
    );
  }

  return (
    <div
      className="rounded-lg border border-forest/15 bg-white/95 px-3 py-2.5 shadow-md backdrop-blur-sm"
      aria-label="Legenda de níveis de alerta"
    >
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-ash">
          Níveis (FRP)
        </p>
        {compact ? (
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-xs font-semibold text-forest"
            aria-label="Fechar legenda"
          >
            Fechar
          </button>
        ) : null}
      </div>
      <ul className="space-y-1.5">
        {ALERT_LEVELS.map((level) => (
          <li key={level} className="flex items-center gap-2 text-sm text-ink">
            <span
              className="inline-block h-3.5 w-3.5 shrink-0 rounded-full border border-white shadow-sm"
              style={{ backgroundColor: LEVEL_META[level].color }}
              aria-hidden
            />
            {LEVEL_META[level].label}
          </li>
        ))}
      </ul>
      {!compact ? (
        <p className="mt-2 max-w-[11rem] text-[10px] leading-snug text-ash/75">
          Crítico ≥100 MW · Alto ≥40 · Médio ≥15 · Baixo &lt;15.
        </p>
      ) : null}
    </div>
  );
}
