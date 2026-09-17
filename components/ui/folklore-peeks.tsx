"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { motion, useReducedMotion } from "framer-motion";

type Peek = {
  id: string;
  src: string;
  className: string;
  imgClassName?: string;
};

const PEEKS: Peek[] = [
  {
    id: "saci",
    src: "/folclore/peeks/saci.png",
    className:
      "bottom-[max(4.75rem,env(safe-area-inset-bottom))] left-[-0.35rem] md:bottom-6 md:left-0",
    imgClassName: "origin-bottom-left",
  },
  {
    id: "curupira",
    src: "/folclore/peeks/curupira.png",
    className:
      "bottom-[max(4.75rem,env(safe-area-inset-bottom))] right-[-0.35rem] md:bottom-8 md:right-0",
    imgClassName: "origin-bottom-right -scale-x-100",
  },
  {
    id: "boitata",
    src: "/folclore/peeks/boitata.png",
    className: "right-[-0.5rem] top-[42%] hidden sm:block",
    imgClassName: "origin-right",
  },
  {
    id: "iara",
    src: "/folclore/peeks/iara.png",
    className: "left-[-0.45rem] top-[28%] hidden md:block",
    imgClassName: "origin-left -scale-x-100",
  },
];

function peeksBlocked(pathname: string | null): boolean {
  if (!pathname) return true;
  return pathname.startsWith("/alerta-queimadas");
}

function subscribePastHero(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  window.addEventListener("resize", onChange, { passive: true });
  return () => {
    window.removeEventListener("scroll", onChange);
    window.removeEventListener("resize", onChange);
  };
}

function getPastHero() {
  const threshold = Math.min(window.innerHeight * 0.72, 640);
  return window.scrollY > threshold;
}

/**
 * Mini folklore characters peeking from screen corners.
 * Decorative only — never captures clicks.
 * Hidden on the fire map; on home, only after scrolling past the hero.
 */
export function FolklorePeeks() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const blocked = peeksBlocked(pathname);
  const isHome = pathname === "/";
  const pastHero = useSyncExternalStore(
    subscribePastHero,
    getPastHero,
    () => !isHome,
  );

  const visible = !blocked && (!isHome || pastHero);
  if (!visible) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[45] overflow-hidden"
    >
      {PEEKS.map((peek, i) => (
        <motion.div
          key={peek.id}
          className={`absolute w-[4.75rem] sm:w-[5.5rem] md:w-[6.5rem] ${peek.className}`}
          initial={reduce ? false : { opacity: 0, y: 18, scale: 0.92 }}
          animate={
            reduce
              ? { opacity: 0.92 }
              : {
                  opacity: 0.92,
                  y: [0, -5, 0],
                  scale: 1,
                }
          }
          transition={
            reduce
              ? { duration: 0 }
              : {
                  opacity: { duration: 0.5, delay: 0.08 * i },
                  scale: { duration: 0.5, delay: 0.08 * i },
                  y: {
                    duration: 4.2 + i * 0.35,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.4 + i * 0.2,
                  },
                }
          }
        >
          <Image
            src={peek.src}
            alt=""
            width={360}
            height={360}
            className={`h-auto w-full drop-shadow-md ${peek.imgClassName ?? ""}`}
            sizes="104px"
            priority={false}
          />
        </motion.div>
      ))}
    </div>
  );
}
