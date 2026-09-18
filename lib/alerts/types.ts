export type AlertLevel = "critico" | "alto" | "medio" | "baixo";

export type AlertSource = "seed" | "user" | "inpe" | "nasa";

export interface FireAlert {
  id: string;
  lat: number;
  lng: number;
  level: AlertLevel;
  description?: string;
  reportedAt: string;
  source: AlertSource;
  satelite?: string;
  municipio?: string;
  estado?: string;
  bioma?: string;
  frp?: number;
}
