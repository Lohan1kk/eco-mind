"use client";

import { useEffect } from "react";
import { BottomNav } from "./BottomNav";
import { InstallBanner } from "./InstallBanner";
import { OfflineIndicator } from "./OfflineIndicator";

export function AppShell({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  return (
    <>
      <OfflineIndicator />
      <a
        href="#conteudo-principal"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-forest focus:px-4 focus:py-2 focus:text-mist"
      >
        Pular para o conteúdo
      </a>
      <div className="pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:pb-0">
        {children}
      </div>
      <BottomNav />
      <InstallBanner />
    </>
  );
}
