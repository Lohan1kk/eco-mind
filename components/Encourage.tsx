import Link from "next/link";
import { Reveal } from "./Reveal";

export function Encourage() {
  return (
    <section id="agir" className="section section-botanical">
      <div className="section-inner">
        <div className="panel-soft mx-auto max-w-3xl px-6 py-12 text-center md:px-12 md:py-16">
          <Reveal>
            <p className="eyebrow text-forest-mid">Comece agora</p>
            <h2 className="display mt-4 text-3xl text-forest md:text-5xl">
              Plante conhecimento. Cultive consciência.
            </h2>
            <p className="lede mx-auto mt-5 max-w-xl">
              Você não precisa esperar um app perfeito para agir. Calcule sua
              pegada, aprenda no quiz, acompanhe as queimadas — e leve essa
              conversa adiante.
            </p>
          </Reveal>

          <Reveal delayMs={100}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Link href="/calculadora" className="btn btn-dark">
                Calcular minha pegada
              </Link>
              <Link href="/quiz" className="btn btn-outline">
                Fazer o quiz
              </Link>
              <Link
                href="/baixar"
                className="px-4 py-3 text-sm font-semibold text-forest-mid underline-offset-4 hover:underline"
              >
                Instalar no celular
              </Link>
            </div>
            <p className="mt-8 text-sm text-ash/80">
              Pequenas ações plantadas hoje podem crescer em mudança real.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
