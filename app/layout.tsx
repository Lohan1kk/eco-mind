import type { Metadata, Viewport } from "next";
import { Fraunces, Source_Sans_3 } from "next/font/google";
import { AppShell } from "@/components/shell/AppShell";
import "./globals.css";

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const body = Source_Sans_3({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://eco-mind-ashy.vercel.app"),
  title: {
    default: "EcoMind — Consciência ambiental + tecnologia",
    template: "%s · EcoMind",
  },
  description:
    "EcoMind: calculadora de pegada de carbono, quiz ambiental, mapa de queimadas INPE e conscientização sobre desmatamento.",
  appleWebApp: {
    capable: true,
    title: "EcoMind",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: "/brand/icon-ecomind.png",
    apple: "/brand/icon-ecomind.png",
  },
  openGraph: {
    title: "EcoMind — Consciência ambiental + tecnologia",
    description:
      "Plante conhecimento. Cultive consciência. Junte-se à EcoMind.",
    locale: "pt_BR",
    type: "website",
    siteName: "EcoMind",
    images: [
      {
        url: "/brand/hero-forest.jpg",
        width: 1600,
        height: 900,
        alt: "Floresta — EcoMind",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EcoMind",
    description: "Calculadora, quiz e mapa de queimadas com dados do INPE.",
    images: ["/brand/hero-forest.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#1b5e3b",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "EcoMind",
  description:
    "App de conscientização ambiental com calculadora de pegada, quiz e mapa de queimadas.",
  applicationCategory: "EducationalApplication",
  operatingSystem: "Web",
  url: "https://eco-mind-ashy.vercel.app",
  offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${body.variable} h-full`}>
      <head>
        <link rel="preload" as="image" href="/brand/hero-forest.jpg" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full bg-mist font-sans text-ink antialiased">
        <AppShell>
          <div id="conteudo-principal">{children}</div>
        </AppShell>
      </body>
    </html>
  );
}
