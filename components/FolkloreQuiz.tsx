"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FOLKLORE_QUESTIONS } from "@/data/folklore-quiz";
import {
  enterTransition,
  pressTransition,
  softEase,
  stagger,
  staggerItemSoft,
  tapPress,
} from "@/components/motion";

export function FolkloreQuiz({ onChangeMode }: { onChangeMode: () => void }) {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);
  const reduce = useReducedMotion();

  const question = FOLKLORE_QUESTIONS[current];
  const total = FOLKLORE_QUESTIONS.length;
  const progress = finished
    ? 100
    : ((current + (selected !== null ? 0.5 : 0)) / total) * 100;

  function handleAnswer(index: number) {
    if (selected !== null) return;
    setSelected(index);
    if (index === question.correct) setScore((s) => s + 1);
    setTimeout(() => {
      if (current < total - 1) {
        setCurrent((c) => c + 1);
        setSelected(null);
      } else {
        setFinished(true);
      }
    }, 1300);
  }

  function reset() {
    setCurrent(0);
    setScore(0);
    setSelected(null);
    setFinished(false);
  }

  if (finished) {
    const pct = Math.round((score / total) * 100);
    const title =
      pct >= 80
        ? "Guardião da mata!"
        : pct >= 50
          ? "Bom caminho pela floresta!"
          : "Continue explorando o folclore!";

    return (
      <motion.div
        className="mx-auto max-w-lg text-center"
        initial={reduce ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={enterTransition}
      >
        <div className="border border-forest/12 bg-white/70 px-8 py-10">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-forest-mid">
            Gincana do Folclore
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-forest">
            {title}
          </h2>
          <p className="mt-3 text-ash">
            Você acertou{" "}
            <strong className="text-ink">
              {score} de {total}
            </strong>{" "}
            ({pct}%)
          </p>
          <div className="mx-auto mt-6 h-2 max-w-xs overflow-hidden rounded-full bg-mist-soft">
            <motion.div
              className="h-full rounded-full bg-forest-mid"
              initial={reduce ? false : { width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{
                duration: reduce ? 0 : 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
            />
          </div>
          <p className="mt-6 text-sm leading-relaxed text-ash">
            O folclore lembra: a floresta e os rios pedem cuidado — e a EcoMind
            mostra caminhos concretos para agir.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <motion.button
              type="button"
              onClick={reset}
              className="btn-primary cursor-pointer rounded-md bg-forest px-5 py-3 text-sm font-semibold text-mist"
              whileTap={reduce ? undefined : tapPress}
              transition={pressTransition}
            >
              Jogar de novo
            </motion.button>
            <motion.button
              type="button"
              onClick={onChangeMode}
              className="btn-secondary cursor-pointer"
              whileTap={reduce ? undefined : tapPress}
              transition={pressTransition}
            >
              Trocar modo
            </motion.button>
          </div>
          <Link
            href="/alerta-queimadas"
            className="mt-5 inline-block text-sm font-semibold text-forest-mid underline-offset-4 hover:underline"
          >
            Ver mapa de queimadas →
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <div className="mb-2 flex justify-between text-sm text-ash">
          <span>
            Pergunta {current + 1} de {total}
          </span>
          <span>{score} acertos</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-mist-soft">
          <motion.div
            className="h-full rounded-full bg-forest-mid"
            animate={{ width: `${progress}%` }}
            transition={{
              duration: reduce ? 0 : 0.45,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          className="border border-forest/12 bg-white/75 px-6 py-7 sm:px-8 sm:py-8"
          initial={reduce ? false : { opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduce ? undefined : { opacity: 0, x: -14 }}
          transition={enterTransition}
        >
          <div className="mx-auto mb-5 overflow-hidden rounded-xl border border-forest/10 bg-mist-soft">
            <Image
              src={question.image}
              alt={question.character}
              width={640}
              height={640}
              className="aspect-square h-auto w-full object-cover"
              sizes="(max-width: 672px) 92vw, 480px"
              quality={75}
              priority={current === 0}
            />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-forest-mid">
            {question.character}
          </p>
          <h2 className="mt-2 font-display text-lg font-semibold text-ink sm:text-xl">
            {question.q}
          </h2>

          <motion.div
            className="mt-6 grid gap-3"
            variants={stagger(0.05, 0.08)}
            initial={reduce ? false : "hidden"}
            animate="visible"
          >
            {question.options.map((opt, i) => {
              const isCorrect = i === question.correct;
              const isSelected = i === selected;
              let cls =
                "border-forest/15 bg-white hover:border-forest-mid/40 hover:bg-mist-soft";
              if (selected !== null) {
                if (isCorrect) cls = "border-sprout-deep bg-sprout/25";
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
                  variants={staggerItemSoft}
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
          </motion.div>

          <AnimatePresence>
            {selected !== null ? (
              <motion.p
                className="mt-5 bg-mist-soft px-4 py-3 text-sm leading-relaxed text-ash"
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0 }}
                transition={{ duration: reduce ? 0 : 0.35, ease: softEase }}
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
