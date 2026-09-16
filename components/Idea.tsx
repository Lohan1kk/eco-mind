import Image from "next/image";
import { Reveal, StaggerItem, StaggerReveal } from "@/components/motion";
import { SectionAtmosphere } from "@/components/ui/section-atmosphere";
import { VerdantWash } from "@/components/ui/verdant-accent";

export function Idea() {
  return (
    <section id="ideia" className="section section-botanical relative overflow-hidden">
      <SectionAtmosphere variant="soft" />
      <VerdantWash tone="light" speed={0.36} />
      <div className="section-inner relative z-[1] grid items-center gap-12 md:grid-cols-[1.15fr_0.85fr] md:gap-16">
        <StaggerReveal staggerChildren={0.1} delayChildren={0.04}>
          <StaggerItem soft>
            <p className="eyebrow text-forest-mid">Nossa ideia</p>
          </StaggerItem>
          <StaggerItem>
            <h2 className="display mt-4 text-3xl text-forest md:text-5xl">
              A semente que vira broto
            </h2>
          </StaggerItem>
          <StaggerItem soft>
            <p className="lede mt-6 max-w-xl">
              A EcoMind nasceu na escola. Em vez de só reagir às notícias, criamos
              um app que educa sobre desmatamento e queimadas, oferece ferramentas
              práticas e mostra caminhos concretos para agir.
            </p>
          </StaggerItem>
          <StaggerItem soft>
            <p className="lede mt-4 max-w-xl">
              Pequenas ações plantadas hoje podem crescer em mudança real — na
              escola, em casa e na comunidade.
            </p>
          </StaggerItem>
        </StaggerReveal>

        <Reveal
          delayMs={160}
          variant="scale"
          className="flex flex-col items-center justify-center text-center md:items-end md:text-right"
        >
          <Image
            src="/brand/logo-ecomind.png"
            alt="Logo EcoMind"
            width={240}
            height={240}
            className="h-40 w-40 object-contain md:h-48 md:w-48"
            sizes="192px"
            priority={false}
          />
          <p className="display mt-5 text-2xl text-forest md:text-3xl">
            EcoMind
          </p>
          <p className="mt-2 text-sm text-ash">natureza + consciência</p>
        </Reveal>
      </div>
    </section>
  );
}
