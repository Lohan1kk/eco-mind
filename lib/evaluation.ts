export type Evaluation = {
  id: string;
  rating: number;
  name: string;
  comment: string;
  createdAt: string;
  updatedAt: string;
};

const STORAGE_KEY = "ecomind-avaliacao";

function isEvaluation(value: unknown): value is Evaluation {
  if (!value || typeof value !== "object") return false;
  const e = value as Evaluation;
  return (
    typeof e.id === "string" &&
    typeof e.rating === "number" &&
    e.rating >= 1 &&
    e.rating <= 5 &&
    typeof e.name === "string" &&
    typeof e.comment === "string" &&
    typeof e.createdAt === "string" &&
    typeof e.updatedAt === "string"
  );
}

export function readEvaluation(): Evaluation | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    return isEvaluation(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function saveEvaluation(input: {
  rating: number;
  name?: string;
  comment?: string;
}): Evaluation {
  if (typeof window === "undefined") {
    throw new Error("localStorage indisponível.");
  }
  const rating = Math.min(5, Math.max(1, Math.round(input.rating)));
  const existing = readEvaluation();
  const now = new Date().toISOString();
  const next: Evaluation = {
    id: existing?.id ?? `eval-${crypto.randomUUID()}`,
    rating,
    name: (input.name ?? "").trim().slice(0, 80),
    comment: (input.comment ?? "").trim().slice(0, 600),
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function clearEvaluation(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}
