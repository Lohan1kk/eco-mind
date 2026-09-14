/** Conteúdo da documentação ExpoPT 2026 — EcoMind (2º ano TDS). */

export const DOC_META = {
  school: "Colégio Paulo de Tarso",
  event: "ExpoPT — Manual de orientação às equipes",
  course: "Ensino Médio Técnico — 1º e 2º ano",
  yearLabel: "1º e 2º Ano do Ensino Médio - Técnico em Desenvolvimento de Sistemas │ 2026",
  grade: "2º Ano — Técnico em Desenvolvimento de Sistemas",
  year: 2026,
  projectName: "EcoMind",
  tagline: "Consciência ambiental + tecnologia",
  theme:
    "Voluntariado para o Meio Ambiente: tecnologia e ação em defesa da Vida Terrestre",
  ods: "ODS 15 — Vida Terrestre",
  centralQuestion:
    "Como o voluntariado, aliado à tecnologia, pode ajudar a proteger a Vida Terrestre?",
  deliveryDate: "18 de setembro de 2026",
  siteUrl: "https://eco-mind-ashy.vercel.app",
} as const;

export const TEAM = [
  { name: "Ana Flávia", role: "CEO / Design" },
  { name: "Lucas Lohan", role: "CTO / UX-UI" },
  { name: "André Zauli", role: "Tecnologia / Programação" },
  { name: "Gabriel Rosa", role: "Marketing / Conteúdo" },
] as const;

export const TOC = [
  { id: "capa", label: "Capa e identificação" },
  { id: "proposta", label: "Proposta central" },
  { id: "pesquisa", label: "1. Pesquisa e fundamentação" },
  { id: "anexo", label: "Anexo — Roteiro do tema" },
  { id: "ludica", label: "2. Atividade lúdica / interativa" },
  { id: "projeto", label: "3. Desenvolvimento do projeto" },
  { id: "apresentacao", label: "5. Apresentação" },
  { id: "desafio", label: "Desafio aos visitantes" },
] as const;

export const CENTRAL_PROPOSAL = {
  question: DOC_META.centralQuestion,
  answer:
    "A EcoMind responde a essa pergunta reunindo educação ambiental, engajamento voluntário e ferramentas digitais: o visitante compreende o problema das queimadas e do desmatamento, experimenta um quiz e um mapa com dados reais e encontra caminhos concretos para agir na escola, em casa e na comunidade.",
  problemFocus:
    "Desmatamento e queimadas — e a sensação de impotência que impede a participação voluntária.",
} as const;

