"use client";

import { useEffect, useState } from "react";

export function OfflineIndicator() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const sync = () => setOffline(!navigator.onLine);
    sync();
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
    };
  }, []);

  if (!offline) return null;

  return (
    <div
      role="status"
      className="fixed inset-x-0 top-0 z-[60] bg-burn px-4 py-2 pt-[max(0.5rem,env(safe-area-inset-top))] text-center text-xs font-semibold text-mist"
    >
      Você está offline — mapa ao vivo e instalação podem ficar limitados
    </div>
  );
}
