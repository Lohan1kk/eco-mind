import type { Metadata } from "next";
import { AlertaIntro } from "@/components/alerts/AlertaIntro";
import { AlertaQueimadasClient } from "@/components/alerts/AlertaQueimadasClient";
import { Header } from "@/components/Header";
import { SectionAtmosphere } from "@/components/ui/section-atmosphere";

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
        <div className="relative overflow-hidden border-b border-forest/10 bg-mist px-5 py-4 md:px-8">
          <SectionAtmosphere variant="mist" />
          <AlertaIntro />
        </div>
        <AlertaQueimadasClient />
      </main>
    </>
  );
}