export const RESEARCH = {
  introduction: {
    title: "1. Introdução",
    paragraphs: [
      "Esta pesquisa apresenta o tema escolhido pelo grupo EcoMind para a ExpoPT 2026: o voluntariado ambiental aliado à tecnologia, com foco na ODS 15 — Vida Terrestre. O problema investigado é o desmatamento e as queimadas, fenômenos que destroem habitats, reduzem a biodiversidade e enfraquecem ecossistemas terrestres essenciais à vida.",
      "No cotidiano escolar e nas redes sociais, é comum acompanhar notícias de florestas devastadas e animais sem abrigo. Ao mesmo tempo, muitas pessoas se sentem distantes da solução: preocupam-se, mas não sabem por onde começar a ajudar. Essa lacuna entre preocupação e ação concreta justifica a escolha do assunto.",
      "Como estudantes do Curso Técnico em Desenvolvimento de Sistemas, partimos da hipótese de que a tecnologia pode servir de ponte — educando, organizando voluntários e tornando visíveis dados e oportunidades de participação. A EcoMind nasce dessa hipótese: um projeto digital que educa sobre causas e efeitos do desmatamento e das queimadas e convida a comunidade a agir.",
    ],
  },
  development: {
    title: "2. Desenvolvimento",
    sections: [
      {
        heading: "2.1 O problema ambiental: desmatamento e queimadas",
        paragraphs: [
          "O desmatamento consiste na remoção da cobertura vegetal nativa, muitas vezes para expansão agropecuária, especulação fundiária ou exploração irregular de madeira. As queimadas — intencionais ou decorrentes de negligência — aceleram a perda de floresta, liberam grandes volumes de gases de efeito estufa e degradam o solo.",
          "No Brasil, o monitoramento satelital realizado por instituições como o Instituto Nacional de Pesquisas Espaciais (INPE) torna possível acompanhar focos de calor e tendências de desmatamento. Esses dados mostram que o problema não é abstrato: afeta biomas como Amazônia, Cerrado e Mata Atlântica, com impactos locais e globais.",
          "Para a comunidade escolar, o desafio não é apenas “saber que existe fogo na floresta”, mas compreender causas, consequências e o papel de cada pessoa — inclusive como voluntária — na prevenção, na denúncia responsável e na educação ambiental.",
        ],
      },
      {
        heading: "2.2 Causas e consequências",
        paragraphs: [
          "Entre as causas recorrentes estão o uso do fogo para limpeza de pastagens, o desmatamento ilegal, a ocupação irregular de áreas sensíveis, a falta de fiscalização em regiões remotas e a baixa percepção de risco em períodos de seca. Fatores climáticos (estiagem prolongada, ventos) potencializam a propagação do fogo.",
          "As consequências incluem perda de biodiversidade, fragmentação de habitats, ameaça a espécies da fauna e da flora, poluição do ar (com efeitos à saúde humana), emissão de carbono, empobrecimento do solo e maior vulnerabilidade a novos incêndios. Comunidades próximas sofrem com fumaça, prejuízos econômicos e insegurança ambiental.",
          "Há também uma consequência social: o sentimento de que “nada pode ser feito”. Esse desalento reduz o voluntariado e a pressão cidadã por políticas públicas. Por isso, projetos educativos e tecnológicos que aproximem dados, histórias e ações práticas são estratégicos.",
        ],
      },
      {
        heading: "2.3 Relação com a ODS 15 — Vida Terrestre",
        paragraphs: [
          "A Agenda 2030 da Organização das Nações Unidas define 17 Objetivos de Desenvolvimento Sustentável. A ODS 15 trata da proteção, recuperação e promoção do uso sustentável dos ecossistemas terrestres, do manejo sustentável de florestas, do combate à desertificação e da interrupção da perda de biodiversidade.",
          "Desmatamento e queimadas atacam diretamente as metas da ODS 15: destroem florestas, aceleram a extinção de espécies e degradam terras. Voluntariado e tecnologia, quando bem combinados, contribuem para educação (meta transversal), mobilização comunitária, monitoramento cidadão e divulgação de alternativas de restauração e conservação.",
          "O grupo EcoMind ancora o projeto nessa ODS porque o tema “Vida Terrestre” deixa claro que proteger florestas e fauna não é só agenda ambiental distante — é condição para o equilíbrio do planeta e para a qualidade de vida das próximas gerações.",
        ],
      },
      {
        heading: "2.4 Importância do voluntariado",
        paragraphs: [
          "O voluntariado ambiental amplia a capacidade de resposta da sociedade além do que o Estado e as organizações sozinhas conseguem fazer. Mutirões de plantio, educação em escolas, apoio a brigadas, campanhas de conscientização e acolhimento de denúncias responsáveis dependem de pessoas dispostas a doar tempo e atenção.",
          "Para jovens do ensino médio, o voluntariado também é formação cidadã: desenvolve empatia, trabalho em equipe, comunicação e senso de responsabilidade. Na ExpoPT, o visitante não deve sair apenas informado — deve perceber que pode participar.",
          "A EcoMind trata o voluntariado como eixo, não como detalhe: a tecnologia existe para facilitar o primeiro passo (aprender, testar conhecimentos, ver o mapa, calcular impactos cotidianos) e apontar caminhos de ação na escola e na comunidade.",
        ],
      },
      {
        heading: "2.5 Exemplos de ações voluntárias e iniciativas reais",
        paragraphs: [
          "Iniciativas brasileiras e internacionais mostram caminhos concretos. Programas de monitoramento de queimadas do INPE disponibilizam dados abertos que alimentam reportagens, aplicativos e ações de prevenção. Organizações da sociedade civil promovem plantios, corredores ecológicos e educação ambiental em escolas.",
          "Em escala local, voluntários podem organizar mutirões de limpeza e arborização, campanhas de redução de queimadas urbanas irregulares, oficinas de reciclagem e grupos de estudo sobre biodiversidade. Em escala digital, podem compartilhar informação verificada, apoiar mapeamentos colaborativos e mobilizar colegas para eventos.",
          "O grupo também se inspirou na ideia de “missões” de conscientização: desafios curtos que transformam conhecimento em hábito — por exemplo, reduzir desperdício, acompanhar notícias com fontes confiáveis ou convidar a família a conhecer um parque ou área verde.",
        ],
      },
      {
        heading: "2.6 Como a tecnologia pode contribuir",
        paragraphs: [
          "A tecnologia não substitui o trabalho voluntário presencial, mas multiplica alcance e clareza. Mapas com focos de calor ajudam a visualizar a urgência do problema. Quizzes e calculadoras traduzem ciência em linguagem acessível. Sites e PWAs (Progressive Web Apps) permitem instalar a experiência no celular sem loja de aplicativos.",
          "No curso técnico, aprendemos a transformar requisitos em interfaces, integrar APIs, organizar dados e cuidar da experiência do usuário. Esses conhecimentos foram aplicados na EcoMind: interface educativa, quiz interativo, calculadora de pegada de carbono e mapa de queimadas com dados do INPE.",
          "Assim, a tecnologia deixa de ser “enfeite da feira” e passa a ser instrumento de educação ambiental e de convite ao voluntariado — alinhado à proposta da ExpoPT para o 2º ano do técnico.",
        ],
      },
    ],
  },
  conclusion: {
    title: "3. Conclusão",
    paragraphs: [
      "A pesquisa reforçou três descobertas centrais. Primeiro, desmatamento e queimadas são problemas concretos, mensuráveis e ligados à ODS 15. Segundo, o voluntariado é decisivo para conectar preocupação coletiva a ações locais. Terceiro, a tecnologia — quando projetada com propósito educativo — pode reduzir a distância entre “eu me importo” e “eu sei o que fazer”.",
      "Como grupo, refletimos que não basta denunciar a destruição: é preciso oferecer uma experiência clara, honesta e convidativa. A EcoMind é a nossa proposta de ação: um produto digital desenvolvido por alunos do técnico, apresentado na ExpoPT, que educa, engaja e aponta caminhos de participação.",
      "Propomos que visitantes, colegas e a comunidade escolar usem as ferramentas do projeto, compartilhem o que aprenderam e se envolvam em ações voluntárias reais — plantios, campanhas, educação entre pares e acompanhamento responsável de dados ambientais.",
    ],
  },
  references: [
    {
      text: "INSTITUTO NACIONAL DE PESQUISAS ESPACIAIS (INPE). Programa Queimadas. Disponível em: https://queimadas.dgi.inpe.br/. Acesso em: 2026.",
    },
    {
      text: "ORGANIZAÇÃO DAS NAÇÕES UNIDAS (ONU). Objetivo de Desenvolvimento Sustentável 15 — Vida terrestre. Agenda 2030. Disponível em: https://brasil.un.org/pt-br/sdgs/15. Acesso em: 2026.",
    },
    {
      text: "NAÇÕES UNIDAS. Transformando Nosso Mundo: a Agenda 2030 para o Desenvolvimento Sustentável. 2015.",
    },
    {
      text: "MINISTÉRIO DO MEIO AMBIENTE E MUDANÇA DO CLIMA (Brasil). Políticas e informações sobre florestas, biodiversidade e combate a incêndios. Portal gov.br. Acesso em: 2026.",
    },
    {
      text: "NASA FIRMS. Fire Information for Resource Management System. Disponível em: https://firms.modaps.eosdis.nasa.gov/. Acesso em: 2026.",
    },
    {
      text: "IPCC. Relatórios sobre mudança climática e impactos em ecossistemas terrestres (sínteses públicas). Acesso em: 2026.",
    },
    {
      text: "COLÉGIO PAULO DE TARSO. ExpoPT — Manual de orientação às equipes: Voluntariado para o Meio Ambiente (ODS 15). 2026.",
    },
  ],
} as const;

