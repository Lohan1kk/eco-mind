"use client";

import { CLIMATE_STATS } from "@/data/climate-stats";
import { Reveal } from "./Reveal";

export function ClimateReality() {
  return (
    <section id="realidade" className="bg-[#0F1A14] py-20 text-mist md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sprout">
            A realidade, sem filtro
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold leading-tight md:text-5xl">
            Os números não pedem licença pra mudar
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-mist/75">
            Antes de qualquer app ou calculadora, existe um planeta real
            reagindo às nossas escolhas.
          </p>
        </Reveal>

        <ul className="mt-14 grid gap-x-10 gap-y-12 md:grid-cols-2">
          {CLIMATE_STATS.map((stat, i) => (
            <Reveal key={stat.value} delayMs={i * 90}>
              <li className="border-t border-mist/15 pt-6">
                <p
                  className={`font-display text-3xl font-semibold md:text-4xl ${
                    stat.trend === "down" ? "text-sprout" : "text-[#e8c07a]"
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
