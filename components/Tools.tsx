import Link from "next/link";
import { Reveal } from "./Reveal";

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
    desc: "Teste o que você sabe sobre clima, Amazônia e impacto pessoal.",
    cta: "Fazer o quiz",
  },
  {
    href: "/alerta-queimadas",
    step: "03",
    title: "Mapa de queimadas",
    desc: "Focos reais de satélite (INPE) no Brasil, quase em tempo real.",
    cta: "Abrir o mapa",
  },
];

export function Tools() {
  return (
    <section id="ferramentas" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-forest-mid">
            Ferramentas
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold leading-tight text-ink md:text-5xl">
            Três caminhos para plantar consciência
          </h2>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-ash">
            Educação e ação no mesmo lugar — sem ruído, só o essencial para
            começar.
          </p>
        </Reveal>

        <ul className="mt-14 divide-y divide-forest/12 border-y border-forest/12">
          {tools.map((tool, i) => (
            <Reveal key={tool.href} delayMs={i * 90}>
              <li>
                <Link
                  href={tool.href}
                  className="group grid gap-3 py-8 transition md:grid-cols-[4.5rem_1fr_auto] md:items-center md:gap-8 md:py-10"
                >
                  <span className="font-display text-3xl font-semibold text-sprout-deep/30 transition group-hover:text-sprout-deep/55">
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
