/**
 * EcoMind motion system — shared Framer Motion presets.
 *
 * Use variants/transitions from here instead of repeating motion config
 * in feature components. Design tokens (duration, ease, offsets) live in
 * `variants.ts` only.
 */
export {
  softEase,
  enterTransition,
  pressTransition,
  slowEnterTransition,
  brandEnterTransition,
  fadeIn,
  fadeUp,
  fadeDown,
  slideUp,
  slideDown,
  slideLeft,
  slideRight,
  slideSwap,
  scaleIn,
  scaleSoft,
  stagger,
  staggerContainer,
  staggerHero,
  staggerItem,
  staggerItemSoft,
  heroStagger,
  heroItem,
  hoverLift,
  tapPress,
  tapSoft,
  hoverPresets,
  revealVariants,
  revealViewport,
  revealTransition,
  type RevealVariantName,
  type StaggerOptions,
} from "./variants";

export { Reveal, StaggerReveal, StaggerItem, MotionPress } from "./Reveal";
