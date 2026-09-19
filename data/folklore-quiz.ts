export interface FolkloreQuestion {
  id: number;
  character: string;
  image: string;
  q: string;
  options: string[];
  correct: number;
  feedback: string;
  /** Short tip shown after a wrong answer */
  hint?: string;
}

/**
 * Gincana do Folclore — personagens ligados à proteção da natureza.
 * Perguntas focam em lore + laço ambiental (sem vazar o nome na UI).
 * Imagens em /public/folclore/
 */
export const FOLKLORE_QUESTIONS: FolkloreQuestion[] = [
  {
    id: 1,
    character: "Curupira",
    image: "/folclore/curupira.jpg",
    q: "Qual guardião da mata confunde quem destrói a floresta deixando pegadas viradas para trás?",
    options: ["Caipora", "Curupira", "Saci-Pererê", "Boitatá"],
    correct: 1,
    feedback:
      "O Curupira protege a mata e despista quem a destrói. Na EcoMind, ele lembra: cuidar da floresta é agir agora.",
    hint: "Pense em cabelos de fogo e pés ao contrário — não é o protetor dos animais.",
  },
  {
    id: 2,
    character: "Caipora",
    image: "/folclore/caipora.jpg",
    q: "Qual figura do folclore defende os animais da floresta contra a caça predatória?",
    options: ["Curupira", "Iara", "Caipora", "Boto-cor-de-rosa"],
    correct: 2,
    feedback:
      "A Caipora cuida dos bichos da mata. Proteger a biodiversidade é parte do mesmo cuidado com o planeta.",
    hint: "É a guardiã dos bichos — próxima do Curupira, mas com foco nos animais.",
  },
  {
    id: 3,
    character: "Boitatá",
    image: "/folclore/boitata.jpg",
    q: "Qual ser aparece como serpente de fogo e no folclore se liga às queimadas na mata?",
    options: ["Boitatá", "Saci-Pererê", "Curupira", "Iara"],
    correct: 0,
    feedback:
      "O Boitatá é a serpente de fogo. No site, o mapa de queimadas mostra que o fogo na mata é um alerta real — e dá para agir.",
    hint: "Não é o menino de uma perna: pense em fogo + serpente.",
  },
  {
    id: 4,
    character: "Iara",
    image: "/folclore/iara.jpg",
    q: "Qual personagem encantada dos rios lembra que cuidar da água é também consciência ambiental?",
    options: ["Boto-cor-de-rosa", "Caipora", "Iara", "Curupira"],
    correct: 2,
    feedback:
      "A Iara habita os rios. Cuidar da água — contra poluição e desperdício — também é consciência ambiental.",
    hint: "É uma figura humana dos rios, não o golfinho cor-de-rosa.",
  },
  {
    id: 5,
    character: "Saci-Pererê",
    image: "/folclore/saci.jpg",
    q: "Qual travesso de uma perna só e gorro vermelho habita a mata viva — e lembra a respeitar a floresta?",
    options: ["Boto-cor-de-rosa", "Saci-Pererê", "Boitatá", "Caipora"],
    correct: 1,
    feedback:
      "O Saci habita a floresta viva. Respeitar a mata — e não destruí-la — é o espírito da EcoMind.",
    hint: "Um redemoinho, um gorro vermelho e uma perna só.",
  },
  {
    id: 6,
    character: "Boto-cor-de-rosa",
    image: "/folclore/boto.jpg",
    q: "Qual ser encantado dos rios amazônicos aparece como golfinho e reforça preservar a vida aquática?",
    options: ["Iara", "Curupira", "Boto-cor-de-rosa", "Boitatá"],
    correct: 2,
    feedback:
      "O boto-cor-de-rosa vive nos rios da Amazônia. Preservar rios e biodiversidade aquática é proteger o bioma inteiro.",
    hint: "Não é a sereia dos rios — é o mamífero cor-de-rosa da Amazônia.",
  },
];

/** Fisher–Yates shuffle (mutates a copy). */
function shuffleArray<T>(items: T[]): T[] {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

export type ShuffledFolkloreQuestion = FolkloreQuestion & {
  /** Indices map into the shuffled options array */
  correct: number;
};

/** Fresh deck: shuffled questions + shuffled options (correct index remapped). */
export function buildFolkloreDeck(
  source: FolkloreQuestion[] = FOLKLORE_QUESTIONS,
): ShuffledFolkloreQuestion[] {
  return shuffleArray(source).map((q) => {
    const indexed = q.options.map((label, i) => ({ label, i }));
    const shuffled = shuffleArray(indexed);
    return {
      ...q,
      options: shuffled.map((o) => o.label),
      correct: shuffled.findIndex((o) => o.i === q.correct),
    };
  });
}
