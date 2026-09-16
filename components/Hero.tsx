"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ForestAtmosphere } from "@/components/ui/forest-atmosphere";
import {
  hoverLift,
  pressTransition,
  scaleSoft,
  softEase,
  staggerHero,
  staggerItemSoft,
  tapPress,
} from "@/components/motion";

/** True 4K forest photograph (not AI-upscaled). */
const BG = "/brand/hero-ecomind-4k.jpg";

export function Hero() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(true);

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

  const ambientOn = !reduce && active;

  return (
    <section
      ref={sectionRef}
      id="topo"
      className="relative min-h-[100svh] overflow-hidden bg-[#0a1610]"
    >
      {/* Minimal scale so sharpness of the 4K source is preserved */}
      <motion.div
        className="absolute inset-0 will-change-transform"
        initial={reduce ? false : { opacity: 0.8, scale: 1.04 }}
        animate={
          ambientOn
            ? { opacity: 1, scale: [1.02, 1.045, 1.02] }
            : { opacity: 1, scale: 1.02 }
        }
        transition={
          ambientOn
            ? {
                opacity: { duration: 1.1, ease: softEase },
                scale: {
                  duration: 30,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "mirror",
                },
              }
            : { duration: 0.45, ease: softEase }
        }
      >
        <Image
          src={BG}
          alt=""
          fill
          priority
          quality={92}
          sizes="100vw"
          className="object-cover object-[52%_38%]"
        />
      </motion.div>

      {!reduce ? (
        <ForestAtmosphere intensity={active ? 0.42 : 0.2} active={active} />
      ) : null}

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            linear-gradient(105deg, rgba(10,22,16,0.68) 0%, rgba(10,22,16,0.32) 40%, rgba(10,22,16,0.06) 70%, rgba(10,22,16,0.2) 100%),
            linear-gradient(to top, rgba(10,22,16,0.6) 0%, transparent 46%)
          `,
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col justify-end px-5 pb-16 pt-28 md:px-8 md:pb-24 md:pt-36">
        <motion.div
          className="max-w-2xl"
          variants={staggerHero}
          initial={reduce ? false : "hidden"}
          animate="visible"
        >
          <motion.div className="mb-7" variants={scaleSoft}>
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
            variants={staggerItemSoft}
          >
            Cada decisão é uma semente.
          </motion.h1>

          <motion.p
            className="mt-5 max-w-lg text-base leading-relaxed text-mist/88 md:text-xl"
            variants={staggerItemSoft}
          >
            Consciência ambiental + tecnologia para educar, calcular impacto e
            acompanhar queimadas — na escola, em casa e na comunidade.
          </motion.p>

          <motion.div
            className="mt-9 flex flex-wrap gap-3"
            variants={staggerItemSoft}
          >
            <motion.div
              whileHover={reduce ? undefined : hoverLift}
              whileTap={reduce ? undefined : tapPress}
              transition={pressTransition}
            >
              <Link href="/calculadora" className="btn btn-primary cursor-pointer">
                Calcular minha pegada
              </Link>
            </motion.div>
            <motion.div
              whileHover={reduce ? undefined : hoverLift}
              whileTap={reduce ? undefined : tapPress}
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