export const ANNEX = {
  title: "Anexo — Roteiro do tema do grupo",
  theme:
    "Desmatamento e queimadas: voluntariado e tecnologia em defesa da Vida Terrestre (ODS 15).",
  objective:
    "Fazer o visitante da ExpoPT compreender o problema, relacioná-lo à ODS 15 e experimentar ferramentas digitais que incentivam a participação voluntária.",
  audience:
    "Visitantes da ExpoPT (estudantes, famílias, professores e comunidade), com linguagem acessível a diferentes faixas etárias.",
  materials: [
    "Computador ou notebook com acesso à internet",
    "Smartphone(s) para demonstrar a PWA EcoMind",
    "Projetor ou monitor (quando disponível)",
    "QR Code para o site https://eco-mind-ashy.vercel.app",
    "Cartaz ou identificação do grupo EcoMind",
    "Roteiro de apresentação impresso (apoio)",
  ],
  steps: [
    "Acolher o visitante e apresentar o tema em até um minuto (problema + ODS 15).",
    "Mostrar o site EcoMind e explicar a metáfora da semente que vira broto.",
    "Convidar a participar do quiz ambiental.",
    "Demonstrar o mapa de queimadas (dados INPE) e, se houver tempo, a calculadora de pegada de carbono.",
    "Fechar com três ações voluntárias possíveis na escola ou na comunidade.",
    "Responder perguntas e registrar feedbacks rápidos, se desejado.",
  ],
  visitorParticipation:
    "O visitante joga o quiz, explora o mapa, pode instalar o app no celular e conversa com o grupo sobre o que pode fazer como voluntário.",
  expectedResult:
    "Ao sair, o visitante consegue responder: o que descobriu; por que o problema importa; o que pode fazer para ajudar; e como a tecnologia contribui.",
} as const;

