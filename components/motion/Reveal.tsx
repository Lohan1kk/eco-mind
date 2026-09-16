"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import {
  revealTransition,
  revealVariants,
  revealViewport,
  type RevealVariantName,
} from "./variants";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delayMs?: number;
  /** Motion recipe — default matches previous fade-up reveal (no design change). */
  variant?: RevealVariantName;
  /** Re-run every time the element enters the viewport (default: once). */
  once?: boolean;
};

/**
 * Scroll reveal wrapper — single place for whileInView + reduced-motion.
 * Prefer this over inlining Framer viewport config in section components.
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
