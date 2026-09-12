import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { QrInstall } from "@/components/shell/QrInstall";

export const metadata: Metadata = {
  title: "Baixar app",
  description:
    "Instale a EcoMind no celular — calculadora, quiz e mapa de queimadas com dados do INPE.",
};

const features = [
  "Calculadora de pegada de carbono",
  "Quiz ambiental com dados reais",
  "Mapa de queimadas (INPE)",
  "Reporte comunitário de focos",
];

export default function BaixarPage() {
  return (
    <>
      <Header solid />
      <main className="min-h-screen bg-mist pt-24 pb-16">
        <div className="section-inner max-w-2xl">
          <div className="flex items-center gap-4">
            <Image
              src="/brand/icon-ecomind.png"
              alt=""
              width={64}
              height={64}
              className="h-16 w-16 rounded-full"
              priority
            />
            <div>
              <h1 className="display text-3xl text-forest">Baixe a EcoMind</h1>
              <p className="text-ash">Consciência ambiental + tecnologia</p>
            </div>
          </div>

          <div className="mt-12 grid gap-10 md:grid-cols-[1fr_auto] md:items-start">
            <div className="space-y-10">
              <section>
                <h2 className="font-display text-xl font-semibold text-forest">
                  Instalar no celular
                </h2>
                <ul className="mt-4 space-y-3 text-base text-ash">
                  <li>
                    <strong className="text-ink">Android:</strong> Chrome → menu
                    ⋮ → Instalar app
                  </li>
                  <li>
                    <strong className="text-ink">iPhone:</strong> Safari →
                    Compartilhar → Adicionar à Tela de Início
                  </li>
                </ul>
                <Link href="/" className="btn btn-dark mt-6">
                  Abrir no navegador
                </Link>
              </section>

              <section>
                <h2 className="font-display text-xl font-semibold text-forest">
                  O que inclui
                </h2>
                <ul className="mt-4 space-y-3">
                  {features.map((text) => (
                    <li
                      key={text}
                      className="border-l-2 border-sprout-deep/40 pl-4 text-ash"
                    >
                      {text}
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            <section className="flex flex-col items-center border border-[var(--line)] bg-paper px-6 py-6">
              <h2 className="font-display text-lg font-semibold text-forest">
                QR Code
              </h2>
              <div className="mt-4">
                <QrInstall />
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
