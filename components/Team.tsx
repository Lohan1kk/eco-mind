import Image from "next/image";
import { Reveal } from "./Reveal";

const team = [
  {
    name: "Ana Flávia",
    role: "CEO / Design",
    image: "/team/foto-ana.png",
  },
  {
    name: "André Zauli",
    role: "Tecnologia / Programação",
    image: "/team/foto-andre.png",
  },
  {
    name: "Lucas Lohan",
    role: "CTO / UX-UI",
    image: "/team/foto-lucas.png",
  },
  {
    name: "Gabriel Rosa",
    role: "Marketing / Conteúdo",
    image: "/team/foto-gabriel.png",
  },
];

export function Team() {
  return (
    <section id="equipe" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-forest-mid">
            Nossa equipe
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold leading-tight text-ink md:text-5xl">
            Quatro alunos, uma causa
          </h2>
          <p className="mt-4 max-w-xl text-lg text-ash">
            Design, programação e conteúdo — um time escolar transformando
            preocupação em ferramenta.
          </p>
        </Reveal>

        <ul className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((person, i) => (
            <Reveal key={person.name} delayMs={i * 90}>
              <li className="text-center">
                <div className="mx-auto h-28 w-28 overflow-hidden rounded-full border border-forest/15">
                  <Image
                    src={person.image}
                    alt={person.name}
                    width={112}
                    height={112}
                    className="h-full w-full object-cover"
                    sizes="112px"
                  />
                </div>
                <h3 className="mt-4 font-display text-xl font-semibold text-ink">
                  {person.name}
                </h3>
                <p className="mt-1 text-sm leading-snug text-ash">
                  {person.role}
                </p>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
