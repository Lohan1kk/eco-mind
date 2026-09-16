"use client";

import type { ReactNode } from "react";
import { VerdantSwirl } from "@/components/ui/verdant-swirl";

/** Dark page shell with animated Verdant Swirl background. */
export function VerdantPageShell({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <main
      className={`relative min-h-screen overflow-hidden bg-[#03120E] pt-24 pb-16 ${className}`}
    >
      <VerdantSwirl speed={0.85} />
      <div className="relative z-10">{children}</div>
    </main>
  );
}
