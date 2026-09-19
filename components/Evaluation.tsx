"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/motion";
import { SectionAtmosphere } from "@/components/ui/section-atmosphere";
import { VerdantWash } from "@/components/ui/verdant-accent";
import {
  clearEvaluation,
  readEvaluation,
  saveEvaluation,
  type Evaluation,
} from "@/lib/evaluation";

const LABELS = ["Péssimo", "Ruim", "Ok", "Bom", "Excelente"] as const;

export function EvaluationSection() {
  const reduce = useReducedMotion();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [saved, setSaved] = useState<Evaluation | null>(null);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    const existing = readEvaluation();
    if (existing) {
      setSaved(existing);
      setRating(existing.rating);
      setName(existing.name);
      setComment(existing.comment);
    }
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (rating < 1) {
      setError("Escolha uma nota de 1 a 5.");
      return;
    }
    try {
      const next = saveEvaluation({ rating, name, comment });
      setSaved(next);
      setEditing(false);
      setJustSaved(true);
      window.setTimeout(() => setJustSaved(false), 2500);
    } catch {
      setError("Não foi possível salvar neste aparelho.");
    }
  }

  function handleClear() {
    clearEvaluation();
    setSaved(null);
    setRating(0);
    setName("");
    setComment("");
    setEditing(false);
    setError(null);
  }

  const showForm = !saved || editing;
  const active = hover || rating;

  return (
    <section
      id="avaliacao"
      className="section section-soft relative overflow-hidden"
    >
      <SectionAtmosphere variant="soft" />
      <VerdantWash tone="light" speed={0.34} />
      <div className="section-inner relative z-[1]">
        <Reveal>
          <p className="eyebrow text-forest-mid">Sua voz</p>
          <h2 className="display mt-4 text-3xl text-ink md:text-5xl">
            Avalie a EcoMind
          </h2>
          <p className="lede mt-5 max-w-xl">
            A nota fica salva neste aparelho (localStorage). No seu computador e
            no celular de cada pessoa, cada um guarda a própria avaliação.
          </p>
        </Reveal>

        <Reveal delayMs={80}>
          <div className="mx-auto mt-12 max-w-lg">
            {!showForm && saved ? (
              <div className="border border-forest/12 bg-white/80 px-6 py-8 text-center sm:px-8">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-forest-mid">
                  Avaliação neste aparelho
                </p>
                <div
                  className="mt-4 flex justify-center gap-1.5"
                  aria-label={`Nota ${saved.rating} de 5`}
                >
                  {Array.from({ length: 5 }, (_, i) => (
                    <span
                      key={i}
                      className={`text-2xl ${
                        i < saved.rating ? "text-forest-mid" : "text-forest/20"
                      }`}
                      aria-hidden
                    >
                      ★
                    </span>
                  ))}
                </div>
                <p className="mt-2 text-sm font-medium text-ink">
                  {LABELS[saved.rating - 1]}
                </p>
                {saved.name ? (
                  <p className="mt-4 text-sm text-ash">
                    — {saved.name}
                  </p>
                ) : null}
                {saved.comment ? (
                  <p className="mt-3 text-sm leading-relaxed text-ink/80">
                    “{saved.comment}”
                  </p>
                ) : null}
                <p className="mt-4 text-[11px] text-ash/70">
                  Salva em{" "}
                  {new Date(saved.updatedAt).toLocaleString("pt-BR")}
                </p>
                {justSaved ? (
                  <p className="mt-3 text-sm font-semibold text-forest-mid">
                    Salvo neste aparelho.
                  </p>
                ) : null}
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setEditing(true)}
                    className="btn-primary cursor-pointer rounded-md bg-forest px-5 py-2.5 text-sm font-semibold text-mist touch-manipulation"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={handleClear}
                    className="cursor-pointer rounded-md px-4 py-2.5 text-sm font-semibold text-forest-mid underline-offset-4 hover:underline touch-manipulation"
                  >
                    Apagar deste aparelho
                  </button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="border border-forest/12 bg-white/80 px-6 py-8 sm:px-8"
              >
                <fieldset>
                  <legend className="text-sm font-semibold text-ink">
                    Nota geral
                  </legend>
                  <div
                    className="mt-4 flex justify-center gap-2"
                    onMouseLeave={() => setHover(0)}
                  >
                    {Array.from({ length: 5 }, (_, i) => {
                      const value = i + 1;
                      const on = value <= active;
                      return (
                        <motion.button
                          key={value}
                          type="button"
                          aria-label={`${value} estrela${value > 1 ? "s" : ""} — ${LABELS[i]}`}
                          aria-pressed={rating === value}
                          onClick={() => setRating(value)}
                          onMouseEnter={() => setHover(value)}
                          onFocus={() => setHover(value)}
                          whileTap={reduce ? undefined : { scale: 0.92 }}
                          className={`flex h-12 w-12 cursor-pointer items-center justify-center rounded-md text-3xl transition touch-manipulation ${
                            on
                              ? "text-forest-mid"
                              : "text-forest/25 hover:text-forest/45"
                          }`}
                        >
                          ★
                        </motion.button>
                      );
                    })}
                  </div>
                  <p className="mt-2 text-center text-sm text-ash" aria-live="polite">
                    {active ? LABELS[active - 1] : "Toque nas estrelas"}
                  </p>
                </fieldset>

                <label className="mt-6 block">
                  <span className="text-sm font-medium text-ink">
                    Nome{" "}
                    <span className="font-normal text-ash">(opcional)</span>
                  </span>
                  <input
                    type="text"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={80}
                    autoComplete="name"
                    placeholder="Como quer aparecer"
                    className="mt-2 w-full border border-forest/15 bg-mist px-3 py-2.5 text-sm text-ink outline-none ring-forest/30 placeholder:text-ash/50 focus:ring-2"
                  />
                </label>

                <label className="mt-4 block">
                  <span className="text-sm font-medium text-ink">
                    Comentário{" "}
                    <span className="font-normal text-ash">(opcional)</span>
                  </span>
                  <textarea
                    name="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    maxLength={600}
                    rows={3}
                    placeholder="O que funcionou bem? O que melhorar?"
                    className="mt-2 w-full resize-y border border-forest/15 bg-mist px-3 py-2.5 text-sm text-ink outline-none ring-forest/30 placeholder:text-ash/50 focus:ring-2"
                  />
                </label>

                {error ? (
                  <p className="mt-3 text-sm font-medium text-burn" role="alert">
                    {error}
                  </p>
                ) : null}

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="submit"
                    className="btn-primary cursor-pointer rounded-md bg-forest px-5 py-3 text-sm font-semibold text-mist touch-manipulation"
                  >
                    {saved ? "Atualizar avaliação" : "Salvar neste aparelho"}
                  </button>
                  {editing ? (
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(false);
                        if (saved) {
                          setRating(saved.rating);
                          setName(saved.name);
                          setComment(saved.comment);
                        }
                        setError(null);
                      }}
                      className="cursor-pointer rounded-md px-4 py-3 text-sm font-semibold text-forest-mid underline-offset-4 hover:underline touch-manipulation"
                    >
                      Cancelar
                    </button>
                  ) : null}
                </div>

                <p className="mt-4 text-[11px] leading-relaxed text-ash/75">
                  Não enviamos para um servidor: os dados ficam só no navegador
                  deste aparelho (chave <code>ecomind-avaliacao</code>).
                </p>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
