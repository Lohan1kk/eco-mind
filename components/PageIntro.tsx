"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { heroItem, heroStagger } from "./motion/variants";

export function PageIntro({
  eyebrow,
  title,
  children,
  eyebrowClassName,
  titleClassName,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
  eyebrowClassName?: string;
  titleClassName?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      variants={heroStagger}
      initial={reduce ? false : "hidden"}
      animate="visible"
    >
      <motion.p className={eyebrowClassName ?? "eyebrow"} variants={heroItem}>
        {eyebrow}
      </motion.p>
      <motion.h1
        className={titleClassName ?? "display mt-3 text-3xl md:text-5xl"}
        variants={heroItem}
      >
        {title}
      </motion.h1>
      {children ? (
        <motion.div variants={heroItem}>{children}</motion.div>
      ) : null}
    </motion.div>
  );
}
