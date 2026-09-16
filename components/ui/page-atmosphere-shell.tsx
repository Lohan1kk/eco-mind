"use client";

import type { ReactNode } from "react";
import { SectionAtmosphere } from "@/components/ui/section-atmosphere";

/** Page shell with a light CSS atmosphere behind content (quiz, baixar, etc.). */
export function PageAtmosphereShell({
  children,
  variant = "soft",
  className = "",
}: {
  children: ReactNode;
  variant?: "mist" | "soft" | "deep";
  className?: string;
}) {
  return (
    <main className={`relative min-h-screen overflow-hidden ${className}`}>
      <SectionAtmosphere variant={variant} />
      <div className="relative z-[1]">{children}</div>
    </main>
  );
}
