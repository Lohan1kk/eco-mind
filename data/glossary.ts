export type GlossaryTerm = {
  term: string;
  meaning: string;
};

/**
 * Specs and units used across EcoMind — explained in plain Portuguese.
 */
export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    term: "ppm",
    meaning:
      "Partes por milhão. Mede quanto CO₂ há no ar: 426 ppm significa cerca de 426 moléculas de CO₂ a cada 1 milhão de moléculas de ar. Quanto maior o número, mais gás de efeito estufa na atmosfera.",
  },
  {
    term: "CO₂",
    meaning:
      "Dióxido de carbono — gás liberado ao queimar combustíveis, desmatar e em várias atividades humanas. É o principal gás de efeito estufa citado nas mudanças climáticas.",
  },
  {
    term: "CO₂e / kg CO₂eq",
    meaning:
      "CO₂ equivalente. Soma o impacto de vários gases (CO₂, metano etc.) numa única unidade, como se tudo fosse CO₂. A calculadora mostra kg de CO₂e por ano.",
  },
  {
    term: "Pegada de carbono",
    meaning:
      "Estimativa de quanto gás de efeito estufa suas atividades geram (transporte, comida, energia). Não é um exame médico — é um indicador para comparar hábitos e reduzir impacto.",
  },
  {
    term: "°C acima do pré-industrial",
    meaning:
      "Quanto a temperatura média do planeta está acima da média de ~1850–1900. O Acordo de Paris busca limitar o aquecimento a 1,5°C para reduzir riscos extremos.",
  },
  {
    term: "FRP (MW)",
    meaning:
      "Fire Radiative Power — potência do fogo vista do satélite, em megawatts (MW). Valores altos indicam foco mais intenso. No mapa: crítico ≥100, alto ≥40, médio ≥15, baixo abaixo de 15 MW.",
  },
  {
    term: "Foco de queimada",
    meaning:
      "Ponto detectado por satélite com calor anormal, compatível com fogo ativo. Não é sempre um incêndio confirmado no chão — é um alerta espacial para investigar.",
  },
  {
    term: "INPE / Prodes",
    meaning:
      "INPE é o instituto brasileiro que monitora queimadas e floresta. Prodes é o sistema que mede o desmatamento anual da Amazônia.",
  },
  {
    term: "NASA FIRMS",
    meaning:
      "Sistema da NASA que publica focos de fogo ativos no mundo (últimas 24h). No EcoMind, complementa o detalhe do Brasil (INPE) com a visão global.",
  },
  {
    term: "GEE",
    meaning:
      "Gases de efeito estufa — retêm calor na atmosfera (CO₂, metano, óxido nitroso…). Mais GEE → mais aquecimento médio do planeta.",
  },
];
