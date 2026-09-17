"use client";

import { useSyncExternalStore } from "react";

/**
 * Detect phones / constrained devices that struggle with stacked WebGL + canvas.
 * Conservative: prefer static CSS over realtime graphics when unsure.
 */
function readLowPower(): boolean {
  if (typeof window === "undefined") return false;

  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return true;
    }

    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const narrow = window.matchMedia("(max-width: 768px)").matches;
    const touchHeavy =
      (navigator.maxTouchPoints ?? 0) > 1 &&
      !window.matchMedia("(pointer: fine)").matches;

    const nav = navigator as Navigator & {
      deviceMemory?: number;
      connection?: { saveData?: boolean; effectiveType?: string };
    };

    if (nav.deviceMemory !== undefined && nav.deviceMemory <= 4) return true;
    if ((navigator.hardwareConcurrency ?? 8) <= 4 && (coarse || narrow)) {
      return true;
    }
    if (nav.connection?.saveData) return true;
    const net = nav.connection?.effectiveType;
    if (net === "slow-2g" || net === "2g") return true;

    // Phones / tablets: skip heavy GPU overlays by default
    if (coarse || touchHeavy || (narrow && (navigator.maxTouchPoints ?? 0) > 0)) {
      return true;
    }
  } catch {
    return true;
  }

  return false;
}

function subscribe(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};

  const mq = [
    window.matchMedia("(prefers-reduced-motion: reduce)"),
    window.matchMedia("(pointer: coarse)"),
    window.matchMedia("(max-width: 768px)"),
  ];

  mq.forEach((m) => {
    m.addEventListener("change", onStoreChange);
  });

  const onVis = () => onStoreChange();
  document.addEventListener("visibilitychange", onVis);

  return () => {
    mq.forEach((m) => m.removeEventListener("change", onStoreChange));
    document.removeEventListener("visibilitychange", onVis);
  };
}

/** True when WebGL / smoke / grain should be skipped for stability. */
export function useLowPowerMode(): boolean {
  return useSyncExternalStore(subscribe, readLowPower, () => false);
}

/** Imperative check for effects that run outside React render. */
export function isLowPowerDevice(): boolean {
  return readLowPower();
}
