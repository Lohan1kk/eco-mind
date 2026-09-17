"use client";

import { useSyncExternalStore } from "react";
import {
  detectPerfProfile,
  type PerfProfile,
  profileForTier,
} from "@/lib/performance";

const SERVER_PROFILE = profileForTier("medium");

function subscribePerf(onStoreChange: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", onStoreChange);
  window.addEventListener("resize", onStoreChange, { passive: true });
  return () => {
    mq.removeEventListener("change", onStoreChange);
    window.removeEventListener("resize", onStoreChange);
  };
}

/**
 * Client performance profile via useSyncExternalStore (SSR-safe medium default).
 */
export function usePerfProfile(): PerfProfile {
  return useSyncExternalStore(
    subscribePerf,
    detectPerfProfile,
    () => SERVER_PROFILE,
  );
}

function subscribeVisibility(onStoreChange: () => void) {
  document.addEventListener("visibilitychange", onStoreChange);
  return () => document.removeEventListener("visibilitychange", onStoreChange);
}

function getVisibility() {
  return document.visibilityState === "visible";
}

/** Pause heavy work when the tab is hidden. */
export function useDocumentVisible(): boolean {
  return useSyncExternalStore(subscribeVisibility, getVisibility, () => true);
}
