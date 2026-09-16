import type { Metadata } from "next";
import { CarbonCalculator } from "@/components/CarbonCalculator";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PageIntro } from "@/components/PageIntro";
import { VerdantPageShell } from "@/components/ui/verdant-page-shell";

export const metadata: Metadata = {
  title: "Calculadora de pegada",
  description:
    "Calcule sua pegada de carbono anual com transporte, alimentação e energia.",
};

export default function CalculadoraPage() {
  return (
    <>
      <Header solid />
      <VerdantPageShell>
        <div className="section-inner">
          <PageIntro
            eyebrow="Ferramenta"
            title="Sua pegada, em tempo real"
            eyebrowClassName="eyebrow text-sprout"
            titleClassName="display mt-3 text-3xl text-mist md:text-5xl"
          >
            <p className="mt-4 max-w-xl text-lg text-mist/70">
              Ajuste os controles. O resultado recalcula na hora — e mostra por
              onde começar a reduzir.
            </p>
          </PageIntro>
          <div className="mt-12">
            <CarbonCalculator />
          </div>
        </div>
      </VerdantPageShell>
      <Footer />
    </>
  );
}
