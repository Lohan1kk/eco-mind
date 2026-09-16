import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 text-center">
      <Image
        src="/brand/hero-ecomind-4k.jpg"
        alt=""
        fill
        className="object-cover opacity-25"
        sizes="100vw"
        priority
      />
      <div className="absolute inset-0 bg-mist/85" />
      <div className="relative z-10">
        <Image
          src="/brand/icon-ecomind.png"
          alt=""
          width={64}
          height={64}
          className="mx-auto h-16 w-16 rounded-full"
        />
        <h1 className="mt-5 font-display text-3xl font-semibold text-forest">
          Página não encontrada
        </h1>
        <p className="mx-auto mt-3 max-w-md text-ash">
          Essa trilha não existe na floresta digital. Volte ao início e continue
          explorando a EcoMind.
        </p>
        <Link
          href="/"
          className="btn-primary mt-8 inline-flex rounded-md bg-forest px-6 py-3 text-sm font-semibold text-mist"
        >
          Voltar ao início
        </Link>
      </div>
    </main>
  );
}
