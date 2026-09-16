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
        <div className="border-b border-forest/10 bg-mist px-4 py-2.5 md:px-8 md:py-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-burn md:text-xs">
                Agir com dados
              </p>
              <h1 className="font-display text-lg font-semibold text-forest md:text-2xl">
                Alerta de queimadas
              </h1>
            </div>
          </div>
          <p className="mt-1 hidden max-w-2xl text-sm text-ash md:block">
            Focos no mundo (NASA FIRMS) e detalhe do Brasil (INPE), coloridos por
            intensidade (FRP). Toque no pin para identificar. O + marca um foco
            no Brasil neste aparelho.
          </p>
        </div>
        <AlertaQueimadasClient />
      </main>
    </>
  );
}
