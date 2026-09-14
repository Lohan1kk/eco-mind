import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://eco-mind-ashy.vercel.app";
  const routes = [
    "",
    "/calculadora",
    "/quiz",
    "/alerta-queimadas",
    "/baixar",
  ];

  return routes.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "/alerta-queimadas" ? "hourly" : "weekly",
    priority: route === "" ? 1 : 0.8,
  }));
}
