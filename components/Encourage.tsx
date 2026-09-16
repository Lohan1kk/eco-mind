"use client";

import Link from "next/link";
import {
  MotionPress,
  StaggerItem,
  StaggerReveal,
} from "@/components/motion";
import { VerdantSwirlSection } from "@/components/ui/verdant-swirl";

export function Encourage() {
  return (
    <VerdantSwirlSection
      id="agir"
      className="section"
      innerClassName="section-inner"
      speed={0.9}
    >
      <div className="mx-auto max-w-3xl rounded-2xl border border-sprout/20 bg-[#03120E]/72 px-6 py-12 text-center shadow-[0_0_60px_rgba(14,124,90,0.2)] backdrop-blur-md md:px-12 md:py-16">
        <StaggerReveal staggerChildren={0.12} delayChildren={0.06}>
          <StaggerItem soft>
            <p className="eyebrow text-sprout">Comece agora</p>
          </StaggerItem>
          <StaggerItem>
            <h2 className="display mt-4 text-3xl text-mist md:text-5xl">
              Plante conhecimento. Cultive consciência.
            </h2>
          </StaggerItem>
          <StaggerItem soft>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-mist/72">
              Você não precisa esperar um app perfeito para agir. Calcule sua
              pegada, aprenda no quiz, acompanhe as queimadas — e leve essa
              conversa adiante.
            </p>
          </StaggerItem>
          <StaggerItem className="mt-10">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <MotionPress>
                <Link href="/calculadora" className="btn btn-primary">
                  Calcular minha pegada
                </Link>
              </MotionPress>
              <MotionPress>
                <Link href="/quiz" className="btn btn-ghost">
                  Fazer o quiz
                </Link>
              </MotionPress>
              <MotionPress preset="press">
                <Link
                  href="/baixar"
                  className="px-4 py-3 text-sm font-semibold text-sprout underline-offset-4 hover:underline"
                >
                  Instalar no celular
                </Link>
              </MotionPress>
            </div>
            <p className="mt-8 text-sm text-mist/55">
              Pequenas ações plantadas hoje podem crescer em mudança real.
            </p>
          </StaggerItem>
        </StaggerReveal>
      </div>
    </VerdantSwirlSection>
  );
}
