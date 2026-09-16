"use client";

import Image from "next/image";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useEffect, useState, type PointerEvent } from "react";

const FOREST = "/brand/hero-forest.jpg";

type StripConfig = {
  position: string;
  duration: number;
  /** 1 = up, -1 = down */
  direction: 1 | -1;
  hoverFactor: number;
};

const DESKTOP_STRIPS: StripConfig[] = [
  { position: "12% 28%", duration: 28, direction: 1, hoverFactor: 28 },
  { position: "28% 32%", duration: 36, direction: -1, hoverFactor: 36 },
  { position: "42% 26%", duration: 24, direction: 1, hoverFactor: 42 },
  { position: "55% 34%", duration: 40, direction: -1, hoverFactor: 48 },
  { position: "68% 30%", duration: 26, direction: 1, hoverFactor: 34 },
  { position: "82% 36%", duration: 34, direction: -1, hoverFactor: 40 },
  { position: "94% 28%", duration: 30, direction: 1, hoverFactor: 30 },
];

const MOBILE_STRIPS: StripConfig[] = [
  { position: "22% 30%", duration: 32, direction: 1, hoverFactor: 0 },
  { position: "50% 28%", duration: 40, direction: -1, hoverFactor: 0 },
  { position: "78% 34%", duration: 36, direction: 1, hoverFactor: 0 },
];

function Strip({
  config,
  priority,
  hoverY,
  hovering,
  enableHover,
}: {
  config: StripConfig;
  priority?: boolean;
  hoverY: MotionValue<number>;
  hovering: MotionValue<number>;
  enableHover: boolean;
}) {
  const hoverOffset = useTransform(
    [hoverY, hovering],
    ([y, h]: number[]) =>
      enableHover ? (y as number) * config.hoverFactor * 2 * (h as number) : 0,
  );
  const springOffset = useSpring(hoverOffset, {
    stiffness: 80,
    damping: 22,
    mass: 0.4,
  });

  const from = config.direction === 1 ? "0%" : "-50%";
  const to = config.direction === 1 ? "-50%" : "0%";

  return (
    <div className="relative h-full min-w-0 flex-1 overflow-hidden">
      <motion.div
        className="absolute inset-x-0 top-0 will-change-transform"
        style={{ y: enableHover ? springOffset : 0 }}
      >
        <motion.div
          className="flex flex-col"
          animate={{ y: [from, to] }}
          transition={{
            duration: config.duration,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          {[0, 1].map((copy) => (
            <div key={copy} className="relative h-[100svh] w-full shrink-0">
              <Image
                src={FOREST}
                alt=""
                fill
                priority={Boolean(priority && copy === 0)}
                sizes="20vw"
                className="object-cover"
                style={{ objectPosition: config.position }}
              />
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

export function HeroParallaxStrips({
  hoverY,
  hovering,
}: {
  hoverY: MotionValue<number>;
  hovering: MotionValue<number>;
}) {
  const reduce = useReducedMotion();
  const [finePointer, setFinePointer] = useState(false);
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
    const pointerMq = window.matchMedia("(pointer: fine)");
    const widthMq = window.matchMedia("(max-width: 767px)");
    const sync = () => {
      setFinePointer(pointerMq.matches);
      setNarrow(widthMq.matches);
    };
    sync();
    pointerMq.addEventListener("change", sync);
    widthMq.addEventListener("change", sync);
    return () => {
      pointerMq.removeEventListener("change", sync);
      widthMq.removeEventListener("change", sync);
    };
  }, []);

  if (reduce) {
    return (
      <div className="absolute inset-0">
        <Image
          src={FOREST}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_30%]"
        />
      </div>
    );
  }

  const strips = narrow ? MOBILE_STRIPS : DESKTOP_STRIPS;
  const enableHover = finePointer && !narrow;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 flex gap-px bg-[#0c1c14]"
    >
      {strips.map((config, i) => (
        <Strip
          key={`${config.position}-${i}`}
          config={config}
          priority={i === 0}
          hoverY={hoverY}
          hovering={hovering}
          enableHover={enableHover}
        />
      ))}
    </div>
  );
}

/** Motion values + handlers for hover-only parallax (no scroll). */
export function useHeroStripHover() {
  const hoverY = useMotionValue(0);
  const hovering = useMotionValue(0);

  return {
    hoverY,
    hovering,
    onPointerEnter: () => hovering.set(1),
    onPointerLeave: () => {
      hovering.set(0);
      hoverY.set(0);
    },
    onPointerMove: (e: PointerEvent<HTMLElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const y = (e.clientY - rect.top) / Math.max(rect.height, 1) - 0.5;
      hoverY.set(y);
    },
  };
}
