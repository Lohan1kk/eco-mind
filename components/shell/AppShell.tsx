"use client";

import { usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { SmokeCursor } from "@/components/ui/smoke-cursor";
import { hidesBottomNav } from "@/lib/pwa";
import { BottomNav } from "./BottomNav";
import { InstallBanner } from "./InstallBanner";
import { OfflineIndicator } from "./OfflineIndicator";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hideNav = hidesBottomNav(pathname);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  return (
    <>
      <SmokeCursor />
      <OfflineIndicator />
      <a
        href="#conteudo-principal"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-[max(1rem,env(safe-area-inset-top))] focus:z-[100] focus:rounded-md focus:bg-forest focus:px-4 focus:py-2 focus:text-mist"
      >
        Pular para o conteúdo
      </a>
      <div
        className={
          hideNav
            ? undefined
            : "pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:pb-0"
        }
      >
        {children}
      </div>
      <BottomNav />
      <InstallBanner />
    </>
  );
}
