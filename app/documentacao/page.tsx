import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { DocumentacaoExpoPT } from "@/components/docs/DocumentacaoExpoPT";

export const metadata: Metadata = {
  title: "Documentação ExpoPT",
  description:
    "Documentação completa do projeto EcoMind para a ExpoPT 2026 — pesquisa, atividade lúdica, desenvolvimento técnico (2º ano) e apresentação. Versão digital e para impressão.",
};

export default function DocumentacaoPage() {
  return (
    <>
      <Header solid />
      <main className="min-h-screen bg-mist pt-24 pb-20">
        <div className="section-inner max-w-3xl">
          <DocumentacaoExpoPT />
        </div>
      </main>
      <Footer />
    </>
  );
}
