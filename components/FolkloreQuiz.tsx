"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  buildFolkloreDeck,
  FOLKLORE_QUESTIONS,
  type ShuffledFolkloreQuestion,
} from "@/data/folklore-quiz";
import {
  enterTransition,
  pressTransition,
  softEase,
  stagger,
  staggerItemSoft,
  tapPress,
} from "@/components/motion";

const QUESTION_SECONDS = 20;
const FAST_BONUS_SECONDS = 10;
const FEEDBACK_MS = 1600;

type RoundResult = {
  character: string;
  image: string;
  correct: boolean;
};

function ssrDeck(): ShuffledFolkloreQuestion[] {
  return FOLKLORE_QUESTIONS.map((q) => ({ ...q }));
}

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function FolkloreQuiz({ onChangeMode }: { onChangeMode: () => void }) {
  const reduce = useReducedMotion();
  const isClient = useIsClient();
  const [deckNonce, setDeckNonce] = useState(0);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [bonusPoints, setBonusPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [timedOut, setTimedOut] = useState(false);
  const [finished, setFinished] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(QUESTION_SECONDS);
  const [results, setResults] = useState<RoundResult[]>([]);
  const resultsRef = useRef<RoundResult[]>([]);
  const advanceTimer = useRef<number | null>(null);
  const answeredRef = useRef(false);
  const secondsLeftRef = useRef(QUESTION_SECONDS);

  const deck = useMemo(() => {
    if (!isClient) return ssrDeck();
    return buildFolkloreDeck();
    // deckNonce forces reshuffle on "Jogar de novo"
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClient, deckNonce]);

  const question = deck[current];
  const total = deck.length;
  const progress = finished
    ? 100
    : ((current + (selected !== null || timedOut ? 0.5 : 0)) / total) * 100;
  const timerEnabled = Boolean(isClient && !reduce);

  const clearAdvance = useCallback(() => {
    if (advanceTimer.current != null) {
      window.clearTimeout(advanceTimer.current);
      advanceTimer.current = null;
    }
  }, []);

  const goNext = useCallback(
    (nextResults: RoundResult[]) => {
      clearAdvance();
      if (current < total - 1) {
        setCurrent((c) => c + 1);
        setSelected(null);
        setTimedOut(false);
        setSecondsLeft(QUESTION_SECONDS);
        secondsLeftRef.current = QUESTION_SECONDS;
        answeredRef.current = false;
      } else {
        setResults(nextResults);
        setFinished(true);
      }
    },
    [clearAdvance, current, total],
  );

  const settleAnswer = useCallback(
    (opts: {
      index: number | null;
      timedOut: boolean;
      elapsedBonus: boolean;
    }) => {
      if (answeredRef.current || !question) return;
      answeredRef.current = true;

      const isCorrect =
        !opts.timedOut &&
        opts.index !== null &&
        opts.index === question.correct;

      if (isCorrect) {
        setScore((s) => s + 1);
        setStreak((s) => {
          const next = s + 1;
          setBestStreak((b) => Math.max(b, next));
          return next;
        });
        if (opts.elapsedBonus) setBonusPoints((b) => b + 1);
      } else {
        setStreak(0);
      }

      if (opts.index !== null) setSelected(opts.index);
      if (opts.timedOut) setTimedOut(true);

      const nextResults: RoundResult[] = [
        ...resultsRef.current,
        {
          character: question.character,
          image: question.image,
          correct: isCorrect,
        },
      ];
      resultsRef.current = nextResults;
      setResults(nextResults);

      advanceTimer.current = window.setTimeout(() => {
        goNext(nextResults);
      }, FEEDBACK_MS);
    },
    [goNext, question],
  );

  useEffect(() => {
    secondsLeftRef.current = secondsLeft;
  }, [secondsLeft]);

  // Countdown via interval callbacks only (no sync setState in effect body)
  useEffect(() => {
    if (!timerEnabled || finished || selected !== null || timedOut) return;

    const id = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(id);
          window.setTimeout(() => {
            settleAnswer({
              index: null,
              timedOut: true,
              elapsedBonus: false,
            });
          }, 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(id);
  }, [timerEnabled, finished, selected, timedOut, current, settleAnswer]);

  useEffect(() => () => clearAdvance(), [clearAdvance]);

  function handleAnswer(index: number) {
    if (selected !== null || timedOut || answeredRef.current) return;
    const left = secondsLeftRef.current;
    const fast = timerEnabled && left > FAST_BONUS_SECONDS;
    settleAnswer({
      index,
      timedOut: false,
      elapsedBonus: fast,
    });
  }

  function reset() {
    clearAdvance();
    answeredRef.current = false;
    resultsRef.current = [];
    setDeckNonce((n) => n + 1);
    setCurrent(0);
    setScore(0);
    setBonusPoints(0);
    setStreak(0);
    setBestStreak(0);
    setSelected(null);
    setTimedOut(false);
    setFinished(false);
    setSecondsLeft(QUESTION_SECONDS);
    secondsLeftRef.current = QUESTION_SECONDS;
    setResults([]);
  }

  const revealed = selected !== null || timedOut;
  const maxScore = total + total;
  const totalPoints = score + bonusPoints;

  const timerPct = useMemo(
    () => Math.max(0, (secondsLeft / QUESTION_SECONDS) * 100),
    [secondsLeft],
  );

  if (finished) {
    const pct = Math.round((totalPoints / Math.max(1, maxScore)) * 100);
    const title =
      pct >= 80
        ? "Guardião da mata!"
        : pct >= 50
          ? "Bom caminho pela floresta!"
          : "Continue explorando o folclore!";
    const badges = results.filter((r) => r.correct);

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
            Você fez{" "}
            <strong className="text-ink">{totalPoints} pts</strong> ({score}{" "}
            acertos
            {bonusPoints > 0 ? ` · ${bonusPoints} bônus rápidos` : ""})
          </p>
          {bestStreak > 1 ? (
            <p className="mt-1 text-sm text-forest-mid">
              Melhor combo: {bestStreak} seguidos
            </p>
          ) : null}
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

          {badges.length > 0 ? (
            <div className="mt-8">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-forest-mid">
                Insígnias conquistadas
              </p>
              <ul className="mt-4 flex flex-wrap justify-center gap-3">
                {badges.map((b) => (
                  <li
                    key={b.character}
                    className="flex w-20 flex-col items-center gap-1.5"
                  >
                    <span className="overflow-hidden rounded-full border-2 border-forest/20 shadow-sm">
                      <Image
                        src={b.image}
                        alt=""
                        width={64}
                        height={64}
                        className="h-14 w-14 object-cover"
                      />
                    </span>
                    <span className="text-[10px] font-semibold text-forest">
                      {b.character}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

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

  if (!question) return null;

  if (!isClient) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="h-2 overflow-hidden rounded-full bg-mist-soft">
          <div className="h-full w-0 rounded-full bg-forest-mid" />
        </div>
        <div className="mt-6 border border-forest/12 bg-white/75 px-6 py-16 text-center text-sm text-ash">
          Preparando a gincana…
        </div>
      </div>
    );
  }

  const isCorrectPick =
    selected !== null && selected === question.correct && !timedOut;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-sm text-ash">
          <span>
            Pergunta {current + 1} de {total}
          </span>
          <div className="flex items-center gap-3">
            {streak > 1 ? (
              <span className="rounded-md bg-sprout/40 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-forest">
                Combo ×{streak}
              </span>
            ) : null}
            <span className="font-medium text-ink">
              {totalPoints} pts
              <span className="ml-1 font-normal text-ash">
                ({score} acertos
                {bonusPoints > 0 ? ` +${bonusPoints}` : ""})
              </span>
            </span>
          </div>
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
        {timerEnabled ? (
          <div className="mt-3">
            <div className="mb-1 flex justify-between text-[11px] font-semibold uppercase tracking-wide text-ash">
              <span>Tempo</span>
              <span
                className={secondsLeft <= 5 ? "text-burn" : "text-forest-mid"}
              >
                {secondsLeft}s
                {!revealed && secondsLeft > FAST_BONUS_SECONDS
                  ? " · bônus rápido"
                  : ""}
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-mist-soft">
              <motion.div
                className={`h-full rounded-full ${
                  secondsLeft <= 5 ? "bg-burn" : "bg-forest-mid/70"
                }`}
                animate={{ width: `${timerPct}%` }}
                transition={{ duration: reduce ? 0 : 0.35, ease: "linear" }}
              />
            </div>
          </div>
        ) : null}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${deckNonce}-${question.id}`}
          className="border border-forest/12 bg-white/75 px-6 py-7 sm:px-8 sm:py-8"
          initial={reduce ? false : { opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduce ? undefined : { opacity: 0, x: -14 }}
          transition={enterTransition}
        >
          <div className="relative mx-auto mb-5 overflow-hidden rounded-xl border border-forest/10 bg-mist-soft">
            <Image
              src={question.image}
              alt={revealed ? question.character : "Personagem do folclore"}
              width={640}
              height={640}
              className={`aspect-square h-auto w-full object-cover transition-[filter,transform] duration-500 ${
                revealed
                  ? "scale-100 blur-0"
                  : "scale-[1.04] blur-[10px] brightness-90"
              }`}
              sizes="(max-width: 672px) 100vw, 640px"
              priority={current === 0}
            />
            {!revealed ? (
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a1610]/45 via-transparent to-[#0a1610]/15"
              />
            ) : null}
            {revealed ? (
              <motion.p
                className="absolute bottom-3 left-3 rounded-md bg-white/90 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-forest shadow-sm"
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {question.character}
              </motion.p>
            ) : (
              <p className="absolute bottom-3 left-3 rounded-md bg-black/35 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-mist">
                Quem é?
              </p>
            )}
          </div>

          <h2 className="font-display text-lg font-semibold text-ink sm:text-xl">
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
              if (revealed) {
                if (isCorrect) cls = "border-sprout-deep bg-sprout/25";
                else if (isSelected) cls = "border-burn/40 bg-[#f8efe8]";
                else cls = "border-forest/5 bg-mist/50 opacity-55";
              }

              return (
                <motion.button
                  key={`${question.id}-${opt}`}
                  type="button"
                  onClick={() => handleAnswer(i)}
                  disabled={revealed}
                  className={`flex cursor-pointer items-center gap-3 border px-4 py-3.5 text-left text-sm font-medium text-ink transition sm:text-base ${cls}`}
                  variants={staggerItemSoft}
                  whileTap={reduce || revealed ? undefined : { scale: 0.99 }}
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
            {revealed ? (
              <motion.div
                className="mt-5 space-y-2 bg-mist-soft px-4 py-3 text-sm leading-relaxed text-ash"
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0 }}
                transition={{ duration: reduce ? 0 : 0.35, ease: softEase }}
              >
                {timedOut ? (
                  <p className="font-semibold text-burn">
                    Tempo esgotado — era {question.character}.
                  </p>
                ) : isCorrectPick ? (
                  <p className="font-semibold text-forest">
                    Acertou!
                    {timerEnabled && secondsLeft > FAST_BONUS_SECONDS
                      ? " +1 bônus rápido"
                      : ""}
                  </p>
                ) : (
                  <p className="font-semibold text-burn">
                    Quase — a resposta é {question.character}.
                    {question.hint ? ` ${question.hint}` : ""}
                  </p>
                )}
                <p>{question.feedback}</p>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
