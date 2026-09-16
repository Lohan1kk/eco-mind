"use client";

import Image from "next/image";
import Link from "next/link";
import {
  MotionPress,
  StaggerItem,
  StaggerReveal,
} from "@/components/motion";
import { QrInstall } from "@/components/shell/QrInstall";

const features = [
  "Calculadora de pegada de carbono",
  "Quiz ambiental com dados reais",
  "Mapa de queimadas (INPE)",
  "Reporte de focos salvo neste aparelho",
];

export function BaixarContent() {
  return (
    <div className="section-inner max-w-2xl">
      <StaggerReveal staggerChildren={0.1} delayChildren={0.04}>
        <StaggerItem className="flex items-center gap-4">
          <Image
            src="/brand/icon-ecomind.png"
            alt=""
            width={64}
            height={64}
            className="h-16 w-16 object-contain"
            priority
          />
          <div>
            <h1 className="display text-3xl text-forest">Baixe a EcoMind</h1>
            <p className="text-ash">Consciência ambiental + tecnologia</p>
          </div>
        </StaggerItem>

        <StaggerItem className="mt-12 grid gap-10 md:grid-cols-[1fr_auto] md:items-start">
          <div className="space-y-10">
            <section>
              <h2 className="font-display text-xl font-semibold text-forest">
                Instalar no celular
              </h2>
              <ul className="mt-4 space-y-3 text-base text-ash">
                <li>
                  <strong className="text-ink">Android:</strong> Chrome → menu ⋮
                  → Instalar app
                </li>
                <li>
                  <strong className="text-ink">iPhone:</strong> Safari →
                  Compartilhar → Adicionar à Tela de Início
                </li>
              </ul>
              <MotionPress className="mt-6 inline-block">
                <Link href="/" className="btn btn-dark">
                  Abrir no navegador
                </Link>
              </MotionPress>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-forest">
                O que inclui
              </h2>
              <ul className="mt-4 space-y-3">
                {features.map((text) => (
                  <li
                    key={text}
                    className="border-l-2 border-sprout-deep/40 pl-4 text-ash"
                  >
                    {text}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <section className="flex flex-col items-center border border-[var(--line)] bg-paper px-6 py-6">
            <h2 className="font-display text-lg font-semibold text-forest">
              QR Code
            </h2>
            <div className="mt-4">
              <QrInstall />
            </div>
          </section>
        </StaggerItem>
      </StaggerReveal>
    </div>
  );
}
