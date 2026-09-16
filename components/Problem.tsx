import { Reveal, StaggerItem, StaggerReveal } from "@/components/motion";
import { SectionAtmosphere } from "@/components/ui/section-atmosphere";
import { VerdantWash } from "@/components/ui/verdant-accent";

const items = [
  {
    n: "01",
    title: "Desmatamento e queimadas",
    text: "Florestas destruídas, biodiversidade ameaçada e um futuro mais frágil para quem depende da natureza.",
  },
  {
    n: "02",
    title: "Notícias sem caminho",
    text: "Acompanhar o problema sem saber por onde começar gera impotência — e a ação fica para depois.",
  },
  {
    n: "03",
    title: "Falta uma ponte",
    text: "Entre preocupação e prática: informação clara, hábitos concretos e engajamento na escola e na comunidade.",
  },
];

export function Problem() {
  return (
    <section id="problema" className="section section-warm relative overflow-hidden">
      <SectionAtmosphere variant="mist" />
      <VerdantWash tone="light" speed={0.38} />
      <div className="section-inner relative z-[1]">
        <StaggerReveal staggerChildren={0.11} delayChildren={0.04}>
          <StaggerItem soft>
            <p className="eyebrow text-burn">O problema</p>
          </StaggerItem>
          <StaggerItem>
            <h2 className="display mt-4 max-w-3xl text-3xl text-ink md:text-5xl">
              Florestas desaparecem. A sensação de impotência permanece.
            </h2>
          </StaggerItem>
          <StaggerItem soft>
            <p className="lede mt-5 max-w-2xl">
              Todo mundo vê as notícias. Quase ninguém encontra um próximo passo
              claro no dia a dia.
            </p>
          </StaggerItem>
        </StaggerReveal>

        <div className="mt-16 grid gap-8 md:grid-cols-3 md:gap-6">
          {items.map((item, i) => (
            <Reveal key={item.title} delayMs={120 + i * 100} variant="fadeUp">
              <article className="panel-soft h-full p-6 md:p-7">
                <span className="display text-4xl text-burn/25">{item.n}</span>
                <h3 className="mt-4 font-display text-xl font-semibold text-earth">
                  {item.title}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-ash">
                  {item.text}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
