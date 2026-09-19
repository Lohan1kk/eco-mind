import type { Metadata } from "next";
import { AlertaIntro } from "@/components/alerts/AlertaIntro";
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
      <main className="flex h-[100dvh] flex-col overflow-hidden pt-[calc(4rem+env(safe-area-inset-top))]">
        <div className="shrink-0 border-b border-forest/10 bg-mist px-4 py-2.5 md:px-8 md:py-4">
          <AlertaIntro />
        </div>
        <div className="min-h-0 flex-1">
          <AlertaQueimadasClient />
        </div>
      </main>
    </>
  );
}
