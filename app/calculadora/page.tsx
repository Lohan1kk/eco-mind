import type { Metadata } from "next";
import { CarbonCalculator } from "@/components/CarbonCalculator";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "Calculadora de pegada",
  description:
    "Calcule sua pegada de carbono anual com dados de transporte, alimentação e energia.",
};

export default function CalculadoraPage() {
  return (
    <>
      <Header solid />
      <main className="min-h-screen bg-[#0F1A14] pt-24 pb-16">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sprout">
            Ferramenta
          </p>
          <h1 className="mt-3 font-display text-3xl font-semibold text-mist md:text-5xl">
            Sua pegada, em tempo real
          </h1>
          <p className="mt-4 max-w-xl text-lg text-mist/75">
            Ajuste os controles. O resultado recalcula na hora — e mostra por
            onde começar a reduzir.
          </p>
          <div className="mt-12">
            <CarbonCalculator />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
