import Link from "next/link";
import { Reveal } from "./Reveal";

export function Encourage() {
  return (
    <section
      id="agir"
      className="relative overflow-hidden border-t border-forest/10 py-20 md:py-28"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,rgba(184,236,200,0.35),transparent_55%),radial-gradient(ellipse_at_10%_90%,rgba(27,94,59,0.08),transparent_50%)]"
      />

      <div className="relative mx-auto max-w-3xl px-5 text-center md:px-8">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-forest-mid">
            Comece agora
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold leading-tight text-forest md:text-5xl">
            Plante conhecimento. Cultive consciência.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-ash">
            Você não precisa esperar um app perfeito para agir. Calcule sua
            pegada, aprenda no quiz, acompanhe as queimadas — e leve essa
            conversa para a escola e a comunidade.
          </p>
        </Reveal>

        <Reveal delayMs={100}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/calculadora"
              className="btn-primary inline-flex rounded-md bg-forest px-6 py-3.5 text-base font-semibold text-mist"
            >
              Calcular minha pegada
            </Link>
            <Link
              href="/quiz"
              className="btn-secondary"
            >
              Fazer o quiz
            </Link>
            <Link
              href="/baixar"
              className="inline-flex rounded-md px-5 py-3.5 text-base font-semibold text-forest-mid underline-offset-4 hover:underline"
            >
              Instalar no celular
            </Link>
          </div>
          <p className="mt-8 text-sm text-ash/80">
            Pequenas ações plantadas hoje podem crescer em mudança real.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
