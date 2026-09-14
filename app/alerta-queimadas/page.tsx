import type { Metadata } from "next";
import { AlertaQueimadasClient } from "@/components/alerts/AlertaQueimadasClient";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "Alerta de queimadas",
  description:
    "Mapa mundial de focos de queimada com níveis por FRP (INPE Brasil + NASA FIRMS). Veja risco e reporte focos no Brasil.",
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
            Focos no mundo (NASA FIRMS) e detalhe do Brasil (INPE), coloridos por
            intensidade (FRP): crítico, alto, médio e baixo. Toque no pin para
            identificar. O + marca um foco no Brasil neste aparelho.
          </p>
        </div>
        <AlertaQueimadasClient />
      </main>
    </>
  );
}
