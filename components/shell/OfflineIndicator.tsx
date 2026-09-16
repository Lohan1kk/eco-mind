"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { enterTransition } from "@/components/motion";

export function OfflineIndicator() {
  const [offline, setOffline] = useState(false);
  const reduce = useReducedMotion();

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

  return (
    <AnimatePresence>
      {offline ? (
        <motion.div
          key="offline"
          role="status"
          className="fixed inset-x-0 top-0 z-[60] bg-burn px-4 py-2 pt-[max(0.5rem,env(safe-area-inset-top))] text-center text-xs font-semibold text-mist"
          initial={reduce ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, y: -6 }}
          transition={reduce ? { duration: 0 } : { ...enterTransition, duration: 0.35 }}
        >
          Você está offline — mapa ao vivo e instalação podem ficar limitados
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
