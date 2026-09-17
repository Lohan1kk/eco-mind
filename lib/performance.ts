/**
 * Adaptive visual quality for EcoMind.
 * Keeps the look on capable devices; dials GPU/CPU load down on weaker ones
 * without collapsing to a bare layout.
 */

export type PerfTier = "high" | "medium" | "low";

export type PerfProfile = {
  tier: PerfTier;
  /** Smoke trail cursor overlay */
  smokeCursor: boolean;
  smokeMaxParticles: number;
  smokeSpawnDesktop: number;
  smokeSpawnTouch: number;
  /** Full-bleed WebGL washes (Verdant) — false → CSS silk fallback */
  verdantWebgl: boolean;
  verdantMaxDpr: number;
  verdantTargetFps: number;
  /** Hero forest mist shader */
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
  verdantMaxDpr: 1,
  verdantTargetFps: 30,
  forestWebgl: true,
  forestMaxDpr: 1,
  forestTargetFps: 30,
  heroSrc: "/brand/hero-ecomind-hq.jpg",
  heroQuality: 85,
  heroKenBurns: true,
  mapMaxAlerts: 220,
  atmosphereGrain: true,
};

const LOW: PerfProfile = {
  tier: "low",
  smokeCursor: false,
  smokeMaxParticles: 0,
  smokeSpawnDesktop: 0,
  smokeSpawnTouch: 0,
  verdantWebgl: false,
  verdantMaxDpr: 1,
  verdantTargetFps: 20,
  forestWebgl: false,
  forestMaxDpr: 1,
  forestTargetFps: 20,
  heroSrc: "/brand/hero-ecomind-hq.jpg",
  heroQuality: 80,
  heroKenBurns: false,
  mapMaxAlerts: 120,
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
 * Heuristic device tier. Conservative on phones so mid-range Androids stay smooth.
 */
export function detectPerfTier(): PerfTier {
  if (typeof window === "undefined") return "medium";

  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return "low";
    }
  } catch {
    /* ignore */
  }

  if (prefersReducedData()) return "low";

  const nav = navigator as NavigatorWithMemory;
  const cores = nav.hardwareConcurrency || 4;
  const memory = nav.deviceMemory; // Chrome only; undefined elsewhere
  const coarse = isCoarsePointer();
  const dpr = Math.min(window.devicePixelRatio || 1, 3);
  const smallScreen = Math.min(window.innerWidth, window.innerHeight) < 500;

  // Explicit low signals
  if (memory !== undefined && memory <= 2) return "low";
  if (cores <= 2) return "low";
  if (coarse && memory !== undefined && memory <= 4) return "low";
  if (coarse && cores <= 4 && (smallScreen || dpr >= 2.5)) return "low";

  // Mid phones / modest laptops
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
