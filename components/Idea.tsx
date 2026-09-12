import Image from "next/image";
import { Reveal } from "./Reveal";

export function Idea() {
  return (
    <section id="ideia" className="section section-botanical">
      <div className="section-inner grid items-center gap-12 md:grid-cols-[1.1fr_0.9fr] md:gap-16">
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

        <Reveal delayMs={120}>
          <div className="brand-panel relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden md:mx-0 md:ml-auto">
            <Image
              src="/brand/hero-forest.jpg"
              alt=""
              fill
              sizes="(max-width: 768px) 90vw, 420px"
              className="object-cover object-center"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-[rgba(18,40,28,0.72)] via-[rgba(18,40,28,0.25)] to-transparent"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-end px-6 pb-10 text-center">
              <Image
                src="/brand/logo-ecomind.png"
                alt="Logo EcoMind"
                width={160}
                height={160}
                className="h-24 w-24 object-contain drop-shadow-lg md:h-28 md:w-28"
              />
              <p className="display mt-4 text-2xl text-mist">EcoMind</p>
              <p className="mt-2 text-sm text-mist/75">
                natureza + consciência
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
