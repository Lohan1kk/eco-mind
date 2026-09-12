import { Reveal } from "./Reveal";

const steps = [
  {
    n: "01",
    title: "Educar",
    text: "Informação clara sobre causas e efeitos do desmatamento e das queimadas.",
  },
  {
    n: "02",
    title: "Missões",
    text: "Desafios de conscientização — o aluno participa, não só assiste.",
  },
  {
    n: "03",
    title: "Agir",
    text: "Hábitos e engajamento concreto na escola, em casa e na comunidade.",
  },
];

export function HowItWorks() {
  return (
    <section id="como-funciona" className="section bg-paper">
      <div className="section-inner">
        <Reveal>
          <p className="eyebrow text-forest-mid">Como funciona</p>
          <h2 className="display mt-4 max-w-3xl text-3xl text-ink md:text-5xl">
            Do conhecimento à ação, em três passos
          </h2>
        </Reveal>

        <ol className="mt-14 grid gap-10 md:grid-cols-3 md:gap-0">
          {steps.map((step, i) => (
            <Reveal key={step.n} delayMs={i * 100}>
              <li
                className={`${i > 0 ? "border-t border-[var(--line)] pt-10 md:border-l md:border-t-0 md:pt-0 md:pl-8" : ""} ${i < steps.length - 1 ? "md:pr-8" : ""}`}
              >
                <span className="display text-5xl text-sprout-deep/25">
                  {step.n}
                </span>
                <h3 className="mt-3 font-display text-2xl font-semibold text-forest">
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
