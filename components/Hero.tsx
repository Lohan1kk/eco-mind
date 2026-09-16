"use client";

import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { ForestAtmosphere } from "@/components/ui/forest-atmosphere";
import { pressTransition, softEase } from "./motion/variants";

const BG = "/brand/hero-wilderness.jpg";
const FG = "/brand/hero-wilderness-foreground.png";

const copyContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.13, delayChildren: 0.35 },
  },
};

const copyItem = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: softEase },
  },
};

const brandItem = {
  hidden: { opacity: 0, y: 28, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.85, ease: softEase },
  },
};

/**
 * Wilderness-style multi-layer hover parallax.
 * Critical: pointer drives MotionValues / a ref only — never React setState per frame
 * (that was freezing the page).
 */
export function Hero() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const finePointerRef = useRef(false);
  const [active, setActive] = useState(true);
  const [canHover, setCanHover] = useState(false);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const hovering = useMotionValue(0);

  const springX = useSpring(rawX, { stiffness: 70, damping: 24, mass: 0.45 });
  const springY = useSpring(rawY, { stiffness: 70, damping: 24, mass: 0.45 });
  const springHover = useSpring(hovering, { stiffness: 110, damping: 22 });

  // Far / mid / near — top-level transforms only (no nested hook helper)
  const farX = useTransform(
    [springX, springHover],
    ([x, h]: number[]) => (x as number) * 12 * (h as number),
  );
  const farY = useTransform(
    [springY, springHover],
    ([y, h]: number[]) => (y as number) * 8 * (h as number),
  );
  const midX = useTransform(
    [springX, springHover],
    ([x, h]: number[]) => (x as number) * 26 * (h as number),
  );
  const midY = useTransform(
    [springY, springHover],
    ([y, h]: number[]) => (y as number) * 16 * (h as number),
  );
  const nearX = useTransform(
    [springX, springHover],
    ([x, h]: number[]) => (x as number) * 52 * (h as number),
  );
  const nearY = useTransform(
    [springY, springHover],
    ([y, h]: number[]) => (y as number) * 32 * (h as number),
  );
  const nearScale = useTransform(springHover, (h) => 1.08 + (h as number) * 0.04);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    const sync = () => {
      finePointerRef.current = mq.matches;
      setCanHover(mq.matches);
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { threshold: 0.08 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  // Sync springs → shader ref without React re-renders
  useEffect(() => {
    const unX = springX.on("change", (x) => {
      pointerRef.current.x = x;
    });
    const unY = springY.on("change", (y) => {
      pointerRef.current.y = y;
    });
    return () => {
      unX();
      unY();
    };
  }, [springX, springY]);

  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    if (reduce || !finePointerRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / Math.max(rect.width, 1) - 0.5;
    const y = (e.clientY - rect.top) / Math.max(rect.height, 1) - 0.5;
    const cx = Math.max(-0.5, Math.min(0.5, x));
    const cy = Math.max(-0.5, Math.min(0.5, y));
    rawX.set(cx);
    rawY.set(cy);
    pointerRef.current = { x: cx, y: cy };
  };

  const ambientOn = !reduce && active;

  return (
    <section
      ref={sectionRef}
      id="topo"
      className="relative min-h-[100svh] overflow-hidden bg-[#0a1610]"
      onPointerEnter={() => {
        if (!reduce && finePointerRef.current) hovering.set(1);
      }}
      onPointerLeave={() => {
        hovering.set(0);
        rawX.set(0);
        rawY.set(0);
        pointerRef.current = { x: 0, y: 0 };
      }}
      onPointerMove={onPointerMove}
    >
      {/* FAR — photo + slow ken-burns */}
      <motion.div
        className="absolute inset-[-5%] will-change-transform"
        style={reduce ? undefined : { x: farX, y: farY }}
        initial={reduce ? false : { opacity: 0.7, scale: 1.1 }}
        animate={
          ambientOn
            ? {
                opacity: 1,
                scale: [1.08, 1.12, 1.08],
              }
            : { opacity: 1, scale: 1.08 }
        }
        transition={
          ambientOn
            ? {
                opacity: { duration: 1.2, ease: softEase },
                scale: {
                  duration: 28,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "mirror",
                },
              }
            : { duration: 0.5, ease: softEase }
        }
      >
        <Image
          src={BG}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[58%_42%]"
        />
      </motion.div>

      {/* MID — atmosphere shader (pointer via ref) */}
      {!reduce ? (
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{ x: midX, y: midY }}
        >
          <ForestAtmosphere
            intensity={active ? 1 : 0.3}
            pointerRef={pointerRef}
            active={active}
          />
        </motion.div>
      ) : null}

      {/* NEAR — foreground silhouette */}
      {!reduce ? (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-[-6%] will-change-transform"
          style={{ x: nearX, y: nearY, scale: nearScale }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.1, delay: 0.2, ease: softEase }}
        >
          <Image
            src={FG}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[58%_50%]"
          />
        </motion.div>
      ) : null}

      {/* Legibility veil */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            linear-gradient(105deg, rgba(10,22,16,0.72) 0%, rgba(10,22,16,0.38) 42%, rgba(10,22,16,0.08) 70%, rgba(10,22,16,0.22) 100%),
            linear-gradient(to top, rgba(10,22,16,0.7) 0%, transparent 48%)
          `,
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col justify-end px-5 pb-16 pt-28 md:px-8 md:pb-24 md:pt-36">
        <motion.div
          className="max-w-2xl"
          variants={copyContainer}
          initial={reduce ? false : "hidden"}
          animate="visible"
        >
          <motion.div className="mb-7" variants={brandItem}>
            <Image
              src="/brand/logo-ecomind.png"
              alt="EcoMind"
              width={120}
              height={120}
              className="h-14 w-14 object-contain drop-shadow-md md:h-16 md:w-16"
              priority
            />
            <p className="display mt-4 text-5xl text-mist md:text-7xl">
              EcoMind
            </p>
          </motion.div>

          <motion.h1
            className="display max-w-xl text-2xl text-sprout md:text-4xl"
            variants={copyItem}
          >
            Cada decisão é uma semente.
          </motion.h1>

          <motion.p
            className="mt-5 max-w-lg text-base leading-relaxed text-mist/88 md:text-xl"
            variants={copyItem}
          >
            Consciência ambiental + tecnologia para educar, calcular impacto e
            acompanhar queimadas — na escola, em casa e na comunidade.
          </motion.p>

          <motion.div className="mt-9 flex flex-wrap gap-3" variants={copyItem}>
            <motion.div
              whileHover={reduce || !canHover ? undefined : { y: -2 }}
              whileTap={reduce ? undefined : { scale: 0.98 }}
              transition={pressTransition}
            >
              <Link href="/calculadora" className="btn btn-primary cursor-pointer">
                Calcular minha pegada
              </Link>
            </motion.div>
            <motion.div
              whileHover={reduce || !canHover ? undefined : { y: -2 }}
              whileTap={reduce ? undefined : { scale: 0.98 }}
              transition={pressTransition}
            >
              <Link
                href="/alerta-queimadas"
                className="btn btn-ghost cursor-pointer"
              >
                Ver mapa de queimadas
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
