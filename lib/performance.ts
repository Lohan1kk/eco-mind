/**
 * Adaptive visual quality for EcoMind.
 * Shaders (Verdant / Forest) stay on for every tier — only DPR/FPS dial down.
 * CSS fallbacks are reserved for reduced-motion / missing WebGL only.
 */

export type PerfTier = "high" | "medium" | "low";

export type PerfProfile = {
  tier: PerfTier;
  /** Smoke trail cursor overlay */
  smokeCursor: boolean;
  smokeMaxParticles: number;
  smokeSpawnDesktop: number;
  smokeSpawnTouch: number;
  /** Full-bleed WebGL washes (Verdant) — always on unless reduced-motion */
  verdantWebgl: boolean;
  verdantMaxDpr: number;
  verdantTargetFps: number;
  /** Hero forest mist shader — always on unless reduced-motion */
  forestWebgl: boolean;
  forestMaxDpr: number;
  forestTargetFps: number;
  /** Hero photograph */
  heroSrc: "/brand/hero-ecomind-4k.jpg" | "/brand/hero-ecomind-hq.jpg";
  heroQuality: number;
  heroKenBurns: boolean;
  /** Map pin budget */
  mapMaxAlerts: number;
  /** Prefer CSS atmosphere grain off on low */
  atmosphereGrain: boolean;
};

const HIGH: PerfProfile = {
  tier: "high",
  smokeCursor: true,
  smokeMaxParticles: 220,
  smokeSpawnDesktop: 2,
  smokeSpawnTouch: 3,
  verdantWebgl: true,
  verdantMaxDpr: 1.75,
  verdantTargetFps: 60,
  forestWebgl: true,
  forestMaxDpr: 1.5,
  forestTargetFps: 60,
  heroSrc: "/brand/hero-ecomind-4k.jpg",
  heroQuality: 92,
  heroKenBurns: true,
  mapMaxAlerts: 400,
  atmosphereGrain: true,
};

const MEDIUM: PerfProfile = {
  tier: "medium",
  smokeCursor: true,
  smokeMaxParticles: 90,
  smokeSpawnDesktop: 1,
  smokeSpawnTouch: 2,
  verdantWebgl: true,
  verdantMaxDpr: 1.25,
  verdantTargetFps: 45,
  forestWebgl: true,
  forestMaxDpr: 1.25,
  forestTargetFps: 45,
  heroSrc: "/brand/hero-ecomind-hq.jpg",
  heroQuality: 88,
  heroKenBurns: true,
  mapMaxAlerts: 280,
  atmosphereGrain: true,
};

const LOW: PerfProfile = {
  tier: "low",
  smokeCursor: true,
  smokeMaxParticles: 48,
  smokeSpawnDesktop: 1,
  smokeSpawnTouch: 1,
  // Keep shaders alive — lighter fill rate, not CSS substitute
  verdantWebgl: true,
  verdantMaxDpr: 1,
  verdantTargetFps: 30,
  forestWebgl: true,
  forestMaxDpr: 1,
  forestTargetFps: 30,
  heroSrc: "/brand/hero-ecomind-hq.jpg",
  heroQuality: 82,
  heroKenBurns: true,
  mapMaxAlerts: 160,
  atmosphereGrain: false,
};

type NavigatorWithMemory = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean; effectiveType?: string };
};

function isCoarsePointer(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(pointer: coarse)").matches;
}

function prefersReducedData(): boolean {
  if (typeof navigator === "undefined") return false;
  const nav = navigator as NavigatorWithMemory;
  if (nav.connection?.saveData) return true;
  const type = nav.connection?.effectiveType;
  return type === "slow-2g" || type === "2g";
}

/**
 * Device tier. Phones default to medium (shaders on).
 * Low is only for clearly constrained hardware / save-data.
 */
export function detectPerfTier(): PerfTier {
  if (typeof window === "undefined") return "medium";

  // Accessibility: still report low so callers can soften motion elsewhere,
  // but WebGL flags stay true — components gate on prefers-reduced-motion.
  if (prefersReducedData()) return "low";

  const nav = navigator as NavigatorWithMemory;
  const cores = nav.hardwareConcurrency || 4;
  const memory = nav.deviceMemory;
  const coarse = isCoarsePointer();

  if (memory !== undefined && memory <= 2) return "low";
  if (cores <= 2) return "low";

  if (coarse) return "medium";
  if (memory !== undefined && memory <= 4) return "medium";
  if (cores <= 4) return "medium";

  return "high";
}

export function profileForTier(tier: PerfTier): PerfProfile {
  if (tier === "low") return LOW;
  if (tier === "medium") return MEDIUM;
  return HIGH;
}

export function detectPerfProfile(): PerfProfile {
  return profileForTier(detectPerfTier());
}

/** Frame gate for RAF loops — keeps motion fluid while cutting GPU fill. */
export function createFrameGate(targetFps: number) {
  const minDelta = 1000 / Math.max(1, targetFps);
  let last = 0;
  return (now: number) => {
    if (now - last < minDelta) return false;
    last = now;
    return true;
  };
}
