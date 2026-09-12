"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const links = [
  { href: "/#problema", label: "O problema" },
  { href: "/#como-funciona", label: "Como funciona" },
  { href: "/calculadora", label: "Calculadora" },
  { href: "/quiz", label: "Quiz" },
  { href: "/alerta-queimadas", label: "Mapa" },
  { href: "/#equipe", label: "Equipe" },
];

interface HeaderProps {
  solid?: boolean;
}

export function Header({ solid = false }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const isSolid = solid || scrolled || open;

  useEffect(() => {
    if (solid) return;
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [solid]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        isSolid
          ? "border-b border-forest/10 bg-mist/95 backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3 md:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/brand/icon-ecomind.png"
            alt=""
            width={40}
            height={40}
            className="h-10 w-10 rounded-full"
            priority
          />
          <span
            className={`font-display text-xl font-semibold tracking-tight transition-colors ${
              isSolid ? "text-forest" : "text-mist"
            }`}
          >
            EcoMind
          </span>
        </Link>

        <nav className="hidden items-center gap-5 xl:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:opacity-80 ${
                isSolid ? "text-ink/80" : "text-mist/90"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/#agir"
            className="rounded-md bg-sprout px-4 py-2 text-sm font-semibold text-forest transition hover:bg-white"
          >
            Começar
          </Link>
        </nav>

        <button
          type="button"
          aria-expanded={open}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          className={`rounded-md px-3 py-2 text-sm font-semibold xl:hidden ${
            isSolid ? "bg-forest/10 text-forest" : "bg-white/15 text-mist"
          }`}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Fechar" : "Menu"}
        </button>
      </div>

      {open ? (
        <nav className="border-t border-forest/10 bg-mist px-5 py-4 xl:hidden">
          <ul className="flex flex-col gap-3">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block py-1 text-base font-medium text-ink"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/#agir"
                className="mt-1 inline-flex rounded-md bg-forest px-4 py-2.5 text-sm font-semibold text-mist"
                onClick={() => setOpen(false)}
              >
                Começar
              </Link>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
