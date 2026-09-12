import Image from "next/image";
import { Reveal } from "./Reveal";

export function Idea() {
  return (
    <section id="ideia" className="section section-botanical">
      <div className="section-inner grid items-center gap-12 md:grid-cols-[1.15fr_0.85fr] md:gap-16">
        <Reveal>
          <p className="eyebrow text-forest-mid">Nossa ideia</p>
          <h2 className="display mt-4 text-3xl text-forest md:text-5xl">
            A semente que vira broto
          </h2>
          <p className="lede mt-6 max-w-xl">
            A EcoMind nasceu na escola. Em vez de só reagir às notícias, criamos
            um app que educa sobre desmatamento e queimadas, propõe missões de
            conscientização e mostra caminhos práticos para agir.
          </p>
          <p className="lede mt-4 max-w-xl">
            Pequenas ações plantadas hoje podem crescer em mudança real — na
            escola, em casa e na comunidade.
          </p>
        </Reveal>

        <Reveal delayMs={120} className="flex justify-center md:justify-end">
          <div className="brand-mark flex aspect-square w-full max-w-[18rem] flex-col items-center justify-center rounded-[2rem] px-8 py-10 text-center">
            <Image
              src="/brand/logo-ecomind.png"
              alt="Logo EcoMind"
              width={220}
              height={220}
              className="h-36 w-36 object-contain md:h-40 md:w-40"
              sizes="160px"
            />
            <p className="display mt-5 text-2xl text-forest">EcoMind</p>
            <p className="mt-2 text-sm text-ash">natureza + consciência</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
