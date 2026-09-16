"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  HeroParallaxStrips,
  useHeroStripHover,
} from "./HeroParallaxStrips";
import { pressTransition, softEase } from "./motion/variants";

const copyContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.14, delayChildren: 0.55 },
  },
};

const copyItem = {
  hidden: { opacity: 0, y: 28, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.85, ease: softEase },
  },
};

const brandItem = {
  hidden: { opacity: 0, y: 36, scale: 0.96, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 1, ease: softEase },
  },
};

export function Hero() {
  const reduce = useReducedMotion();
  const stripHover = useHeroStripHover();

  return (
    <section
      id="topo"
      className="relative min-h-[100svh] overflow-hidden"
      onPointerEnter={reduce ? undefined : stripHover.onPointerEnter}
      onPointerLeave={reduce ? undefined : stripHover.onPointerLeave}
      onPointerMove={reduce ? undefined : stripHover.onPointerMove}
    >
      <HeroParallaxStrips
        pointerX={stripHover.pointerX}
        pointerY={stripHover.pointerY}
        hovering={stripHover.hovering}
      />

      <motion.div
        aria-hidden
        className="hero-overlay pointer-events-none absolute inset-0"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.2, ease: softEase }}
      />

      {/* Soft bottom vignette for CTA legibility */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[#0a1610]/85 via-[#0a1610]/35 to-transparent"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.4 }}
      />

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col justify-end px-5 pb-16 pt-28 md:px-8 md:pb-24 md:pt-36">
        <motion.div
          className="max-w-2xl"
          variants={copyContainer}
          initial={reduce ? false : "hidden"}
          animate="visible"
        >
          <motion.div className="mb-7" variants={brandItem}>
            <motion.div
              initial={reduce ? false : { rotate: -6, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 1.1, delay: 0.65, ease: softEase }}
            >
              <Image
                src="/brand/logo-ecomind.png"
                alt="EcoMind"
                width={120}
                height={120}
                className="h-14 w-14 object-contain drop-shadow-md md:h-16 md:w-16"
                priority
              />
            </motion.div>
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
