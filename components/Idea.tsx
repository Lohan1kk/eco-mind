import Image from "next/image";
import { Reveal } from "./Reveal";

export function Idea() {
  return (
    <section
      id="ideia"
      className="relative border-y border-forest/10 bg-mist-soft/60 py-20 md:py-28"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 md:grid-cols-[1.2fr_0.8fr] md:gap-16 md:px-8">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-forest-mid">
            Nossa ideia
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold leading-tight text-forest md:text-5xl">
            A semente que vira broto
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-ash">
            A EcoMind nasceu na escola. Em vez de só se indignar com as notícias,
            criamos um app que educa sobre causas e efeitos do desmatamento e das
            queimadas, propõe missões de conscientização e mostra caminhos
            práticos para agir.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-ash">
            Pequenas ações e conhecimento plantados hoje podem crescer em mudança
            real — na escola, em casa e na comunidade.
          </p>
        </Reveal>

        <Reveal delayMs={120} className="flex justify-center md:justify-end">
          <Image
            src="/brand/logo-ecomind.png"
            alt="Logo EcoMind: folha e mente conectadas"
            width={512}
            height={512}
            className="h-auto w-44 md:w-52"
            sizes="(max-width: 768px) 176px, 208px"
          />
        </Reveal>
      </div>
    </section>
  );
}
