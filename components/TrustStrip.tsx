const badges = [
  "Dados INPE",
  "Projeto escolar",
  "100% gratuito",
  "Instalável no celular",
];

export function TrustStrip() {
  return (
    <section className="border-b border-[var(--line)] bg-paper">
      <div className="section-inner flex flex-wrap items-center justify-center gap-x-10 gap-y-3 py-6">
        {badges.map((badge) => (
          <p
            key={badge}
            className="text-sm font-medium tracking-[0.04em] text-ash"
          >
            {badge}
          </p>
        ))}
      </div>
    </section>
  );
}
