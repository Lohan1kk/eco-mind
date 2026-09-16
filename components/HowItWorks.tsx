import { Reveal } from "./Reveal";
import { SectionAtmosphere } from "@/components/ui/section-atmosphere";
import { VerdantWash } from "@/components/ui/verdant-accent";

const steps = [
  {
    n: "01",
    title: "Educar",
    text: "Informação clara sobre causas e efeitos do desmatamento e das queimadas.",
  },
  {
    n: "02",
    title: "Praticar",
    text: "Calculadora, quiz e mapa — o aluno experimenta as ferramentas, não só assiste.",
  },
  {
    n: "03",
    title: "Agir",
    text: "Hábitos e engajamento concreto na escola, em casa e na comunidade.",
  },
];

export function HowItWorks() {
  return (
    <section id="como-funciona" className="section section-botanical relative overflow-hidden">
      <SectionAtmosphere variant="soft" />
      <VerdantWash tone="light" speed={0.4} />
      <div className="section-inner relative z-[1]">
        <Reveal>
          <p className="eyebrow text-forest-mid">Como funciona</p>
          <h2 className="display mt-4 max-w-3xl text-3xl text-ink md:text-5xl">
            Do conhecimento à ação, em três passos
          </h2>
        </Reveal>

        <ol className="mt-16 grid gap-6 md:grid-cols-3">
          {steps.map((step, i) => (
            <Reveal key={step.n} delayMs={i * 100}>
              <li className="panel-soft relative h-full overflow-hidden p-7">
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-2 -top-4 display text-[7rem] leading-none text-forest/[0.06]"
                >
                  {step.n}
                </span>
                <p className="eyebrow text-forest-mid">Passo {step.n}</p>
                <h3 className="mt-4 font-display text-2xl font-semibold text-forest">
                  {step.title}
                </h3>
                <p className="mt-3 max-w-xs text-base leading-relaxed text-ash">
                  {step.text}
                </p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
