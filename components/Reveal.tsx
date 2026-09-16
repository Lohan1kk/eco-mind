"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { enterTransition, fadeUp } from "./motion/variants";

export function Reveal({
  children,
  className = "",
  delayMs = 0,
}: {
  children: ReactNode;
  className?: string;
  delayMs?: number;
}) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15, margin: "0px 0px -40px 0px" }}
      transition={{ ...enterTransition, delay: delayMs / 1000 }}
    >
      {children}
    </motion.div>
  );
}
