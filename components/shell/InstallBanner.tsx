"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  hidesBottomNav,
  isIosDevice,
  isStandaloneDisplay,
} from "@/lib/pwa";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function readDismissed() {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem("ecomind-install-dismissed") === "1";
}

export function InstallBanner() {
  const pathname = usePathname();
  const hideNav = hidesBottomNav(pathname);
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(
    null,
  );
  const [dismissed, setDismissed] = useState(readDismissed);
  const [installed, setInstalled] = useState(false);
  const [iosHint, setIosHint] = useState(false);

  useEffect(() => {
    setInstalled(isStandaloneDisplay());
    setIosHint(isIosDevice() && !isStandaloneDisplay());

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);

    const onInstalled = () => setInstalled(true);
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  async function install() {
    if (!deferred) return;
    await deferred.prompt();
    const { outcome } = await deferred.userChoice;
    if (outcome === "accepted") setInstalled(true);
    setDeferred(null);
  }

  function dismiss() {
    setDismissed(true);
    sessionStorage.setItem("ecomind-install-dismissed", "1");
  }

  if (installed || dismissed) return null;

  const showAndroid = Boolean(deferred);
  const showIos = !deferred && iosHint;
  if (!showAndroid && !showIos) return null;

  const bottomClass = hideNav
    ? "bottom-[max(1rem,env(safe-area-inset-bottom))]"
    : "bottom-[calc(4.5rem+env(safe-area-inset-bottom))]";

  return (
    <div
      className={`fixed inset-x-0 z-40 mx-4 ${bottomClass} md:bottom-4 md:left-auto md:right-4 md:mx-0 md:max-w-sm`}
    >
      <div className="flex items-start gap-3 rounded-xl border border-forest/15 bg-white/95 p-4 shadow-lg backdrop-blur-md">
        <div className="flex-1">
          <p className="text-sm font-semibold text-forest">
            {showAndroid ? "Instalar EcoMind" : "Adicionar à Tela de Início"}
          </p>
          <p className="mt-0.5 text-xs leading-relaxed text-ash">
            {showAndroid
              ? "Acesso rápido na tela inicial do aparelho."
              : "No iPhone: Safari → Compartilhar → Adicionar à Tela de Início."}
          </p>
          {showIos ? (
            <Link
              href="/baixar"
              className="mt-2 inline-block text-xs font-semibold text-forest underline-offset-2 hover:underline"
            >
              Ver passo a passo
            </Link>
          ) : null}
        </div>
        {showAndroid ? (
          <button
            type="button"
            onClick={install}
            className="shrink-0 rounded-md bg-forest px-3 py-2 text-xs font-semibold text-mist"
          >
            Instalar
          </button>
        ) : null}
        <button
          type="button"
          onClick={dismiss}
          aria-label="Fechar"
          className="shrink-0 text-ash/60 hover:text-ash"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
