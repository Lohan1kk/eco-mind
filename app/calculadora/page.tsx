import type { Metadata } from "next";
import { CarbonCalculator } from "@/components/CarbonCalculator";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "Calculadora de pegada",
  description:
    "Calcule sua pegada de carbono anual com transporte, alimentação e energia.",
};

export default function CalculadoraPage() {
  return (
    <>
      <Header solid />
      <main className="min-h-screen bg-[#101c15] pt-24 pb-16">
        <div className="section-inner">
          <p className="eyebrow text-sprout">Ferramenta</p>
          <h1 className="display mt-3 text-3xl text-mist md:text-5xl">
            Sua pegada, em tempo real
          </h1>
          <p className="mt-4 max-w-xl text-lg text-mist/70">
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