export const LUDIC_ACTIVITY = {
  title: "2. Atividade lúdica / interativa",
  name: "Quiz EcoMind — Desafio da consciência ambiental",
  type: "Quiz digital interativo (atividade digital / experiência interativa)",
  relation:
    "As perguntas abordam desmatamento, queimadas, clima e biodiversidade — o mesmo eixo da pesquisa e da ODS 15.",
  educationalGoal:
    "Avaliar e ampliar o conhecimento do visitante de forma leve, com feedback imediato após cada resposta, reforçando a importância de agir.",
  rules: [
    "O visitante acessa o quiz no site ou no app EcoMind (rota /quiz).",
    "Lê cada pergunta e escolhe uma das alternativas.",
    "Recebe feedback educativo explicando a resposta correta com base em dados de fontes confiáveis.",
    "Pode repetir o desafio e convidar outra pessoa do grupo/família a jogar.",
    "Não há premiação obrigatória: o objetivo é aprender e conversar.",
  ],
  preparedByGroup:
    "O quiz foi desenvolvido pelo próprio grupo no projeto EcoMind (conteúdo + interface), utilizando os conhecimentos do curso técnico.",
  linkPath: "/quiz",
} as const;

export const PROJECT_DEV = {
  title: "3. Desenvolvimento do projeto",
  sequence: [
    {
      step: "Problema",
      detail:
        "Poucas pessoas transformam a preocupação com desmatamento e queimadas em participação voluntária concreta.",
    },
    {
      step: "Pesquisa",
      detail:
        "Estudo de causas, consequências, ODS 15, iniciativas reais e papel da tecnologia.",
    },
    {
      step: "Ideia",
      detail:
        "Criar a EcoMind — plataforma digital de educação ambiental e convite à ação.",
    },
    {
      step: "Desenvolvimento",
      detail:
        "Site/PWA com landing, quiz, calculadora de carbono e mapa de queimadas (INPE).",
    },
    {
      step: "Teste",
      detail:
        "Validação das telas, da navegação mobile e da leitura dos dados no mapa.",
    },
    {
      step: "Solução",
      detail:
        "Experiência completa apresentada na ExpoPT, acessível por QR Code e navegador.",
    },
    {
      step: "Apresentação",
      detail:
        "Demonstração ao vivo, quiz com visitantes e explicação técnica e ambiental.",
    },
  ],
  criteriaNotes: [
    "Criatividade na metáfora da marca (semente → broto) e na união de várias ferramentas em um só produto.",
    "Relação teoria–prática: a pesquisa alimenta o conteúdo do site, do quiz e do discurso na feira.",
    "Qualidade da proposta: interface coesa, dados reais e foco em voluntariado + ODS 15.",
    "Uso dos conhecimentos do técnico: frontend, APIs, PWA, organização de componentes e experiência do usuário.",
    "Funcionamento dos recursos: quiz, calculadora e mapa operacionais no ambiente de demonstração.",
    "Participação de todos: design, programação, conteúdo e apresentação divididos entre a equipe.",
  ],
  secondYearExpectations: [
    "Maior autonomia e complexidade técnica em relação ao 1º ano.",
    "Aplicação web completa (não apenas um protótipo isolado de uma tela).",
    "Integração com dados externos (API de focos de queimadas / INPE).",
    "Recursos interativos (quiz, calculadora) e instalação como PWA.",
    "Justificativa técnica explícita das escolhas de stack e arquitetura.",
  ],
  technicalJustification: {
    title: "Justificativa técnica (2º ano)",
    paragraphs: [
      "Escolhemos Next.js (App Router) e React porque permitem construir uma aplicação web moderna com rotas claras, componentes reutilizáveis e bom desempenho — adequados a um produto que precisa funcionar bem em notebooks da feira e em celulares dos visitantes.",
      "TypeScript reduz erros em tempo de desenvolvimento e documenta melhor os dados (por exemplo, perguntas do quiz e estruturas do mapa). Tailwind CSS acelera a criação de uma interface consistente com a identidade visual da marca EcoMind.",
      "A decisão de publicar como PWA (Progressive Web App) atende ao contexto escolar e da ExpoPT: o visitante pode “instalar” o app a partir do navegador, sem depender de lojas oficiais, o que facilita a demonstração e o uso contínuo depois da feira.",
      "O mapa de queimadas consome dados do Programa Queimadas (INPE), com possibilidade de complemento via NASA FIRMS. Essa escolha privilegia fontes oficiais e abertas, reforçando a credibilidade educativa do projeto e o vínculo com o problema real estudado na pesquisa.",
      "A calculadora de pegada de carbono e o quiz foram implementados no próprio produto para fechar o ciclo educativo: informar, testar conhecimento e sugerir mudança de hábitos — base para o voluntariado consciente.",
    ],
    stack: [
      "Next.js 16 + React 19 + TypeScript",
      "Tailwind CSS v4 (design system próprio da marca)",
      "PWA (manifest + service worker)",
      "Leaflet / react-leaflet (mapa)",
      "API Route interna para focos de queimadas (INPE / FIRMS)",
      "Deploy na Vercel (https://eco-mind-ashy.vercel.app)",
    ],
  },
  features: [
    {
      name: "Landing educativa",
      path: "/",
      description:
        "Apresenta o problema, a ideia, a equipe e o convite à ação.",
    },
    {
      name: "Quiz ambiental",
      path: "/quiz",
      description: "Atividade lúdica com feedback baseado em dados.",
    },
    {
      name: "Calculadora de pegada de carbono",
      path: "/calculadora",
      description: "Traduz hábitos cotidianos em impacto compreensível.",
    },
    {
      name: "Mapa de queimadas",
      path: "/alerta-queimadas",
      description: "Visualização de focos com dados satelitais (INPE).",
    },
    {
      name: "Página de instalação (PWA)",
      path: "/baixar",
      description: "Orienta o visitante a instalar o app no celular.",
    },
  ],
} as const;

