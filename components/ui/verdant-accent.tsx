"use client";

import { useEffect, useRef, useState } from "react";
import { VerdantSwirl } from "@/components/ui/verdant-swirl";
import { useLowPowerMode } from "@/hooks/useLowPowerMode";

type VerdantWashProps = {
  /** light = pale mist under ink; dark = muted sage on forest panels */
  tone?: "light" | "dark";
  /** Animation speed (default 0.38 — slow and smooth) */
  speed?: number;
  className?: string;
};

/**
 * Full-bleed rectangular wash behind section content.
 * CSS veil/plate always render; WebGL swirl only on capable desktops.
 */
export function VerdantWash({
  tone = "light",
  speed = 0.38,
  className = "",
}: VerdantWashProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const lowPower = useLowPowerMode();

  useEffect(() => {
    if (lowPower) return;
    const node = rootRef.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "40px", threshold: 0.01 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [lowPower]);

  const isLight = tone === "light";

  return (
    <div
      ref={rootRef}
      aria-hidden
      className={`verdant-wash verdant-wash--${tone} ${className}`}
    >
      {!lowPower && visible ? (
        <VerdantSwirl
          className="verdant-wash__shader"
          speed={speed}
          energy={isLight ? 1.08 : 1.02}
          maxDpr={1}
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
