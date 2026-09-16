"use client";

import { useEffect, useRef, useState } from "react";
import { VerdantSwirl } from "@/components/ui/verdant-swirl";

export type VerdantAccentCorner = "tl" | "tr" | "bl" | "br";

type VerdantAccentProps = {
  /** Which corner hosts the decorative swirl orb */
  corner?: VerdantAccentCorner;
  /** light = soft blend on botanical/cream sections; dark = glow on forest panels */
  tone?: "light" | "dark";
  /** Animation speed (default 0.75) */
  speed?: number;
  className?: string;
};

const CORNER_CLASS: Record<VerdantAccentCorner, string> = {
  tl: "verdant-accent--tl",
  tr: "verdant-accent--tr",
  bl: "verdant-accent--bl",
  br: "verdant-accent--br",
};

/**
 * Partial Verdant Swirl motif — same silk shader as the CTA section,
 * clipped to a soft orb so it decorates a corner instead of filling the section.
 * WebGL only mounts while the accent is near the viewport.
 */
export function VerdantAccent({
  corner = "br",
  tone = "light",
  speed = 0.75,
  className = "",
}: VerdantAccentProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "120px", threshold: 0.01 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden
      className={`verdant-accent verdant-accent--${tone} ${CORNER_CLASS[corner]} ${className}`}
    >
      {visible ? <VerdantSwirl speed={speed} opacity={1} /> : null}
    </div>
  );
}
