import type { Transition, Variants } from "framer-motion";

/** Soft ease from EcoMind + UI/UX Pro Max (150–300ms interactions, gentle enter). */
export const softEase = [0.22, 1, 0.36, 1] as const;

/* -------------------------------------------------------------------------- */
/* Transitions                                                                */
/* -------------------------------------------------------------------------- */

export const enterTransition: Transition = {
  duration: 0.55,
  ease: softEase,
};

export const pressTransition: Transition = {
  duration: 0.2,
  ease: "easeOut",
};

export const slowEnterTransition: Transition = {
  duration: 0.65,
  ease: softEase,
};

export const brandEnterTransition: Transition = {
  duration: 0.8,
  ease: softEase,
};

/* -------------------------------------------------------------------------- */
/* Fade                                                                       */
/* -------------------------------------------------------------------------- */

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

export const fadeDown: Variants = {
  hidden: { opacity: 0, y: -18 },
  visible: { opacity: 1, y: 0 },
};

/* -------------------------------------------------------------------------- */
/* Slide                                                                      */
/* -------------------------------------------------------------------------- */

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

export const slideDown: Variants = {
  hidden: { opacity: 0, y: -28 },
  visible: { opacity: 1, y: 0 },
};

export const slideLeft: Variants = {
  hidden: { opacity: 0, x: 28 },
  visible: { opacity: 1, x: 0 },
};

export const slideRight: Variants = {
  hidden: { opacity: 0, x: -28 },
  visible: { opacity: 1, x: 0 },
};

/** Quiz-style horizontal swap (exit left / enter right). */
export const slideSwap: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

/* -------------------------------------------------------------------------- */
/* Scale                                                                      */
/* -------------------------------------------------------------------------- */

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1 },
};

/** Soft brand/logo entrance (Hero mark). */
export const scaleSoft: Variants = {
  hidden: { opacity: 0, y: 22, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: brandEnterTransition,
  },
};

/* -------------------------------------------------------------------------- */
/* Stagger                                                                    */
/* -------------------------------------------------------------------------- */

export type StaggerOptions = {
  staggerChildren?: number;
  delayChildren?: number;
};

/** Factory for staggered parent containers. */
export function stagger(
  staggerChildren = 0.12,
  delayChildren = 0.08,
): Variants {
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren, delayChildren },
    },
  };
}

/** Default page/section stagger (PageIntro). */
export const staggerContainer: Variants = stagger(0.12, 0.08);

/** Hero copy block — slightly later start so the photo settles first. */
export const staggerHero: Variants = stagger(0.12, 0.28);

/** Child item used inside stagger containers (same motion as fadeUp + enter). */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: enterTransition,
  },
};

/** Lighter child for hero body copy (matches previous Hero copyItem). */
export const staggerItemSoft: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: slowEnterTransition,
  },
};

/** @deprecated Prefer `staggerContainer` — kept for existing imports */
export const heroStagger = staggerContainer;

/** @deprecated Prefer `staggerItem` — kept for existing imports */
export const heroItem = staggerItem;

/* -------------------------------------------------------------------------- */
/* Hover / press (use with whileHover / whileTap)                             */
/* -------------------------------------------------------------------------- */

export const hoverLift = { y: -2 } as const;
export const hoverNone = {} as const;

export const tapPress = { scale: 0.98 } as const;
export const tapSoft = { scale: 0.97 } as const;

/** Pair for interactive CTAs — pass through `useReducedMotion` gate at call site. */
export const hoverPresets = {
  lift: {
    whileHover: hoverLift,
    whileTap: tapPress,
    transition: pressTransition,
  },
  press: {
    whileHover: hoverNone,
    whileTap: tapPress,
    transition: pressTransition,
  },
  softPress: {
    whileHover: hoverNone,
    whileTap: tapSoft,
    transition: pressTransition,
  },
} as const;

/* -------------------------------------------------------------------------- */
/* Reveal on scroll                                                           */
/* -------------------------------------------------------------------------- */

export type RevealVariantName =
  | "fade"
  | "fadeUp"
  | "slideUp"
  | "slideLeft"
  | "slideRight"
  | "scale";

export const revealVariants: Record<RevealVariantName, Variants> = {
  fade: fadeIn,
  fadeUp,
  slideUp,
  slideLeft,
  slideRight,
  scale: scaleIn,
};

/** Shared IntersectionObserver viewport for scroll reveals. */
export const revealViewport = {
  once: true,
  amount: 0.15,
  margin: "0px 0px -40px 0px",
} as const;

export function revealTransition(delayMs = 0): Transition {
  return { ...enterTransition, delay: delayMs / 1000 };
}
