import { CloudFog } from "lucide-react";
import { Reveal } from "./Reveal";
import { SmokeCard } from "@/components/ui/smoke-card";

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
    <section id="problema" className="section section-warm">
      <div className="section-inner">
        <Reveal>
          <p className="eyebrow text-burn">O problema</p>
          <h2 className="display mt-4 max-w-3xl text-3xl text-ink md:text-5xl">
            Florestas desaparecem. A sensação de impotência permanece.
          </h2>
          <p className="lede mt-5 max-w-2xl">
            Todo mundo vê as notícias. Quase ninguém encontra um próximo passo
            claro no dia a dia.
          </p>
        </Reveal>

        <div className="mt-14 grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-14">
          <Reveal>
            <div className="overflow-hidden rounded-2xl border border-forest/10 bg-forest p-5 shadow-sm md:p-6">
              <div className="mb-4 flex items-center gap-2 text-sprout/85">
                <CloudFog className="h-4 w-4 shrink-0" aria-hidden strokeWidth={1.75} />
                <p className="text-xs font-semibold uppercase tracking-[0.18em]">
                  Névoa da floresta
                </p>
              </div>
              <SmokeCard className="aspect-[4/5] w-full max-h-[22rem] sm:aspect-square sm:max-h-none" />
              <p className="mt-4 text-sm leading-relaxed text-mist/70">
                Passe o cursor sobre o quadro. A névoa verde acompanha o gesto —
                como o ar da floresta, frágil e em movimento.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-1 md:gap-5">
            {items.map((item, i) => (
              <Reveal key={item.title} delayMs={i * 90}>
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
      </div>
    </section>
  );
}
