"use client";

import { StaggerItem, StaggerReveal } from "@/components/motion";

export function AlertaIntro() {
  return (
    <StaggerReveal
      className="relative z-[1]"
      staggerChildren={0.06}
      delayChildren={0.02}
    >
      <StaggerItem soft>
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-burn md:text-xs">
          Agir com dados
        </p>
      </StaggerItem>
      <StaggerItem>
        <h1 className="mt-0.5 font-display text-lg font-semibold text-forest md:mt-1 md:text-2xl">
          Alerta de queimadas
        </h1>
      </StaggerItem>
      <StaggerItem soft>
        <p className="mt-1 max-w-2xl text-xs leading-snug text-ash md:text-sm md:leading-normal">
          <span className="md:hidden">
            INPE + NASA · toque no pin · + para reportar no Brasil.
          </span>
          <span className="hidden md:inline">
            Focos no mundo (NASA FIRMS, 24h) e no Brasil (INPE diário + 10 min),
            coloridos por intensidade (FRP): crítico, alto, médio e baixo.
            Amostra diversificada — não é inventário completo. Toque no pin para
            identificar. O + marca um foco no Brasil neste aparelho.
          </span>
        </p>
      </StaggerItem>
    </StaggerReveal>
  );
}
