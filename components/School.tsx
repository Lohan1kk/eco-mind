import { Reveal } from "./Reveal";
import { SectionAtmosphere } from "@/components/ui/section-atmosphere";
import { VerdantAccent } from "@/components/ui/verdant-accent";

const points = [
  "Aprendizado ativo: o aluno participa, não só assiste",
  "Cidadania e responsabilidade com o meio ambiente",
  "Ligação com Geografia, Biologia e atualidades",
  "Engajamento da turma em um projeto real, feito por alunos",
];

export function School() {
  return (
    <section id="escola" className="section relative overflow-hidden bg-forest text-mist">
      <SectionAtmosphere variant="deep" />
      <VerdantAccent corner="br" tone="dark" speed={0.78} />
      <div className="section-inner relative z-[1]">
        <Reveal>
          <p className="eyebrow text-sprout">Na escola</p>
          <h2 className="display mt-4 max-w-3xl text-3xl md:text-5xl">
            Transformar o tema ambiental em aprendizagem viva
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-mist/80">
            A EcoMind dialoga com as notícias e com o currículo — e é um projeto
            da turma, o que aumenta o engajamento.
          </p>
        </Reveal>

        <ul className="mt-12 grid gap-6 sm:grid-cols-2">
          {points.map((point, i) => (
            <Reveal key={point} delayMs={i * 70}>
              <li className="border-l border-sprout/45 pl-5 text-base leading-relaxed text-mist/95">
                {point}
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
