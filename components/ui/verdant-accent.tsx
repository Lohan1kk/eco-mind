"use client";

import { useEffect, useRef, useState } from "react";
import { VerdantSwirl } from "@/components/ui/verdant-swirl";

type VerdantWashProps = {
  /** light = botanical/cream sections; dark = forest panels */
  tone?: "light" | "dark";
  /** Animation speed (default 1.05 — slightly livelier than CTA) */
  speed?: number;
  className?: string;
};

/**
 * Full-bleed rectangular Verdant Swirl wash for section backgrounds.
 * Same silk shader as the final CTA, but lower opacity + a straight-edged
 * readability veil so body copy stays clear while the field stays alive.
 */
export function VerdantWash({
  tone = "light",
  speed = 1.05,
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
          energy={1.4}
          maxDpr={1.35}
          active={visible}
          opacity={1}
        />
      ) : null}
      <div className="verdant-wash__veil" />
    </div>
  );
}

/** @deprecated Use VerdantWash — kept as alias during migration */
export const VerdantAccent = VerdantWash;
