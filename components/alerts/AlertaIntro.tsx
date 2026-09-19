"use client";

import { StaggerItem, StaggerReveal } from "@/components/motion";

export function AlertaIntro() {
  return (
    <StaggerReveal
      className="relative z-[1]"
      staggerChildren={0.09}
      delayChildren={0.03}
    >
      <StaggerItem soft>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-burn">
          Agir com dados
        </p>
      </StaggerItem>
      <StaggerItem>
        <h1 className="mt-1 font-display text-xl font-semibold text-forest md:text-2xl">
          Alerta de queimadas
        </h1>
      </StaggerItem>
      <StaggerItem soft>
        <p className="mt-1 max-w-2xl text-sm text-ash">
          Focos no mundo (NASA FIRMS, 24h) e no Brasil (INPE diário + 10 min),
          coloridos por intensidade (FRP): crítico, alto, médio e baixo. Amostra
          diversificada — não é inventário completo. Toque no pin para
          identificar. O + marca um foco no Brasil neste aparelho.
        </p>
      </StaggerItem>
    </StaggerReveal>
  );
}
