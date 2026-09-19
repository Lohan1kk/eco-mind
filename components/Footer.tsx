import Image from "next/image";
import Link from "next/link";
import { Reveal, StaggerItem, StaggerReveal } from "@/components/motion";
import { SectionAtmosphere } from "@/components/ui/section-atmosphere";

const links = [
  { href: "/calculadora", label: "Calculadora" },
  { href: "/quiz", label: "Quiz" },
  { href: "/alerta-queimadas", label: "Mapa de queimadas" },
  { href: "/#avaliacao", label: "Avaliar" },
  { href: "/baixar", label: "Baixar app" },
  { href: "/#agir", label: "Começar" },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-ink py-14 text-mist/85">
      <SectionAtmosphere variant="deep" />
      <div className="section-inner relative z-[1] flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <Reveal variant="fadeUp">
          <div className="flex items-center gap-2.5">
            <Image
              src="/brand/icon-ecomind.png"
              alt=""
              width={36}
              height={36}
              className="h-9 w-9 object-contain"
            />
            <span className="font-display text-xl font-semibold text-mist">
              EcoMind
            </span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-mist/65">
            Consciência ambiental + tecnologia. Calculadora, quiz, mapa INPE e
            ações concretas para o planeta.
          </p>
        </Reveal>

        <nav aria-label="Rodapé">
          <StaggerReveal
            className="flex flex-wrap gap-x-6 gap-y-2 text-sm"
            staggerChildren={0.06}
            delayChildren={0.12}
          >
            {links.map((link) => (
              <StaggerItem key={link.href} soft>
                <Link href={link.href} className="hover:text-sprout">
                  {link.label}
                </Link>
              </StaggerItem>
            ))}
          </StaggerReveal>
        </nav>
      </div>

      <Reveal
        className="section-inner relative z-[1] mt-10 border-t border-white/10 pt-6 text-xs text-mist/50"
        delayMs={140}
        variant="fade"
      >
        <p>EcoMind · Projeto de alunos · Colégio Paulo de Tarso</p>
        <p className="mt-2">
          Dados:{" "}
          <a
            href="https://queimadas.dgi.inpe.br/"
            className="underline hover:text-sprout"
            target="_blank"
            rel="noopener noreferrer"
          >
            INPE Queimadas
          </a>
        </p>
      </Reveal>
    </footer>
  );
}
