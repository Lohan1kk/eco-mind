import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section
      id="topo"
      className="relative flex min-h-[100svh] items-end overflow-hidden"
    >
      <Image
        src="/brand/hero-forest.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-[rgba(20,38,28,0.88)] via-[rgba(27,94,59,0.58)] to-[rgba(61,52,41,0.42)]"
      />
      <div
        aria-hidden
        className="hero-grain pointer-events-none absolute inset-0 opacity-25"
      />
      <div
        aria-hidden
        className="absolute inset-0 animate-fade-in bg-[radial-gradient(ellipse_at_28%_18%,rgba(184,236,200,0.16),transparent_52%)]"
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-20 pt-28 md:px-8 md:pb-28 md:pt-36">
        <div className="max-w-2xl">
          <div className="animate-fade-up mb-5 flex items-center gap-4 md:mb-7">
            <Image
              src="/brand/logo-ecomind.png"
              alt="EcoMind"
              width={512}
              height={512}
              className="h-16 w-16 rounded-full ring-1 ring-sprout/35 md:h-24 md:w-24"
              priority
            />
            <p className="font-display text-4xl font-semibold leading-none tracking-tight text-mist sm:text-5xl md:text-7xl">
              EcoMind
            </p>
          </div>

          <h1 className="animate-fade-up animate-delay-1 max-w-xl font-display text-2xl font-medium leading-snug text-sprout sm:text-3xl md:text-4xl">
            Cada decisão é uma{" "}
            <em className="not-italic text-mist">semente</em>.
          </h1>

          <p className="animate-fade-up animate-delay-2 mt-5 max-w-lg text-base leading-relaxed text-mist/90 md:text-xl">
            Consciência ambiental + tecnologia: pegada de carbono, quiz e mapa
            de queimadas — para agir na escola, em casa e na comunidade.
          </p>

          <div className="animate-fade-up animate-delay-3 mt-8 flex flex-wrap items-center gap-3 md:mt-10">
            <Link
              href="/calculadora"
              className="btn-primary inline-flex rounded-md bg-sprout px-5 py-3 text-base font-semibold text-forest md:px-6 md:py-3.5"
            >
              Calcular minha pegada
            </Link>
            <Link
              href="/alerta-queimadas"
              className="inline-flex rounded-md border border-mist/40 px-5 py-3 text-base font-medium text-mist transition hover:border-mist/70 hover:bg-white/10 md:px-6 md:py-3.5"
            >
              Ver mapa de queimadas
            </Link>
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-mist/45 md:flex"
        aria-hidden
      >
        <span className="text-[10px] uppercase tracking-[0.22em]">
          role para explorar
        </span>
        <div className="scroll-cue h-8 w-px bg-mist/35" />
      </div>
    </section>
  );
}
