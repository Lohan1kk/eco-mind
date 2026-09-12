export interface ClimateStat {
  value: string;
  label: string;
  trend: "up" | "down";
  source: string;
}

export const CLIMATE_STATS: ClimateStat[] = [
  {
    value: "426 ppm",
    label:
      "Concentração de CO₂ na atmosfera em 2025 — o nível mais alto em pelo menos 800 mil anos.",
    trend: "up",
    source: "NOAA / MCTI, 2025",
  },
  {
    value: "1,55°C",
    label:
      "Foi quanto 2024 ficou acima da era pré-industrial — o primeiro ano a superar o limite do Acordo de Paris.",
    trend: "up",
    source: "OMM / Copernicus, jan. 2025",
  },
  {
    value: "11,1%",
    label:
      "Foi a queda no desmatamento da Amazônia entre 2024 e 2025 — o menor índice desde 2014.",
    trend: "down",
    source: "INPE / Prodes, 2025",
  },
  {
    value: "8 mi t",
    label:
      "Toneladas de plástico despejadas nos oceanos todos os anos — um caminhão de lixo por minuto.",
    trend: "up",
    source: "PNUMA / National Geographic",
  },
];
