"use client";

import Image from "next/image";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

const FOREST = "/brand/hero-forest.jpg";

type StripConfig = {
  id: string;
  /** CSS object-position — different crop of the same forest */
  position: string;
  /** Base loop speed (higher = faster) */
  speed: number;
  direction: 1 | -1;
  /** Relative depth: center strips feel closer */
  depth: number;
  /** Flex grow for uneven cinematic columns */
  grow: number;
};

/** Desktop: 7 cinematic columns — alternating drift, depth-weighted hover. */
const DESKTOP_STRIPS: StripConfig[] = [
  { id: "d0", position: "8% 32%", speed: 0.018, direction: 1, depth: 0.35, grow: 0.85 },
  { id: "d1", position: "22% 28%", speed: 0.026, direction: -1, depth: 0.55, grow: 1 },
  { id: "d2", position: "38% 34%", speed: 0.034, direction: 1, depth: 0.85, grow: 1.15 },
  { id: "d3", position: "52% 30%", speed: 0.042, direction: -1, depth: 1, grow: 1.35 },
  { id: "d4", position: "66% 36%", speed: 0.032, direction: 1, depth: 0.8, grow: 1.1 },
  { id: "d5", position: "80% 28%", speed: 0.024, direction: -1, depth: 0.5, grow: 0.95 },
  { id: "d6", position: "94% 33%", speed: 0.016, direction: 1, depth: 0.3, grow: 0.8 },
];

const MOBILE_STRIPS: StripConfig[] = [
  { id: "m0", position: "20% 30%", speed: 0.02, direction: 1, depth: 0.5, grow: 1 },
  { id: "m1", position: "50% 28%", speed: 0.028, direction: -1, depth: 1, grow: 1.2 },
  { id: "m2", position: "78% 34%", speed: 0.022, direction: 1, depth: 0.55, grow: 1 },
];

