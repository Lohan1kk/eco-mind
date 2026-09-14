import type { MetadataRoute } from "next";

const THEME = "#1b5e3b";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "EcoMind — Consciência ambiental",
    short_name: "EcoMind",
    description:
      "Calculadora de pegada, quiz ambiental e mapa de queimadas com dados do INPE.",
    start_url: "/",
    scope: "/",
    id: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#f7fcf8",
    theme_color: THEME,
    lang: "pt-BR",
    icons: [
      {
        src: "/brand/icon-ecomind.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/brand/icon-ecomind-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Calculadora",
        url: "/calculadora",
        description: "Calcule sua pegada de carbono",
      },
      {
        name: "Mapa de queimadas",
        url: "/alerta-queimadas",
        description: "Focos INPE atualizados",
      },
      {
        name: "Quiz",
        url: "/quiz",
        description: "Teste seu conhecimento",
      },
    ],
  };
}
