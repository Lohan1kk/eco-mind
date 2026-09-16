"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { staggerContainer, staggerItem } from "@/components/motion";

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
      variants={staggerContainer}
      initial={reduce ? false : "hidden"}
      animate="visible"
    >
      <motion.p className={eyebrowClassName ?? "eyebrow"} variants={staggerItem}>
        {eyebrow}
      </motion.p>
      <motion.h1
        className={titleClassName ?? "display mt-3 text-3xl md:text-5xl"}
        variants={staggerItem}
      >
        {title}
      </motion.h1>
      {children ? (
        <motion.div variants={staggerItem}>{children}</motion.div>
      ) : null}
    </motion.div>
  );
}
