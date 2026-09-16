"use client";

import { useEffect, useRef, useState } from "react";
import { VerdantSwirl } from "@/components/ui/verdant-swirl";

type VerdantWashProps = {
  /** light = pale mist under ink; dark = muted sage on forest panels */
  tone?: "light" | "dark";
  /** Animation speed (default 0.38 — slow and smooth) */
  speed?: number;
  className?: string;
};

/**
 * Full-bleed rectangular wash behind section content.
 * Light tone uses a high-key mist palette (not the dark CTA greens) plus a
 * straight reading plate so headlines and body stay crisp.
 */
export function VerdantWash({
  tone = "light",
  speed = 0.38,
  className = "",
}: VerdantWashProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "160px", threshold: 0.01 },
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
      {visible ? (
        <VerdantSwirl
          className="verdant-wash__shader"
          speed={speed}
          energy={1.02}
          maxDpr={1.2}
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
