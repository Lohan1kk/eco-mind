"use client";

import { CloudFog } from "lucide-react";
import { SmokeCard } from "@/components/ui/smoke-card";

/** Compact demo / embed for the EcoMind problem section. */
export function SmokeCardDemo() {
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex items-center gap-2 text-sprout/90">
        <CloudFog className="h-4 w-4" aria-hidden strokeWidth={1.75} />
        <p className="text-xs font-semibold uppercase tracking-[0.18em]">
          Névoa da floresta
        </p>
      </div>
      <SmokeCard className="aspect-square w-full max-w-sm sm:max-w-none" />
      <p className="max-w-xs text-sm leading-relaxed text-mist/65">
        Passe o cursor — a névoa responde. Um lembrete visual de que o ar da
        floresta também está em jogo.
      </p>
    </div>
  );
}
