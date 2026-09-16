"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { QUIZ_QUESTIONS } from "@/data/quiz";
import { enterTransition, pressTransition } from "./motion/variants";

export function Quiz() {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);
  const reduce = useReducedMotion();

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
      <motion.div
        className="mx-auto max-w-lg text-center"
        initial={reduce ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={enterTransition}
      >
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
            <motion.div
              className="h-full rounded-full bg-forest-mid"
              initial={reduce ? false : { width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: reduce ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
          <p className="mt-6 text-sm leading-relaxed text-ash">
            Compartilhe a EcoMind e ajude mais pessoas a entender o impacto das
            escolhas do dia a dia.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <motion.button
              type="button"
              onClick={reset}
              className="btn-primary cursor-pointer rounded-md bg-forest px-5 py-3 text-sm font-semibold text-mist"
              whileTap={reduce ? undefined : { scale: 0.98 }}
              transition={pressTransition}
            >
              Jogar novamente
            </motion.button>
            <Link href="/calculadora" className="btn-secondary">
              Calcular pegada
            </Link>
          </div>
        </div>
      </motion.div>
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
          <motion.div
            className="h-full rounded-full bg-forest-mid"
            animate={{ width: `${progress}%` }}
            transition={{ duration: reduce ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={question.q}
          className="border border-forest/12 bg-white/75 px-6 py-7 sm:px-8 sm:py-8"
          initial={reduce ? false : { opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduce ? undefined : { opacity: 0, x: -14 }}
          transition={enterTransition}
        >
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
                <motion.button
                  key={opt}
                  type="button"
                  onClick={() => handleAnswer(i)}
                  disabled={selected !== null}
                  className={`flex cursor-pointer items-center gap-3 border px-4 py-3.5 text-left text-sm font-medium text-ink transition sm:text-base ${cls}`}
                  whileTap={
                    reduce || selected !== null ? undefined : { scale: 0.99 }
                  }
                  transition={pressTransition}
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center bg-forest/10 text-xs font-bold text-forest-mid">
                    {String.fromCharCode(65 + i)}
                  </span>
                  {opt}
                </motion.button>
              );
            })}
          </div>

          <AnimatePresence>
            {selected !== null ? (
              <motion.p
                className="mt-5 bg-mist-soft px-4 py-3 text-sm leading-relaxed text-ash"
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0 }}
                transition={{ duration: reduce ? 0 : 0.35 }}
              >
                {question.feedback}
              </motion.p>
            ) : null}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