function StripColumn({
  config,
  index,
  total,
  priority,
  pointerX,
  pointerY,
  hovering,
  enableHover,
  active,
  reduce,
}: {
  config: StripConfig;
  index: number;
  total: number;
  priority?: boolean;
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
  hovering: MotionValue<number>;
  enableHover: boolean;
  active: boolean;
  reduce: boolean;
}) {
  const progress = useMotionValue(0);
  const speedBoost = useMotionValue(1);

  // Hover → depth-weighted parallax (UI/UX Pro Max: clamp magnetic pull)
  const hoverY = useTransform(
    [pointerY, hovering],
    ([y, h]: number[]) =>
      enableHover ? (y as number) * config.depth * 56 * (h as number) : 0,
  );
  const hoverX = useTransform(
    [pointerX, hovering],
    ([x, h]: number[]) =>
      enableHover ? (x as number) * config.depth * 10 * (h as number) : 0,
  );
  const hoverScale = useTransform(
    [hovering],
    ([h]: number[]) => 1 + (enableHover ? config.depth * 0.04 * (h as number) : 0),
  );

  const springY = useSpring(hoverY, { stiffness: 70, damping: 24, mass: 0.45 });
  const springX = useSpring(hoverX, { stiffness: 90, damping: 26, mass: 0.4 });
  const springScale = useSpring(hoverScale, {
    stiffness: 100,
    damping: 28,
    mass: 0.35,
  });

  useEffect(() => {
    if (!enableHover) return;
    const unsub = hovering.on("change", (h) => {
      speedBoost.set(1 + h * 0.45 * config.depth);
    });
    return unsub;
  }, [hovering, speedBoost, enableHover, config.depth]);

  // Continuous autoplay via animation frame — pauses offscreen / hidden / reduced
  useAnimationFrame((_, delta) => {
    if (reduce || !active || document.hidden) return;
    const clamped = Math.min(delta, 48);
    const next =
      progress.get() +
      clamped * config.speed * config.direction * speedBoost.get() * 0.001;
    // Keep in [0, 1) for seamless 2-panel loop
    progress.set(((next % 1) + 1) % 1);
  });

  const loopY = useTransform(progress, (p) => `${-p * 50}%`);

  // Entrance: staggered curtain from center
  const fromCenter = Math.abs(index - (total - 1) / 2);
  const enterDelay = 0.08 + fromCenter * 0.07;

  return (
    <motion.div
      className="relative h-full min-w-0 overflow-hidden"
      style={{ flexGrow: config.grow, flexBasis: 0 }}
      initial={reduce ? false : { opacity: 0, scaleY: 1.08, filter: "brightness(0.55)" }}
      animate={{ opacity: 1, scaleY: 1, filter: "brightness(1)" }}
      transition={{
        duration: 1.15,
        delay: enterDelay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {/* Hover parallax (x/y/scale) wraps the seamless loop track */}
      <motion.div
        className="absolute inset-0 origin-center will-change-transform"
        style={{
          x: enableHover ? springX : 0,
          y: enableHover ? springY : 0,
          scale: enableHover ? springScale : 1,
        }}
      >
        <motion.div
          className="absolute inset-x-0 top-0 flex w-full flex-col will-change-transform"
          style={{ y: loopY }}
        >
          {[0, 1].map((copy) => (
            <div key={copy} className="relative h-[100svh] w-full shrink-0">
              <Image
                src={FOREST}
                alt=""
                fill
                priority={Boolean(priority && copy === 0)}
                sizes="(max-width: 768px) 40vw, 18vw"
                className="object-cover"
                style={{
                  objectPosition: config.position,
                  transform: `scale(${1.08 + config.depth * 0.06})`,
                }}
              />
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(180deg, rgba(12,28,20,${0.22 - config.depth * 0.12}) 0%, transparent 35%, rgba(12,28,20,${0.28 - config.depth * 0.1}) 100%)`,
                }}
              />
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Hairline separator (forest tint) */}
      {index < total - 1 ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-px bg-gradient-to-b from-transparent via-sprout/25 to-transparent"
        />
      ) : null}
    </motion.div>
  );
}

export function HeroParallaxStrips({
  pointerX,
  pointerY,
  hovering,
}: {
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
  hovering: MotionValue<number>;
}) {
  const reduce = useReducedMotion() ?? false;
  const rootRef = useRef<HTMLDivElement>(null);
  const [finePointer, setFinePointer] = useState(false);
  const [narrow, setNarrow] = useState(false);
  const [active, setActive] = useState(true);

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

  // Pause when hero is offscreen (UI/UX Pro Max motion.csv: stop offscreen)
  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { threshold: 0.05 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  if (reduce) {
    return (
      <div ref={rootRef} className="absolute inset-0">
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
      ref={rootRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 flex bg-[#0a1610]"
    >
      {strips.map((config, i) => (
        <StripColumn
          key={config.id}
          config={config}
          index={i}
          total={strips.length}
          priority={i === Math.floor(strips.length / 2)}
          pointerX={pointerX}
          pointerY={pointerY}
          hovering={hovering}
          enableHover={enableHover}
          active={active}
          reduce={reduce}
        />
      ))}
    </div>
  );
}

/** Hover-only pointer fields for the hero (no scroll linkage). */
export function useHeroStripHover() {
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const hovering = useMotionValue(0);
  const springHover = useSpring(hovering, { stiffness: 120, damping: 20 });

  return {
    pointerX,
    pointerY,
    hovering: springHover,
    onPointerEnter: () => hovering.set(1),
    onPointerLeave: () => {
      hovering.set(0);
      pointerX.set(0);
      pointerY.set(0);
    },
    onPointerMove: (e: ReactPointerEvent<HTMLElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left) / Math.max(rect.width, 1) - 0.5;
      const y = (e.clientY - rect.top) / Math.max(rect.height, 1) - 0.5;
      // Clamp magnetic strength (motion.csv complex hover)
      pointerX.set(Math.max(-0.5, Math.min(0.5, x)));
      pointerY.set(Math.max(-0.5, Math.min(0.5, y)));
    },
  };
}
