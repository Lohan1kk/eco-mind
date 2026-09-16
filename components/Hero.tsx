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

const FOREST = "/brand/hero-forest.jpg";

const copyContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.13, delayChildren: 0.35 },
  },
};

const copyItem = {
  hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: softEase },
  },
};

const brandItem = {
  hidden: { opacity: 0, y: 32, scale: 0.97, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.95, ease: softEase },
  },
};

export function Hero() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(true);
  const [finePointer, setFinePointer] = useState(false);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const hovering = useMotionValue(0);

  const springX = useSpring(rawX, { stiffness: 60, damping: 22, mass: 0.5 });
  const springY = useSpring(rawY, { stiffness: 60, damping: 22, mass: 0.5 });
  const springHover = useSpring(hovering, { stiffness: 100, damping: 20 });

  // Hover parallax on top of ambient ken-burns (decorative, clamped)
  const hoverX = useTransform(
    [springX, springHover],
    ([x, h]: number[]) => (x as number) * 24 * (h as number),
  );
  const hoverY = useTransform(
    [springY, springHover],
    ([y, h]: number[]) => (y as number) * 16 * (h as number),
  );
  const hoverScale = useTransform(
    springHover,
    (h) => 1 + (h as number) * 0.018,
  );

  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const unsubX = springX.on("change", (x) =>
      setPointer((p) => ({ ...p, x })),
    );
    const unsubY = springY.on("change", (y) =>
      setPointer((p) => ({ ...p, y })),
    );
    return () => {
      unsubX();
      unsubY();
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

  const hoverTransform = useMotionTemplate`translate3d(${hoverX}px, ${hoverY}px, 0) scale(${hoverScale})`;

  const ambientOn = !reduce && active;

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
      {/* Photographic hero — continuous ken-burns + hover parallax */}
      <motion.div
        className="absolute inset-[-8%] will-change-transform"
        initial={reduce ? false : { opacity: 0.65, scale: 1.1 }}
        animate={
          ambientOn
            ? {
                opacity: 1,
                scale: [1.08, 1.14, 1.1, 1.08],
                x: ["0%", "1.4%", "-1%", "0%"],
                y: ["0%", "-0.9%", "1.1%", "0%"],
              }
            : { opacity: 1, scale: 1.08, x: "0%", y: "0%" }
        }
        transition={
          ambientOn
            ? {
                opacity: { duration: 1.4, ease: softEase },
                scale: { duration: 32, ease: "easeInOut", repeat: Infinity },
                x: { duration: 36, ease: "easeInOut", repeat: Infinity },
                y: { duration: 40, ease: "easeInOut", repeat: Infinity },
              }
            : { duration: 0.6, ease: softEase }
        }
      >
        <motion.div
          className="absolute inset-0 will-change-transform"
          style={reduce ? undefined : { transform: hoverTransform }}
        >
          <Image
            src={FOREST}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_35%]"
          />
        </motion.div>
      </motion.div>

      {/* High-quality WebGL atmosphere: mist + god rays */}
      {!reduce ? (
        <ForestAtmosphere
          intensity={active ? 1 : 0.35}
          pointerX={finePointer ? pointer.x : 0}
          pointerY={finePointer ? pointer.y : 0}
          active={active}
        />
      ) : null}

      {/* Legibility veil — stronger on left for brand */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.1, delay: 0.15, ease: softEase }}
        style={{
          background: `
            linear-gradient(105deg, rgba(10,22,16,0.78) 0%, rgba(10,22,16,0.42) 42%, rgba(10,22,16,0.12) 72%, rgba(10,22,16,0.28) 100%),
            linear-gradient(to top, rgba(10,22,16,0.7) 0%, transparent 45%)
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
