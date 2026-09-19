"use client";

import { CLIMATE_STATS } from "@/data/climate-stats";
import {
  Reveal,
  StaggerItem,
  StaggerReveal,
} from "@/components/motion";
import { SectionAtmosphere } from "@/components/ui/section-atmosphere";
import { VerdantWash } from "@/components/ui/verdant-accent";

export function ClimateReality() {
  return (
    <section id="realidade" className="section relative overflow-hidden bg-[#101c15] text-mist">
      <SectionAtmosphere variant="deep" />
      <VerdantWash tone="dark" speed={0.42} />
      <div className="section-inner relative z-[1]">
        <StaggerReveal staggerChildren={0.11} delayChildren={0.04}>
          <StaggerItem soft>
            <p className="eyebrow text-sprout">A realidade</p>
          </StaggerItem>
          <StaggerItem>
            <h2 className="display mt-4 max-w-3xl text-3xl md:text-5xl">
              Os números não pedem licença para mudar
            </h2>
          </StaggerItem>
          <StaggerItem soft>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-mist/70">
              Antes de qualquer app, existe um planeta reagindo às nossas
              escolhas. Os números usam unidades como{" "}
              <a href="/#glossario" className="text-sprout underline-offset-2 hover:underline">
                ppm
              </a>{" "}
              e °C — veja o glossário se o termo for novo.
            </p>
          </StaggerItem>
        </StaggerReveal>

        <ul className="mt-14 grid gap-x-12 gap-y-12 md:grid-cols-2">
          {CLIMATE_STATS.map((stat, i) => (
            <Reveal key={stat.value} delayMs={140 + i * 100} variant="fadeUp">
              <li className="border-t border-mist/15 pt-6">
                <p
                  className={`display text-3xl md:text-4xl ${
                    stat.trend === "down" ? "text-sprout" : "text-[#e2c48a]"
                  }`}
                >
                  {stat.trend === "up" ? "↑ " : "↓ "}
                  {stat.value}
                </p>
                <p className="mt-3 text-base leading-relaxed text-mist/85">
                  {stat.label}
                </p>
                <p className="mt-3 text-xs text-mist/45">Fonte: {stat.source}</p>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
