const badges = [
  "Dados INPE",
  "Projeto escolar",
  "100% gratuito",
  "Instalável no celular",
];

export function TrustStrip() {
  return (
    <section className="section-soft border-b border-[var(--line)]">
      <div className="section-inner flex flex-wrap items-center justify-center gap-x-3 gap-y-3 py-7 md:gap-x-4">
        {badges.map((badge, i) => (
          <div key={badge} className="flex items-center gap-3 md:gap-4">
            {i > 0 ? (
              <span
                aria-hidden
                className="hidden h-1 w-1 rounded-full bg-forest/25 sm:block"
              />
            ) : null}
            <p className="rounded-full border border-forest/10 bg-paper/70 px-4 py-1.5 text-sm font-medium tracking-[0.04em] text-ash backdrop-blur-sm">
              {badge}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
