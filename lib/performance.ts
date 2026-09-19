/**
 * Adaptive visual quality for EcoMind.
 * Shaders stay on; only DPR/FPS/smoke/map budgets dial down.
 */

export type PerfTier = "high" | "medium" | "low";

export type PerfProfile = {
  tier: PerfTier;
  smokeCursor: boolean;
  smokeMaxParticles: number;
  smokeSpawnDesktop: number;
  smokeSpawnTouch: number;
  verdantMaxDpr: number;
  verdantTargetFps: number;
  forestMaxDpr: number;
  forestTargetFps: number;
  mapMaxAlerts: number;
  atmosphereGrain: boolean;
};

const HIGH: PerfProfile = {
  tier: "high",
  smokeCursor: true,
  smokeMaxParticles: 220,
  smokeSpawnDesktop: 2,
  smokeSpawnTouch: 3,
  verdantMaxDpr: 1.75,
  verdantTargetFps: 60,
  forestMaxDpr: 1.5,
  forestTargetFps: 60,
  mapMaxAlerts: 320,
  atmosphereGrain: true,
};

const MEDIUM: PerfProfile = {
  tier: "medium",
  smokeCursor: true,
  smokeMaxParticles: 90,
  smokeSpawnDesktop: 1,
  smokeSpawnTouch: 2,
  verdantMaxDpr: 1.25,
  verdantTargetFps: 45,
  forestMaxDpr: 1.25,
  forestTargetFps: 45,
  // Phones land here — keep pins low for smooth pan/zoom
  mapMaxAlerts: 96,
  atmosphereGrain: true,
};

const LOW: PerfProfile = {
  tier: "low",
  smokeCursor: true,
  smokeMaxParticles: 48,
  smokeSpawnDesktop: 1,
  smokeSpawnTouch: 1,
  verdantMaxDpr: 1,
  verdantTargetFps: 30,
  forestMaxDpr: 1,
  forestTargetFps: 30,
  mapMaxAlerts: 64,
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

function detectPerfTier(): PerfTier {
  if (typeof window === "undefined") return "medium";
  if (prefersReducedData()) return "low";

  const nav = navigator as NavigatorWithMemory;
  const cores = nav.hardwareConcurrency || 4;
  const memory = nav.deviceMemory;
  const coarse = isCoarsePointer();

  if (memory !== undefined && memory <= 2) return "low";
  if (cores <= 2) return "low";
  // Touch phones: prefer low map budget over medium
  if (coarse && (memory === undefined || memory <= 4 || cores <= 6)) return "low";
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

/** Frame gate for RAF loops. */
export function createFrameGate(targetFps: number) {
  const minDelta = 1000 / Math.max(1, targetFps);
  let last = 0;
  return (now: number) => {
    if (now - last < minDelta) return false;
    last = now;
    return true;
  };
}
