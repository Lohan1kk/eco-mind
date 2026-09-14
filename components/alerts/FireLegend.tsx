import { LEVEL_META, ALERT_LEVELS } from "@/lib/alerts/levels";

export function FireLegend() {
  return (
    <div
      className="rounded-lg border border-forest/15 bg-white/95 px-3 py-2.5 shadow-md backdrop-blur-sm"
      aria-label="Legenda de níveis de alerta"
    >
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ash">
        Identificação (FRP)
      </p>
      <ul className="space-y-1.5">
        {ALERT_LEVELS.map((level) => (
          <li key={level} className="flex items-center gap-2 text-sm text-ink">
            <span
              className="inline-block h-3 w-3 shrink-0 rounded-full border border-white shadow-sm"
              style={{ backgroundColor: LEVEL_META[level].color }}
              aria-hidden
            />
            {LEVEL_META[level].label}
          </li>
        ))}
      </ul>
      <p className="mt-2 max-w-[11rem] text-[10px] leading-snug text-ash/75">
        Crítico ≥100 MW · Alto ≥40 · Médio ≥15 · Baixo &lt;15. Toque no pin para
        ver FRP e satélite.
      </p>
    </div>
  );
}
