import { Reveal } from "./Reveal";

const badges = [
  "Dados INPE",
  "Projeto escolar",
  "100% gratuito",
  "Instalável no celular",
];

export function TrustStrip() {
  return (
    <section className="border-b border-forest/10 bg-white/40 py-7">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <Reveal>
          <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
            {badges.map((b) => (
              <li
                key={b}
                className="text-sm font-medium tracking-wide text-ash"
              >
                {b}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
