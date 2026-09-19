import Image from "next/image";
import { Reveal } from "@/components/motion";
import { SectionAtmosphere } from "@/components/ui/section-atmosphere";
import { VerdantWash } from "@/components/ui/verdant-accent";

const team = [
  {
    name: "Ana Flávia",
    role: "Designer e Marketing",
    image: "/team/foto-ana.png",
  },
  {
    name: "André Zauli",
    role: "Programador",
    image: "/team/foto-andre.png",
  },
  {
    name: "Lucas Lohan",
    role: "Programador e Conteúdo",
    image: "/team/foto-lucas.png",
  },
  {
    name: "Gabriel Rosa",
    role: "Conteúdo e Designer",
    image: "/team/foto-gabriel.png",
  },
];

export function Team() {
  return (
    <section id="equipe" className="section section-soft relative overflow-hidden">
      <SectionAtmosphere variant="soft" />
      <VerdantWash tone="light" speed={0.35} />
      <div className="section-inner relative z-[1]">
        <Reveal>
          <p className="eyebrow text-forest-mid">Equipe</p>
          <h2 className="display mt-4 text-3xl text-ink md:text-5xl">
            Quatro alunos, uma causa
          </h2>
          <p className="lede mt-5 max-w-xl">
            Design, programação e conteúdo — um time escolar transformando
            preocupação em ferramenta.
          </p>
        </Reveal>

        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((person, i) => (
            <Reveal key={person.name} delayMs={i * 80}>
              <li className="panel-soft px-5 py-8 text-center">
                <div className="mx-auto h-28 w-28 overflow-hidden rounded-full ring-2 ring-sprout/40">
                  <Image
                    src={person.image}
                    alt={person.name}
                    width={112}
                    height={112}
                    className="h-full w-full object-cover"
                    sizes="112px"
                  />
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold text-ink">
                  {person.name}
                </h3>
                <p className="mt-1 text-sm text-ash">{person.role}</p>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
