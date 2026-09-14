/** Routes where the mobile bottom tab bar is hidden. */
export const HIDE_BOTTOM_NAV = ["/alerta-queimadas"] as const;

export function hidesBottomNav(pathname: string | null): boolean {
  if (!pathname) return false;
  return HIDE_BOTTOM_NAV.some((p) => pathname.startsWith(p));
}

export function isStandaloneDisplay(): boolean {
  if (typeof window === "undefined") return false;
  const mq = window.matchMedia("(display-mode: standalone)").matches;
  const ios =
    "standalone" in navigator &&
    Boolean((navigator as Navigator & { standalone?: boolean }).standalone);
  return mq || ios;
}

export function isIosDevice(): boolean {
  if (typeof window === "undefined") return false;
  const ua = window.navigator.userAgent;
  const iOS = /iPad|iPhone|iPod/.test(ua);
  const iPadOs =
    navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
  return iOS || iPadOs;
}
