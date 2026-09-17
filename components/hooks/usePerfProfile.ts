"use client";

import { useSyncExternalStore } from "react";
import {
  detectPerfProfile,
  type PerfProfile,
  profileForTier,
} from "@/lib/performance";

const SERVER_PROFILE = profileForTier("medium");

/** Detect once per page load — resize must not swap quality mid-session. */
let cachedClientProfile: PerfProfile | null = null;

function getClientProfile(): PerfProfile {
  if (!cachedClientProfile) {
    cachedClientProfile = detectPerfProfile();
  }
  return cachedClientProfile;
}

function subscribePerf(onStoreChange: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  const onMotion = () => {
    cachedClientProfile = detectPerfProfile();
    onStoreChange();
  };
  mq.addEventListener("change", onMotion);
  return () => mq.removeEventListener("change", onMotion);
}

/**
 * Client performance profile via useSyncExternalStore (SSR-safe medium default).
 * Cached after first client read so hero/shaders do not flip on resize.
 */
export function usePerfProfile(): PerfProfile {
  return useSyncExternalStore(
    subscribePerf,
    getClientProfile,
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
