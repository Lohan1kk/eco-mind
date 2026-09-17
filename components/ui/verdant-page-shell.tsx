"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { VerdantSwirl } from "@/components/ui/verdant-swirl";

/** Dark page shell with animated Verdant Swirl background. */
export function VerdantPageShell({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const rootRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(true);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { threshold: 0.02 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <main
      ref={rootRef}
      className={`relative min-h-screen overflow-hidden bg-[#03120E] pt-24 pb-16 ${className}`}
    >
      <VerdantSwirl speed={0.85} active={active} maxDpr={1.25} />
      <div className="relative z-10">{children}</div>
    </main>
  );
}
