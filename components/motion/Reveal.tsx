"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import {
  hoverPresets,
  revealTransition,
  revealVariants,
  revealViewport,
  stagger,
  staggerItem,
  staggerItemSoft,
  type RevealVariantName,
} from "./variants";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delayMs?: number;
  /** Motion recipe — default matches previous fade-up reveal. */
  variant?: RevealVariantName;
  /** Re-run every time the element enters the viewport (default: once). */
  once?: boolean;
};

/**
 * Scroll reveal wrapper — single place for whileInView + reduced-motion.
 */
export function Reveal({
  children,
  className = "",
  delayMs = 0,
  variant = "fadeUp",
  once = true,
}: RevealProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={revealVariants[variant]}
      initial="hidden"
      whileInView="visible"
      viewport={{ ...revealViewport, once }}
      transition={revealTransition(delayMs)}
    >
      {children}
    </motion.div>
  );
}

type StaggerRevealProps = {
  children: ReactNode;
  className?: string;
  staggerChildren?: number;
  delayChildren?: number;
  once?: boolean;
};

/**
 * Parent for intentional cascades — children should be `StaggerItem`.
 * Use for section headers and badge rows, not for every block on the page.
 */
export function StaggerReveal({
  children,
  className = "",
  staggerChildren = 0.1,
  delayChildren = 0.05,
  once = true,
}: StaggerRevealProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={stagger(staggerChildren, delayChildren)}
      initial="hidden"
      whileInView="visible"
      viewport={{ ...revealViewport, once }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className = "",
  soft = false,
}: {
  children: ReactNode;
  className?: string;
  /** Softer/faster child — secondary copy under a headline */
  soft?: boolean;
}) {
  return (
    <motion.div
      className={className}
      variants={soft ? staggerItemSoft : staggerItem}
    >
      {children}
    </motion.div>
  );
}

type MotionPressProps = {
  children: ReactNode;
  className?: string;
  preset?: keyof typeof hoverPresets;
};

/** Hover/tap wrapper for CTAs — gate with reduced motion. */
export function MotionPress({
  children,
  className = "",
  preset = "lift",
}: MotionPressProps) {
  const reduce = useReducedMotion();
  const p = hoverPresets[preset];

  return (
    <motion.div
      className={className}
      whileHover={reduce ? undefined : p.whileHover}
      whileTap={reduce ? undefined : p.whileTap}
      transition={p.transition}
    >
      {children}
    </motion.div>
  );
}
