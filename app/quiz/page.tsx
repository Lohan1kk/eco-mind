import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { QuizPageClient } from "@/components/QuizPageClient";
import { PageAtmosphereShell } from "@/components/ui/page-atmosphere-shell";

export const metadata: Metadata = {
  title: "Quiz ambiental e gincana do folclore",
  description:
    "Quiz sobre a EcoMind e gincana do folclore brasileiro — Curupira, Caipora, Boitatá e mais, ligados à proteção da natureza.",
};

export default function QuizPage() {
  return (
    <>
      <Header solid />
      <PageAtmosphereShell
        variant="mist"
        wash="light"
        className="bg-mist pt-24 pb-16"
      >
        <QuizPageClient />
      </PageAtmosphereShell>
      <Footer />
    </>
  );
}