export const PRESENTATION = {
  title: "5. Apresentação",
  intro:
    "A apresentação deve mostrar domínio do projeto — não um texto decorado. O grupo explica o problema, a ODS 15, o voluntariado e demonstra as ferramentas ao vivo.",
  domains: [
    {
      title: "Domínio do conteúdo",
      items: [
        "Explicar desmatamento e queimadas com clareza",
        "Relacionar o tema à ODS 15 — Vida Terrestre",
        "Mostrar por que o voluntariado importa",
      ],
    },
    {
      title: "Clareza e comunicação",
      items: [
        "Fala clara e organizada",
        "Linguagem adequada a crianças, jovens e adultos",
        "Evitar jargão técnico sem explicação",
      ],
    },
    {
      title: "Apresentação do projeto",
      items: [
        "Mostrar como a EcoMind funciona",
        "Demonstrar o quiz (atividade lúdica)",
        "Exibir mapa e/ou calculadora",
        "Explicar o papel da tecnologia escolhida",
      ],
    },
    {
      title: "Participação do grupo",
      items: [
        "Divisão equilibrada das falas",
        "Colaboração visível entre os integrantes",
        "Todos sabem explicar o projeto (não só “a sua parte”)",
      ],
    },
    {
      title: "Interação com o público",
      items: [
        "Convidar o visitante a jogar o quiz",
        "Responder perguntas com segurança",
        "Encerrar com ações práticas de voluntariado",
      ],
    },
  ],
  suggestedScript: [
    {
      who: "Integração / abertura",
      say: "Somos a equipe EcoMind. Nosso tema é voluntariado e tecnologia para proteger a Vida Terrestre — ODS 15 — com foco em desmatamento e queimadas.",
    },
    {
      who: "Problema",
      say: "Muita gente se preocupa, mas não sabe como ajudar. Falta uma ponte entre a notícia e a ação.",
    },
    {
      who: "Solução",
      say: "Criamos um app/site que educa, propõe um quiz e mostra dados reais de queimadas para incentivar a participação voluntária.",
    },
    {
      who: "Demo",
      say: "Vamos te mostrar o quiz e o mapa. Depois, contamos três coisas que você pode fazer na sua escola ou bairro.",
    },
    {
      who: "Fechamento",
      say: "Tecnologia não resolve sozinha — mas, com voluntariado, ajuda a proteger florestas, fauna e o nosso futuro.",
    },
  ],
} as const;

export const VISITOR_CHALLENGE = {
  title: "Desafio para os visitantes",
  goal: "Ao final, o visitante da ExpoPT deve conseguir responder:",
  questions: [
    "O que descobri?",
    "Por que esse problema importa?",
    "O que eu posso fazer para ajudar?",
    "Como a tecnologia pode contribuir?",
  ],
  ourObjective:
    "Não queremos apenas apresentar um trabalho. Queremos criar uma experiência que faça as pessoas conhecerem um problema ambiental e perceberem que também podem fazer parte da solução.",
} as const;
