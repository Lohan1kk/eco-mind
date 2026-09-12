import Image from "next/image";
import Link from "next/link";
import { Reveal } from "./Reveal";

const items = [
  {
    title: "Desmatamento e queimadas",
    text: "Florestas destruídas, biodiversidade ameaçada e um futuro mais frágil para quem depende da natureza.",
  },
  {
    title: "Notícias sem caminho",
    text: "Acompanhar o problema sem saber por onde começar gera impotência — e a ação fica para depois.",
  },
  {
    title: "Falta uma ponte",
    text: "Entre preocupação e prática: informação clara, hábitos concretos e engajamento na escola e na comunidade.",
  },
];

export function Problem() {
  return (
    <section id="problema" className="section bg-paper">
      <div className="section-inner">
        <Reveal>
          <p className="eyebrow text-burn">O problema</p>
          <h2 className="display mt-4 max-w-3xl text-3xl text-ink md:text-5xl">
            Florestas desaparecem. A sensação de impotência permanece.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
          {items.map((item, i) => (
            <Reveal key={item.title} delayMs={i * 90}>
              <article className="border-t border-burn/30 pt-6">
                <h3 className="font-display text-xl font-semibold text-earth">
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
