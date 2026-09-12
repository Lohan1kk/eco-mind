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
      <main className="min-h-screen bg-atmosphere pt-24 pb-16">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-forest-mid">
            Educar
          </p>
          <h1 className="mt-3 font-display text-3xl font-semibold text-forest md:text-5xl">
            Quanto você sabe sobre o seu planeta?
          </h1>
          <p className="mt-4 max-w-xl text-lg text-ash">
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
