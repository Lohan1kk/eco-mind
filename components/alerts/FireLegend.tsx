import { LEVEL_META, ALERT_LEVELS } from "@/lib/alerts/levels";

export function FireLegend() {
  return (
    <div
      className="rounded-lg border border-forest/15 bg-white/95 px-2.5 py-2 shadow-md sm:px-3 sm:py-2.5 sm:backdrop-blur-sm"
      aria-label="Legenda de níveis de alerta"
    >
      <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-ash sm:mb-2 sm:text-xs">
        FRP
      </p>
      <ul className="flex flex-wrap gap-x-2.5 gap-y-1 sm:block sm:space-y-1.5">
        {ALERT_LEVELS.map((level) => (
          <li
            key={level}
            className="flex items-center gap-1.5 text-[11px] text-ink sm:gap-2 sm:text-sm"
          >
            <span
              className="inline-block h-2.5 w-2.5 shrink-0 rounded-full border border-white shadow-sm sm:h-3 sm:w-3"
              style={{ backgroundColor: LEVEL_META[level].color }}
              aria-hidden
            />
            {LEVEL_META[level].label}
          </li>
        ))}
      </ul>
      <p className="mt-1.5 hidden max-w-[12rem] text-[10px] leading-snug text-ash/75 sm:mt-2 sm:block">
        FRP = potência do fogo (MW). Crítico ≥100 · Alto ≥40 · Médio ≥15 · Baixo
        &lt;15.{" "}
        <a href="/#glossario" className="underline underline-offset-2">
          Glossário
        </a>
      </p>
    </div>
  );
}
