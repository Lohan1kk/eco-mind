"use client";

import { useEffect, useRef, useState } from "react";
import { VerdantSwirl } from "@/components/ui/verdant-swirl";
import { usePerfProfile } from "@/components/hooks/usePerfProfile";

type VerdantWashProps = {
  /** light = pale mist under ink; dark = muted sage on forest panels */
  tone?: "light" | "dark";
  /** Animation speed (default 0.38 — slow and smooth) */
  speed?: number;
  className?: string;
};

/**
 * Full-bleed rectangular wash behind section content.
 * Light tone: soft celadon mist (more visible silk, gentle reading plate).
 * Dark tone: muted sage glow — leave as-is when refining light only.
 * Mounts once when near viewport and pauses via `active` (no WebGL remount).
 */
export function VerdantWash({
  tone = "light",
  speed = 0.38,
  className = "",
}: VerdantWashProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);
  const perf = usePerfProfile();

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setNear(true);
        setVisible(entry.isIntersecting);
      },
      { rootMargin: "120px", threshold: 0.01 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  const isLight = tone === "light";

  return (
    <div
      ref={rootRef}
      aria-hidden
      className={`verdant-wash verdant-wash--${tone} ${className}`}
    >
      {near ? (
        <VerdantSwirl
          className="verdant-wash__shader"
          speed={speed}
          energy={isLight ? 1.08 : 1.02}
          maxDpr={perf.verdantMaxDpr}
          active={visible}
          opacity={1}
          palette={isLight ? "mist" : "glow"}
        />
      ) : null}
      <div className="verdant-wash__veil" />
      <div className="verdant-wash__plate" />
    </div>
  );
}

/** @deprecated Use VerdantWash — kept as alias during migration */
export const VerdantAccent = VerdantWash;
