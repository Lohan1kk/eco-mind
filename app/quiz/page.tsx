import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PageIntro } from "@/components/PageIntro";
import { Quiz } from "@/components/Quiz";

export const metadata: Metadata = {
  title: "Quiz ambiental",
  description:
    "Quiz sobre o conteúdo da EcoMind: desmatamento, queimadas, ferramentas do app e dados do clima.",
};

export default function QuizPage() {
  return (
    <>
      <Header solid />
      <main className="min-h-screen bg-mist pt-24 pb-16">
        <div className="section-inner">
          <PageIntro
            eyebrow="Educar"
            title="Quanto você sabe sobre a EcoMind?"
            eyebrowClassName="eyebrow text-forest-mid"
            titleClassName="display mt-3 text-3xl text-forest md:text-5xl"
          >
            <p className="lede mt-4 max-w-xl">
              Dez perguntas baseadas nos textos e dados do site — com feedback
              imediato após cada resposta.
            </p>
          </PageIntro>
          <div className="mt-12">
            <Quiz />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
