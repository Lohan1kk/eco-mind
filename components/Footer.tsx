import Image from "next/image";
import Link from "next/link";

const links = [
  { href: "/calculadora", label: "Calculadora" },
  { href: "/quiz", label: "Quiz" },
  { href: "/alerta-queimadas", label: "Mapa de queimadas" },
  { href: "/baixar", label: "Baixar app" },
  { href: "/#agir", label: "Começar" },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink py-14 text-mist/85">
      <div className="section-inner flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <div>
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
        </div>

        <nav aria-label="Rodapé">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-sprout">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="section-inner mt-10 border-t border-white/10 pt-6 text-xs text-mist/50">
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
      </div>
    </footer>
  );
}
