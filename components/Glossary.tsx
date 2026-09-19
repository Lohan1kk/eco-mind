"use client";

import { GLOSSARY_TERMS } from "@/data/glossary";
import { Reveal, StaggerItem, StaggerReveal } from "@/components/motion";
import { SectionAtmosphere } from "@/components/ui/section-atmosphere";
import { VerdantWash } from "@/components/ui/verdant-accent";

export function Glossary() {
  return (
    <section id="glossario" className="section relative overflow-hidden bg-mist">
      <SectionAtmosphere variant="mist" />
      <VerdantWash tone="light" speed={0.32} />
      <div className="section-inner relative z-[1]">
        <Reveal>
          <p className="eyebrow text-forest-mid">Especificações</p>
          <h2 className="display mt-4 max-w-3xl text-3xl text-ink md:text-5xl">
            O que significam esses termos
          </h2>
          <p className="lede mt-5 max-w-xl">
            ppm, CO₂, FRP e outros números do site — explicados em linguagem
            clara, sem precisar ser especialista.
          </p>
        </Reveal>

        <StaggerReveal
          className="mt-12 divide-y divide-forest/10 border-y border-forest/10"
          staggerChildren={0.05}
          delayChildren={0.04}
        >
          {GLOSSARY_TERMS.map((item) => (
            <StaggerItem key={item.term} soft>
              <div className="grid gap-2 py-5 sm:grid-cols-[minmax(8rem,14rem)_1fr] sm:gap-8">
                <p className="font-display text-lg font-semibold text-forest">
                  {item.term}
                </p>
                <p className="text-sm leading-relaxed text-ash sm:text-base">
                  {item.meaning}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerReveal>

        <Reveal delayMs={120}>
          <p className="mt-8 max-w-2xl text-sm text-ash">
            Esses significados aparecem na realidade climática, na calculadora e
            no mapa de queimadas. Se ainda tiver dúvida, use o quiz — as
            respostas reforçam o mesmo vocabulário.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
