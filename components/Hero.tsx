"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  HeroParallaxStrips,
  useHeroStripHover,
} from "./HeroParallaxStrips";
import { heroItem, heroStagger, pressTransition } from "./motion/variants";

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
        hoverY={stripHover.hoverY}
        hovering={stripHover.hovering}
      />
      <div aria-hidden className="hero-overlay pointer-events-none absolute inset-0" />

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col justify-end px-5 pb-16 pt-28 md:px-8 md:pb-24 md:pt-36">
        <motion.div
          className="max-w-2xl"
          variants={heroStagger}
          initial={reduce ? false : "hidden"}
          animate="visible"
        >
          <motion.div className="mb-7" variants={heroItem}>
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
            variants={heroItem}
          >
            Cada decisão é uma semente.
          </motion.h1>

          <motion.p
            className="mt-5 max-w-lg text-base leading-relaxed text-mist/88 md:text-xl"
            variants={heroItem}
          >
            Consciência ambiental + tecnologia para educar, calcular impacto e
            acompanhar queimadas — na escola, em casa e na comunidade.
          </motion.p>

          <motion.div className="mt-9 flex flex-wrap gap-3" variants={heroItem}>
            <motion.div
              whileTap={reduce ? undefined : { scale: 0.98 }}
              transition={pressTransition}
            >
              <Link href="/calculadora" className="btn btn-primary">
                Calcular minha pegada
              </Link>
            </motion.div>
            <motion.div
              whileTap={reduce ? undefined : { scale: 0.98 }}
              transition={pressTransition}
            >
              <Link href="/alerta-queimadas" className="btn btn-ghost">
                Ver mapa de queimadas
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
