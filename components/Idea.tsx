import Image from "next/image";
import { Reveal } from "./Reveal";

export function Idea() {
  return (
    <section id="ideia" className="section bg-mist-soft/70">
      <div className="section-inner grid items-center gap-12 md:grid-cols-[1.15fr_0.85fr] md:gap-20">
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
          <Image
            src="/brand/logo-ecomind.png"
            alt="Logo EcoMind"
            width={420}
            height={420}
            className="h-auto w-48 md:w-56"
            sizes="(max-width: 768px) 192px, 224px"
          />
        </Reveal>
      </div>
    </section>
  );
}
