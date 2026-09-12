import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Quiz } from "@/components/Quiz";

export const metadata: Metadata = {
  title: "Quiz ambiental",
  description:
    "Teste seu conhecimento sobre clima, Amazônia e pegada de carbono.",
};

export default function QuizPage() {
  return (
    <>
      <Header solid />
      <main className="min-h-screen bg-mist pt-24 pb-16">
        <div className="section-inner">
          <p className="eyebrow text-forest-mid">Educar</p>
          <h1 className="display mt-3 text-3xl text-forest md:text-5xl">
            Quanto você sabe sobre o planeta?
          </h1>
          <p className="lede mt-4 max-w-xl">
            Cinco perguntas com feedback imediato — para plantar conhecimento de
            verdade.
          </p>
          <div className="mt-12">
            <Quiz />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
