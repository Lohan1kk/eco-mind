export interface FolkloreQuestion {
  id: number;
  character: string;
  image: string;
  q: string;
  options: string[];
  correct: number;
  feedback: string;
}

/**
 * Gincana do Folclore — personagens ligados à proteção da natureza.
 * Imagens em /public/folclore/
 */
export const FOLKLORE_QUESTIONS: FolkloreQuestion[] = [
  {
    id: 1,
    character: "Curupira",
    image: "/folclore/curupira.jpg",
    q: "Quem é o guardião da floresta com cabelos de fogo e pés virados para trás?",
    options: ["Saci-Pererê", "Curupira", "Boitatá", "Boto-cor-de-rosa"],
    correct: 1,
    feedback:
      "O Curupira protege a mata e confunde quem destrói a floresta. Na EcoMind, ele lembra: cuidar da floresta é agir agora.",
  },
  {
    id: 2,
    character: "Caipora",
    image: "/folclore/caipora.jpg",
    q: "Qual figura do folclore protege os animais da floresta contra a caça predatória?",
    options: ["Iara", "Mula sem cabeça", "Caipora", "Lobisomem"],
    correct: 2,
    feedback:
      "A Caipora cuida dos bichos da mata. Proteger a biodiversidade é parte do mesmo cuidado com o planeta.",
  },
  {
    id: 3,
    character: "Boitatá",
    image: "/folclore/boitata.jpg",
    q: "Qual ser folclórico aparece como uma serpente de fogo ligada às queimadas na mata?",
    options: ["Boitatá", "Saci-Pererê", "Curupira", "Iara"],
    correct: 0,
    feedback:
      "O Boitatá é a serpente de fogo do folclore. No site, o mapa de queimadas mostra que o fogo na mata é um alerta real — e dá para agir.",
  },
  {
    id: 4,
    character: "Iara",
    image: "/folclore/iara.jpg",
    q: "Qual personagem do folclore está ligada aos rios e à água?",
    options: ["Caipora", "Curupira", "Saci-Pererê", "Iara"],
    correct: 3,
    feedback:
      "A Iara habita os rios. Cuidar da água — contra poluição e desperdício — também é consciência ambiental.",
  },
  {
    id: 5,
    character: "Saci-Pererê",
    image: "/folclore/saci.jpg",
    q: "Qual travesso de uma perna só vive pela mata com seu gorro vermelho?",
    options: ["Boto-cor-de-rosa", "Saci-Pererê", "Boitatá", "Caipora"],
    correct: 1,
    feedback:
      "O Saci habita a floresta viva. Respeitar a mata — e não destruí-la — é o espírito da EcoMind.",
  },
  {
    id: 6,
    character: "Boto-cor-de-rosa",
    image: "/folclore/boto.jpg",
    q: "Qual ser encantado dos rios amazônicos aparece como um golfinho cor-de-rosa?",
    options: ["Iara", "Curupira", "Boto-cor-de-rosa", "Boitatá"],
    correct: 2,
    feedback:
      "O boto-cor-de-rosa vive nos rios da Amazônia. Preservar rios e biodiversidade aquática é proteger o bioma inteiro.",
  },
];
