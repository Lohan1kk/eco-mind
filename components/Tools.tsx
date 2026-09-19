import Link from "next/link";
import { Reveal, StaggerItem, StaggerReveal } from "@/components/motion";
import { SectionAtmosphere } from "@/components/ui/section-atmosphere";
import { VerdantWash } from "@/components/ui/verdant-accent";

const tools = [
  {
    href: "/calculadora",
    step: "01",
    title: "Calculadora",
    desc: "Descubra sua pegada de carbono com transporte, alimentação e energia.",
    cta: "Calcular agora",
  },
  {
    href: "/quiz",
    step: "02",
    title: "Quiz",
    desc: "Teste o que você sabe sobre o conteúdo da EcoMind: problema, ferramentas e dados do clima.",
    cta: "Fazer o quiz",
  },
  {
    href: "/alerta-queimadas",
    step: "03",
    title: "Mapa de queimadas",
    desc: "Focos reais de satélite: INPE no Brasil e NASA FIRMS no mundo.",
    cta: "Abrir o mapa",
  },
];

export function Tools() {
  return (
    <section id="ferramentas" className="section section-soft relative overflow-hidden">
      <SectionAtmosphere variant="soft" />
      <VerdantWash tone="light" speed={0.37} />
      <div className="section-inner relative z-[1]">
        <StaggerReveal staggerChildren={0.1} delayChildren={0.04}>
          <StaggerItem soft>
            <p className="eyebrow text-forest-mid">Ferramentas</p>
          </StaggerItem>
          <StaggerItem>
            <h2 className="display mt-4 max-w-3xl text-3xl text-ink md:text-5xl">
              Três caminhos para plantar consciência
            </h2>
          </StaggerItem>
          <StaggerItem soft>
            <p className="lede mt-5 max-w-2xl">
              Educação e ação no mesmo lugar — sem ruído, só o essencial para
              começar.
            </p>
          </StaggerItem>
        </StaggerReveal>

        <ul className="mt-14 space-y-4">
          {tools.map((tool, i) => (
            <Reveal key={tool.href} delayMs={140 + i * 110} variant="slideUp">
              <li>
                <Link
                  href={tool.href}
                  className="panel-soft group grid gap-3 p-6 transition hover:border-forest/25 md:grid-cols-[5rem_1fr_auto] md:items-center md:gap-10 md:p-8"
                >
                  <span className="display text-3xl text-sprout-deep/35 transition group-hover:text-sprout-deep/70">
                    {tool.step}
                  </span>
                  <div>
                    <h3 className="font-display text-2xl font-semibold text-forest transition group-hover:text-forest-mid">
                      {tool.title}
                    </h3>
                    <p className="mt-2 max-w-xl text-base leading-relaxed text-ash">
                      {tool.desc}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-forest-mid underline-offset-4 group-hover:underline">
                    {tool.cta} →
                  </span>
                </Link>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
