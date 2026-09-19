"use client";

import dynamic from "next/dynamic";

const FireMap = dynamic(() => import("@/components/alerts/FireMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[50vh] items-center justify-center bg-mist-soft text-ash">
      Carregando mapa...
    </div>
  ),
});

export function AlertaQueimadasClient() {
  return (
    <div className="h-full w-full">
      <FireMap />
    </div>
  );
}
