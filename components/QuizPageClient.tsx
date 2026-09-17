"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FolkloreQuiz } from "@/components/FolkloreQuiz";
import { PageIntro } from "@/components/PageIntro";
import { Quiz } from "@/components/Quiz";
import {
  enterTransition,
  hoverLift,
  pressTransition,
  stagger,
  staggerItemSoft,
  tapPress,
} from "@/components/motion";

type Mode = "select" | "eco" | "folklore";

export function QuizPageClient() {
  const [mode, setMode] = useState<Mode>("select");
  const reduce = useReducedMotion();

  return (
    <div className="section-inner">
      <PageIntro
        eyebrow="Educar"
        title={
          mode === "folklore"
            ? "Gincana do Folclore"
            : mode === "eco"
              ? "Quanto você sabe sobre a EcoMind?"
              : "Escolha seu desafio"
        }
        eyebrowClassName="eyebrow text-forest-mid"
        titleClassName="display mt-3 text-3xl text-forest md:text-5xl"
      >
        <p className="lede mt-4 max-w-xl">
          {mode === "folklore"
            ? "Desafio com timer, combo e imagem velada: descubra Curupira, Caipora, Boitatá e mais — e o que ensinam sobre floresta, rios e fogo."
            : mode === "eco"
              ? "Dez perguntas baseadas nos textos e dados do site — com feedback imediato após cada resposta."
              : "Teste o que você sabe sobre o site ou explore a mata encantada do folclore brasileiro."}
        </p>
      </PageIntro>

      <div className="mt-12">
        {mode === "select" ? (
          <motion.div
            className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2"
            variants={stagger(0.1, 0.06)}
            initial={reduce ? false : "hidden"}
            animate="visible"
          >
            <motion.button
              type="button"
              variants={staggerItemSoft}
              whileHover={reduce ? undefined : hoverLift}
              whileTap={reduce ? undefined : tapPress}
              transition={pressTransition}
              onClick={() => setMode("eco")}
              className="panel-soft cursor-pointer p-6 text-left transition hover:border-forest/25"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-forest-mid">
                Modo 01
              </p>
              <h2 className="mt-3 font-display text-2xl font-semibold text-forest">
                Quiz EcoMind
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ash">
                Desmatamento, ferramentas do app e dados do clima — o conteúdo do
                site.
              </p>
            </motion.button>

            <motion.button
              type="button"
              variants={staggerItemSoft}
              whileHover={reduce ? undefined : hoverLift}
              whileTap={reduce ? undefined : tapPress}
              transition={pressTransition}
              onClick={() => setMode("folklore")}
              className="panel-soft cursor-pointer p-6 text-left transition hover:border-forest/25"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-forest-mid">
                Modo 02
              </p>
              <h2 className="mt-3 font-display text-2xl font-semibold text-forest">
                Gincana do Folclore
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ash">
                Imagem velada, timer e combo — lore do folclore com laço
                ambiental.
              </p>
            </motion.button>
          </motion.div>
        ) : null}

        {mode === "eco" ? (
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={enterTransition}
          >
            <div className="mb-6 flex justify-end">
              <button
                type="button"
                onClick={() => setMode("select")}
                className="text-sm font-semibold text-forest-mid underline-offset-4 hover:underline"
              >
                ← Trocar modo
              </button>
            </div>
            <Quiz />
          </motion.div>
        ) : null}

        {mode === "folklore" ? (
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={enterTransition}
          >
            <div className="mb-6 flex justify-end">
              <button
                type="button"
                onClick={() => setMode("select")}
                className="text-sm font-semibold text-forest-mid underline-offset-4 hover:underline"
              >
                ← Trocar modo
              </button>
            </div>
            <FolkloreQuiz onChangeMode={() => setMode("select")} />
          </motion.div>
        ) : null}
      </div>
    </div>
  );
}
