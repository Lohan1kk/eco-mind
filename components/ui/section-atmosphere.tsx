"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
import { usePerfProfile } from "@/components/hooks/usePerfProfile";

type Variant = "mist" | "soft" | "deep";

/**
 * Lightweight CSS atmosphere for content sections.
 * No WebGL — safe to mount on every home section without freezing the page.
 */
export function SectionAtmosphere({
  variant = "soft",
  className = "",
}: {
  variant?: Variant;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const perf = usePerfProfile();
  const rootRef = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(true);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => setOn(entry.isIntersecting),
      { threshold: 0.05 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  const paused = reduce || !on || perf.tier === "low";

  return (
    <div
      ref={rootRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <div
        className={`section-atmosphere section-atmosphere--${variant} ${
          paused ? "is-paused" : ""
        }`}
      />
      {perf.atmosphereGrain ? (
        <div
          className={`section-atmosphere-grain ${paused ? "is-paused" : ""}`}
        />
      ) : null}
    </div>
  );
}

/** Convenience wrapper: relative section shell with atmosphere behind children */
export function WithAtmosphere({
  variant = "soft",
  className = "",
  children,
}: {
  variant?: Variant;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <SectionAtmosphere variant={variant} />
      <div className="relative z-[1]">{children}</div>
    </div>
  );
}
