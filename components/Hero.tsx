"use client";

import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useMotionTemplate,
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
    transition: { staggerChildren: 0.13, delayChildren: 0.4 },
  },
};

const copyItem = {
  hidden: { opacity: 0, y: 26, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.85, ease: softEase },
  },
};

const brandItem = {
  hidden: { opacity: 0, y: 32, scale: 0.97, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 1, ease: softEase },
  },
};

type LayerConfig = {
  translate: number;
  scale: number;
  extraScale: number;
  blur: number;
};

/** Depth multipliers — foreground moves the most (Wilderness pattern) */
const LAYERS: Record<"far" | "mid" | "near", LayerConfig> = {
  far: { translate: 14, scale: 1.06, extraScale: 0.02, blur: 1.5 },
  mid: { translate: 28, scale: 1.08, extraScale: 0.03, blur: 0 },
  near: { translate: 60, scale: 1.12, extraScale: 0.05, blur: 0 },
};

export function Hero() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(true);
  const [finePointer, setFinePointer] = useState(false);

  // Pointer state — clamped -0.5..0.5
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const hovering = useMotionValue(0);

  const springX = useSpring(rawX, { stiffness: 55, damping: 22, mass: 0.55 });
  const springY = useSpring(rawY, { stiffness: 55, damping: 22, mass: 0.55 });
  const springHover = useSpring(hovering, { stiffness: 90, damping: 22 });

  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const unX = springX.on("change", (x) => setPointer((p) => ({ ...p, x })));
    const unY = springY.on("change", (y) => setPointer((p) => ({ ...p, y })));
    return () => {
      unX();
      unY();
    };
  }, [springX, springY]);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    const sync = () => setFinePointer(mq.matches);
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

  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    if (reduce || !finePointer) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / Math.max(rect.width, 1) - 0.5;
    const y = (e.clientY - rect.top) / Math.max(rect.height, 1) - 0.5;
    rawX.set(Math.max(-0.5, Math.min(0.5, x)));
    rawY.set(Math.max(-0.5, Math.min(0.5, y)));
  };

  const ambientOn = !reduce && active;

  // Reusable transform per layer (depth-weighted)
  const useLayerTransform = (layer: LayerConfig) => {
    const x = useTransform(
      [springX, springHover],
      ([px, h]: number[]) =>
        (px as number) * layer.translate * (h as number) * (finePointer ? 1 : 0),
    );
    const y = useTransform(
      [springY, springHover],
      ([py, h]: number[]) =>
        (py as number) * layer.translate * 0.6 * (h as number) * (finePointer ? 1 : 0),
    );
    const scale = useTransform(
      springHover,
      (h) => layer.scale + (h as number) * layer.extraScale,
    );
    return useMotionTemplate`translate3d(${x}px, ${y}px, 0) scale(${scale})`;
  };

  const farTransform = useLayerTransform(LAYERS.far);
  const midTransform = useLayerTransform(LAYERS.mid);
  const nearTransform = useLayerTransform(LAYERS.near);

  return (
    <section
      ref={sectionRef}
      id="topo"
      className="relative min-h-[100svh] overflow-hidden bg-[#0a1610]"
      onPointerEnter={() => {
        if (!reduce && finePointer) hovering.set(1);
      }}
      onPointerLeave={() => {
        hovering.set(0);
        rawX.set(0);
        rawY.set(0);
      }}
      onPointerMove={onPointerMove}
    >
      {/* --- FAR: photograph background (slow ken-burns) --- */}
      <motion.div
        className="absolute inset-[-6%] will-change-transform"
        initial={reduce ? false : { opacity: 0.6, scale: 1.14 }}
        animate={
          ambientOn
            ? {
                opacity: 1,
                scale: [1.1, 1.16, 1.12, 1.1],
                x: ["0%", "1%", "-0.8%", "0%"],
                y: ["0%", "-0.8%", "0.9%", "0%"],
              }
            : { opacity: 1, scale: 1.1 }
        }
        transition={
          ambientOn
            ? {
                opacity: { duration: 1.4, ease: softEase },
                scale: { duration: 34, ease: "easeInOut", repeat: Infinity },
                x: { duration: 38, ease: "easeInOut", repeat: Infinity },
                y: { duration: 42, ease: "easeInOut", repeat: Infinity },
              }
            : { duration: 0.6, ease: softEase }
        }
      >
        <motion.div
          className="absolute inset-0 will-change-transform"
          style={reduce ? undefined : { transform: farTransform, filter: `blur(${LAYERS.far.blur}px)` }}
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
      </motion.div>

      {/* --- ATMOSPHERE (mid depth): WebGL mist + god rays --- */}
      {!reduce ? (
        <ForestAtmosphere
          intensity={active ? 1 : 0.35}
          pointerX={finePointer ? pointer.x : 0}
          pointerY={finePointer ? pointer.y : 0}
          active={active}
        />
      ) : null}

      {/* --- MID: subtle vignette that also parallaxes --- */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-[-4%]"
        style={reduce ? undefined : { transform: midTransform }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 90% 70% at 62% 40%, transparent 45%, rgba(10,22,16,0.55) 100%)`,
          }}
        />
      </motion.div>

      {/* --- NEAR: silhouetted foreground foliage (heaviest parallax) --- */}
      {!reduce ? (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-[-8%] will-change-transform"
          style={{ transform: nearTransform }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.3, delay: 0.25, ease: softEase }}
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

      {/* --- LEGIBILITY VEIL (asymmetric: darker on left for copy) --- */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.1, delay: 0.2, ease: softEase }}
        style={{
          background: `
            linear-gradient(105deg, rgba(10,22,16,0.72) 0%, rgba(10,22,16,0.38) 42%, rgba(10,22,16,0.08) 70%, rgba(10,22,16,0.22) 100%),
            linear-gradient(to top, rgba(10,22,16,0.7) 0%, transparent 48%)
          `,
        }}
      />

      {/* --- COPY --- */}
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
              whileHover={reduce ? undefined : { y: -2 }}
              whileTap={reduce ? undefined : { scale: 0.98 }}
              transition={pressTransition}
            >
              <Link href="/calculadora" className="btn btn-primary cursor-pointer">
                Calcular minha pegada
              </Link>
            </motion.div>
            <motion.div
              whileHover={reduce ? undefined : { y: -2 }}
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
