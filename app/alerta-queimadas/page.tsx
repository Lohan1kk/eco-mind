import type { Metadata } from "next";
import { AlertaQueimadasClient } from "@/components/alerts/AlertaQueimadasClient";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "Alerta de queimadas",
  description:
    "Mapa interativo de alertas de queimadas no Brasil com dados do INPE. Veja níveis de risco e reporte novos focos.",
};

export default function AlertaQueimadasPage() {
  return (
    <>
      <Header solid />
      <main className="pt-16">
        <div className="border-b border-forest/10 bg-mist px-5 py-4 md:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-burn">
            Agir com dados
          </p>
          <h1 className="mt-1 font-display text-xl font-semibold text-forest md:text-2xl">
            Alerta de queimadas
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-ash">
            Focos reais de satélite (INPE) no Brasil, atualizados a cada ~10
            minutos. Toque no + para reportar um foco na sua região.
          </p>
        </div>
        <AlertaQueimadasClient />
      </main>
    </>
  );
}
