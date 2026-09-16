import type { Transition, Variants } from "framer-motion";

/** Soft ease from EcoMind + UI/UX Pro Max (150–300ms interactions, gentle enter). */
export const softEase = [0.22, 1, 0.36, 1] as const;

export const enterTransition: Transition = {
  duration: 0.55,
  ease: softEase,
};

export const pressTransition: Transition = {
  duration: 0.2,
  ease: "easeOut",
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const heroStagger: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.08 },
  },
};

export const heroItem: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: enterTransition,
  },
};
