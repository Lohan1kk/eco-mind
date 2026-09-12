"use client";

import { useState } from "react";
import Link from "next/link";
import { QUIZ_QUESTIONS } from "@/data/quiz";

export function Quiz() {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);

  const question = QUIZ_QUESTIONS[current];
  const progress = finished
    ? 100
    : ((current + (selected !== null ? 0.5 : 0)) / QUIZ_QUESTIONS.length) * 100;

  function handleAnswer(index: number) {
    if (selected !== null) return;
    setSelected(index);
    if (index === question.correct) setScore((s) => s + 1);
    setTimeout(() => {
      if (current < QUIZ_QUESTIONS.length - 1) {
        setCurrent((c) => c + 1);
        setSelected(null);
      } else {
        setFinished(true);
      }
    }, 1200);
  }

  function reset() {
    setCurrent(0);
    setScore(0);
    setSelected(null);
    setFinished(false);
  }

  if (finished) {
    const pct = Math.round((score / QUIZ_QUESTIONS.length) * 100);
    const title =
      pct >= 80
        ? "Excelente!"
        : pct >= 50
          ? "Bom trabalho!"
          : "Continue aprendendo!";

    return (
      <div className="mx-auto max-w-lg text-center">
        <div className="border border-forest/12 bg-white/70 px-8 py-10">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-forest-mid">
            Resultado
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-forest">
            {title}
          </h2>
          <p className="mt-3 text-ash">
            Você acertou{" "}
            <strong className="text-ink">
              {score} de {QUIZ_QUESTIONS.length}
            </strong>{" "}
            ({pct}%)
          </p>
          <div className="mx-auto mt-6 h-2 max-w-xs overflow-hidden rounded-full bg-mist-soft">
            <div
              className="h-full rounded-full bg-forest-mid transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="mt-6 text-sm leading-relaxed text-ash">
            Compartilhe a EcoMind e ajude mais pessoas a entender o impacto das
            escolhas do dia a dia.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={reset}
              className="btn-primary rounded-md bg-forest px-5 py-3 text-sm font-semibold text-mist"
            >
              Jogar novamente
            </button>
            <Link href="/calculadora" className="btn-secondary">
              Calcular pegada
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <div className="mb-2 flex justify-between text-sm text-ash">
          <span>
            Pergunta {current + 1} de {QUIZ_QUESTIONS.length}
          </span>
          <span>{score} acertos</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-mist-soft">
          <div
            className="h-full rounded-full bg-forest-mid transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="border border-forest/12 bg-white/75 px-6 py-7 sm:px-8 sm:py-8">
        <h2 className="font-display text-lg font-semibold text-ink sm:text-xl">
          {question.q}
        </h2>
        <div className="mt-6 grid gap-3">
          {question.options.map((opt, i) => {
            const isCorrect = i === question.correct;
            const isSelected = i === selected;
            let cls =
              "border-forest/15 bg-white hover:border-forest-mid/40 hover:bg-mist-soft";
            if (selected !== null) {
              if (isCorrect)
                cls = "border-sprout-deep bg-sprout/25";
              else if (isSelected) cls = "border-burn/40 bg-[#f8efe8]";
              else cls = "border-forest/5 bg-mist/50 opacity-55";
            }

            return (
              <button
                key={opt}
                type="button"
                onClick={() => handleAnswer(i)}
                disabled={selected !== null}
                className={`flex items-center gap-3 border px-4 py-3.5 text-left text-sm font-medium text-ink transition sm:text-base ${cls}`}
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center bg-forest/10 text-xs font-bold text-forest-mid">
                  {String.fromCharCode(65 + i)}
                </span>
                {opt}
              </button>
            );
          })}
        </div>

        {selected !== null ? (
          <p className="mt-5 bg-mist-soft px-4 py-3 text-sm leading-relaxed text-ash animate-fade-in">
            {question.feedback}
          </p>
        ) : null}
      </div>
    </div>
  );
}
