"use client";

import { useEffect, useMemo, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { CarbonBreakdown } from "./CarbonBreakdown";
import {
  calculateFootprint,
  type TransportMode,
} from "@/lib/carbon/calculate";
import { pressTransition } from "./motion/variants";

const TRANSPORT_OPTIONS: {
  mode: TransportMode;
  label: string;
}[] = [
  { mode: "carro", label: "Carro" },
  { mode: "onibus", label: "Ônibus" },
  { mode: "metro", label: "Metrô/Trem" },
  { mode: "bike", label: "Bike/A pé" },
];

export function CarbonCalculator() {
  const [km, setKm] = useState(12);
  const [meat, setMeat] = useState(4);
  const [energy, setEnergy] = useState(220);
  const [transport, setTransport] = useState<TransportMode>("carro");
  const reduce = useReducedMotion();

  const result = useMemo(
    () =>
      calculateFootprint({
        kmPerDay: km,
        meatPerWeek: meat,
        energyReais: energy,
        transportMode: transport,
      }),
    [km, meat, energy, transport],
  );

  const totalMv = useMotionValue(result.total);
  const totalSpring = useSpring(totalMv, {
    stiffness: reduce ? 400 : 90,
    damping: reduce ? 40 : 22,
  });
  const totalDisplay = useTransform(totalSpring, (v) =>
    Math.round(v).toLocaleString("pt-BR"),
  );

  useEffect(() => {
    totalMv.set(result.total);
  }, [result.total, totalMv]);

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
      <div className="space-y-8">
        <div>
          <label htmlFor="km" className="flex justify-between text-sm font-semibold text-mist">
            <span>Deslocamento diário</span>
            <span className="text-sprout">{km} km</span>
          </label>
          <input
            id="km"
            type="range"
            min={0}
            max={80}
            value={km}
            onChange={(e) => setKm(Number(e.target.value))}
            className="mt-2 w-full accent-sprout"
          />
        </div>

        <div>
          <p className="text-sm font-semibold text-mist">Meio de transporte principal</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {TRANSPORT_OPTIONS.map((opt) => (
              <motion.button
                key={opt.mode}
                type="button"
                onClick={() => setTransport(opt.mode)}
                className={`cursor-pointer rounded-md px-4 py-2 text-sm font-medium transition ${
                  transport === opt.mode
                    ? "bg-sprout text-ink"
                    : "border border-mist/25 text-mist/90 hover:border-sprout/50"
                }`}
                whileTap={reduce ? undefined : { scale: 0.97 }}
                transition={pressTransition}
              >
                {opt.label}
              </motion.button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="meat" className="flex justify-between text-sm font-semibold text-mist">
            <span>Consumo de carne</span>
            <span className="text-sprout">{meat}x por semana</span>
          </label>
          <input
            id="meat"
            type="range"
            min={0}
            max={14}
            value={meat}
            onChange={(e) => setMeat(Number(e.target.value))}
            className="mt-2 w-full accent-sprout"
          />
        </div>

        <div>
          <label htmlFor="energy" className="flex justify-between text-sm font-semibold text-mist">
            <span>Conta de energia mensal</span>
            <span className="text-sprout">
              R$ {energy} (~{Math.round(result.kwhEstimado)} kWh)
            </span>
          </label>
          <input
            id="energy"
            type="range"
            min={0}
            max={1000}
            step={10}
            value={energy}
            onChange={(e) => setEnergy(Number(e.target.value))}
            className="mt-2 w-full accent-sprout"
          />
        </div>
      </div>

      <motion.div
        className="border border-sprout/20 bg-ink/45 p-8"
        initial={reduce ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduce ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="text-sm font-semibold uppercase tracking-wide text-sprout/80">
          Estimativa anual
        </p>
        <motion.p
          className={`mt-2 font-display text-6xl font-semibold tabular-nums ${
            result.level === "excelente" ? "text-sprout" : "text-mist"
          }`}
        >
          {totalDisplay}
        </motion.p>
        <p className="text-lg text-mist/80">kg de CO₂ equivalente por ano</p>

        <div className="mt-6 h-2 overflow-hidden rounded-full bg-mist/10">
          <motion.div
            className="h-full rounded-full bg-sprout"
            animate={{ width: `${result.progressPct}%` }}
            transition={{ duration: reduce ? 0 : 0.35, ease: "easeOut" }}
          />
        </div>

        <p className="mt-6 text-base leading-relaxed text-mist/90">{result.message}</p>

        <CarbonBreakdown
          transport={result.transportAnnual}
          meat={result.meatAnnual}
          energy={result.energyAnnual}
          total={result.total}
        />

        <p className="mt-6 text-xs leading-relaxed text-mist/50">
          Metodologia: fatores médios de transporte (DEFRA/EPA), alimentação
          (Poore &amp; Nemecek, 2018) e matriz elétrica do SIN (MCTI).
        </p>
      </motion.div>
    </div>
  );
}
