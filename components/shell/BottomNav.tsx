"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/", label: "Início" },
  { href: "/calculadora", label: "Pegada" },
  { href: "/alerta-queimadas", label: "Mapa" },
  { href: "/quiz", label: "Quiz" },
  { href: "/baixar", label: "Baixar" },
];

/** Full-screen map uses its own chrome; hide tab bar there. */
const HIDE_ON = ["/alerta-queimadas"];

export function BottomNav() {
  const pathname = usePathname();

  if (HIDE_ON.some((p) => pathname.startsWith(p))) return null;

  return (
    <nav
      aria-label="Navegação principal"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-forest/10 bg-mist/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden"
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-around">
        {NAV.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                className={`flex flex-col items-center gap-1 px-1 py-2.5 text-[10px] font-semibold uppercase tracking-wide transition ${
                  active
                    ? "text-forest"
                    : "text-ash/70 hover:text-forest"
                }`}
              >
                <span
                  className={`h-1 w-5 rounded-full transition ${
                    active ? "bg-forest" : "bg-transparent"
                  }`}
                  aria-hidden
                />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
