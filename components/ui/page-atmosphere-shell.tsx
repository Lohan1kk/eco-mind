"use client";

import type { ReactNode } from "react";
import { SectionAtmosphere } from "@/components/ui/section-atmosphere";
import { VerdantWash } from "@/components/ui/verdant-accent";

/** Page shell with atmosphere (+ optional Verdant wash) behind content. */
export function PageAtmosphereShell({
  children,
  variant = "soft",
  wash,
  className = "",
}: {
  children: ReactNode;
  variant?: "mist" | "soft" | "deep";
  /** Optional full-bleed Verdant wash (light for quiz/baixar, dark for forest pages) */
  wash?: "light" | "dark";
  className?: string;
}) {
  return (
    <main className={`relative min-h-screen overflow-hidden ${className}`}>
      <SectionAtmosphere variant={variant} />
      {wash ? <VerdantWash tone={wash} speed={0.36} /> : null}
      <div className="relative z-[1]">{children}</div>
    </main>
  );
}
