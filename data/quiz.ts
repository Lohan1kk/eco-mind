export interface QuizQuestion {
  id: number;
  q: string;
  options: string[];
  correct: number;
  feedback: string;
}

/**
 * Perguntas alinhadas aos textos e dados exibidos no site EcoMind
 * (Problem, Idea, HowItWorks, Tools, climate-stats, mapa INPE).
 */
export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    q: "Segundo a EcoMind, qual é o problema central que o projeto aborda?",
    options: [
      "Só o preço da energia elétrica",
      "Desmatamento e queimadas — e a sensação de impotência sem um próximo passo",
      "Apenas o trânsito nas grandes cidades",
      "Somente o desperdício de comida em restaurantes",
    ],
    correct: 1,
    feedback:
      "No site, o problema é claro: florestas desaparecem com desmatamento e queimadas, e as notícias sem caminho geram impotência. A EcoMind quer ser a ponte entre preocupação e ação.",
  },
  {
    id: 2,
    q: "Qual é a metáfora da marca EcoMind apresentada no site?",
    options: [
      "O rio que nunca seca",
      "A semente que vira broto",
      "O sol que nunca se põe",
      "A montanha inabalável",
    ],
    correct: 1,
    feedback:
      "A ideia da EcoMind é “a semente que vira broto”: pequenas ações plantadas hoje podem crescer em mudança real — na escola, em casa e na comunidade.",
  },
  {
    id: 3,
    q: "Qual é a sequência de passos que a EcoMind propõe em “Como funciona”?",
    options: [
      "Comprar → Usar → Descartar",
      "Educar → Praticar → Agir",
      "Denunciar → Multar → Esquecer",
      "Ler → Curtir → Compartilhar só",
    ],
    correct: 1,
    feedback:
      "O fluxo do site é Educar (causas e efeitos), Praticar (calculadora, quiz e mapa) e Agir (hábitos na escola, em casa e na comunidade).",
  },
  {
    id: 4,
    q: "Quais são as três ferramentas principais oferecidas no site?",
    options: [
      "E-mail, chat e planilha",
      "Calculadora de pegada, quiz ambiental e mapa de queimadas",
      "Só um blog de notícias",
      "Jogo de tabuleiro, podcast e revista impressa",
    ],
    correct: 1,
    feedback:
      "As ferramentas são: Calculadora (transporte, alimentação e energia), Quiz (clima, Amazônia e impacto) e Mapa de queimadas com dados de satélite.",
  },
  {
    id: 5,
    q: "De onde vêm os focos do mapa de queimadas destacados no site?",
    options: [
      "Apenas fotos de redes sociais",
      "Dados de satélite do INPE (e complementarmente NASA FIRMS)",
      "Sorteios aleatórios sem fonte",
      "Somente denúncias anônimas por telefone",
    ],
    correct: 1,
    feedback:
      "O mapa usa focos reais de satélite — no Brasil, com dados do INPE (Programa Queimadas), quase em tempo real.",
  },
  {
    id: 6,
    q: "Qual era a concentração aproximada de CO₂ na atmosfera em 2025, segundo os dados do site?",
    options: ["280 ppm", "350 ppm", "426 ppm", "600 ppm"],
    correct: 2,
    feedback:
      "O site traz 426 ppm em 2025 — o nível mais alto em pelo menos 800 mil anos (NOAA / MCTI).",
  },
  {
    id: 7,
    q: "Quanto 2024 ficou acima da temperatura média da era pré-industrial, segundo o site?",
    options: ["0,5°C", "1,0°C", "1,55°C", "3,0°C"],
    correct: 2,
    feedback:
      "2024 ficou 1,55°C acima do período pré-industrial — o primeiro ano a superar o limite do Acordo de Paris (OMM / Copernicus).",
  },
  {
    id: 8,
    q: "O que o site destaca sobre o desmatamento da Amazônia entre 2024 e 2025?",
    options: [
      "Aumentou 30%",
      "Caiu 11,1% — o menor índice desde 2014",
      "Ficou estável",
      "Dobrou de tamanho",
    ],
    correct: 1,
    feedback:
      "Houve queda de 11,1% no desmatamento — o menor índice desde 2014 (INPE / Prodes). É um exemplo de que política pública e ação fazem diferença.",
  },
  {
    id: 9,
    q: "Quantas toneladas de plástico vão parar nos oceanos por ano, segundo o dado exibido no site?",
    options: [
      "800 mil toneladas",
      "2 milhões de toneladas",
      "8 milhões de toneladas",
      "50 milhões de toneladas",
    ],
    correct: 2,
    feedback:
      "Cerca de 8 milhões de toneladas por ano — o equivalente a um caminhão de lixo por minuto (PNUMA / National Geographic).",
  },
  {
    id: 10,
    q: "Na calculadora da EcoMind, qual hábito costuma gerar o maior corte individual de CO₂?",
    options: [
      "Trocar o carro por transporte público, bike ou caminhada",
      "Desligar o carregador do celular",
      "Usar sacola retornável 1x por mês",
      "Reduzir 1 banho por ano",
    ],
    correct: 0,
    feedback:
      "Entre os hábitos do dia a dia da calculadora, trocar o carro por transporte público, bike ou caminhada costuma ter o maior impacto individual.",
  },
];
