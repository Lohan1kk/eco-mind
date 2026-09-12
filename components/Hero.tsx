import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section id="topo" className="relative min-h-[100svh] overflow-hidden">
      <Image
        src="/brand/hero-forest.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-[center_30%]"
      />
      <div aria-hidden className="hero-overlay absolute inset-0" />

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col justify-end px-5 pb-16 pt-28 md:px-8 md:pb-24 md:pt-36">
        <div className="max-w-2xl">
          <div className="animate-fade-up mb-8 flex items-center gap-4">
            <Image
              src="/brand/logo-ecomind.png"
              alt="EcoMind"
              width={96}
              height={96}
              className="h-16 w-16 rounded-full md:h-20 md:w-20"
              priority
            />
            <p className="display text-4xl text-mist md:text-6xl">EcoMind</p>
          </div>

          <h1 className="animate-fade-up animate-delay-1 display max-w-xl text-3xl text-mist md:text-5xl">
            Cada decisão é uma semente.
          </h1>

          <p className="animate-fade-up animate-delay-2 mt-5 max-w-lg text-base leading-relaxed text-mist/88 md:text-xl">
            Consciência ambiental + tecnologia para educar, calcular impacto e
            acompanhar queimadas — na escola, em casa e na comunidade.
          </p>

          <div className="animate-fade-up animate-delay-3 mt-9 flex flex-wrap gap-3">
            <Link href="/calculadora" className="btn btn-primary">
              Calcular minha pegada
            </Link>
            <Link href="/alerta-queimadas" className="btn btn-ghost">
              Ver mapa de queimadas
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
