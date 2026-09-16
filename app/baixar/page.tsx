import type { Metadata } from "next";
import { BaixarContent } from "@/components/BaixarContent";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PageAtmosphereShell } from "@/components/ui/page-atmosphere-shell";

export const metadata: Metadata = {
  title: "Baixar app",
  description:
    "Instale a EcoMind no celular — calculadora, quiz e mapa de queimadas com dados do INPE.",
};

export default function BaixarPage() {
  return (
    <>
      <Header solid />
      <PageAtmosphereShell variant="soft" className="bg-mist pt-24 pb-16">
        <BaixarContent />
      </PageAtmosphereShell>
      <Footer />
    </>
  );
}
