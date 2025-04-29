
import { 
  AcademicPeriod, 
  Subject, 
  AnnualPlan, 
  TeachingPlan, 
  LessonPlan,
  Assessment,
  Student,
  StudentAssessment,
  CalendarEvent,
  Material
} from '@/types';

// Mock Academic Periods
export const academicPeriods: AcademicPeriod[] = [
  { 
    id: "ap1", 
    name: "Ano Letivo 2023", 
    startDate: "2023-02-01", 
    endDate: "2023-12-15" 
  },
  { 
    id: "ap2", 
    name: "Ano Letivo 2024", 
    startDate: "2024-02-01", 
    endDate: "2024-12-15" 
  },
];

// Mock Subjects
export const subjects: Subject[] = [
  { 
    id: "sub1", 
    name: "Matemática", 
    grade: "6º Ano", 
    academicPeriodId: "ap2" 
  },
  { 
    id: "sub2", 
    name: "Ciências", 
    grade: "6º Ano", 
    academicPeriodId: "ap2" 
  },
  { 
    id: "sub3", 
    name: "História", 
    grade: "7º Ano", 
    academicPeriodId: "ap2" 
  },
  { 
    id: "sub4", 
    name: "Português", 
    grade: "7º Ano", 
    academicPeriodId: "ap2" 
  },
];

// Mock Annual Plans
export const annualPlans: AnnualPlan[] = [
  {
    id: "ap1",
    title: "Plano Anual de Matemática - 6º Ano",
    description: "Desenvolvimento de habilidades matemáticas fundamentais",
    subjectId: "sub1",
    academicPeriodId: "ap2",
    objectives: [
      "Desenvolver o raciocínio lógico e habilidades de resolução de problemas",
      "Compreender conceitos de aritmética, álgebra e geometria",
      "Aplicar conhecimentos matemáticos em situações do cotidiano"
    ],
    generalContent: "Números inteiros, frações, decimais, geometria básica, introdução à álgebra",
    methodology: "Aulas expositivas, resolução de problemas em grupo, jogos matemáticos, projetos interdisciplinares",
    evaluation: "Avaliações bimestrais, trabalhos em grupo, participação em sala",
    references: [
      "DANTE, Luiz Roberto. Matemática: Contexto e Aplicações. São Paulo: Ática, 2020.",
      "IEZZI, Gelson et al. Matemática: Ciência e Aplicações. São Paulo: Saraiva, 2019."
    ],
    createdAt: "2024-01-10T10:30:00Z",
    updatedAt: "2024-01-10T10:30:00Z"
  },
  {
    id: "ap2",
    title: "Plano Anual de Ciências - 6º Ano",
    description: "Exploração do mundo natural e seus fenômenos",
    subjectId: "sub2",
    academicPeriodId: "ap2",
    objectives: [
      "Compreender os princípios básicos das ciências naturais",
      "Desenvolver pensamento científico e investigativo",
      "Relacionar conhecimentos científicos com o cotidiano"
    ],
    generalContent: "Meio ambiente, seres vivos, corpo humano, matéria e energia",
    methodology: "Aulas práticas em laboratório, experimentos demonstrativos, pesquisas, trabalho de campo",
    evaluation: "Relatórios de experiências, provas teóricas e práticas, trabalhos em grupo",
    references: [
      "GEWANDSZNAJDER, Fernando. Ciências: Planeta Terra. São Paulo: Ática, 2019.",
      "CANTO, Eduardo Leite do. Ciências Naturais: Aprendendo com o Cotidiano. São Paulo: Moderna, 2018."
    ],
    createdAt: "2024-01-15T14:20:00Z",
    updatedAt: "2024-01-15T14:20:00Z"
  }
];

// Mock Teaching Plans
export const teachingPlans: TeachingPlan[] = [
  {
    id: "tp1",
    title: "Números Inteiros e Operações",
    description: "Unidade sobre operações com números inteiros",
    annualPlanId: "ap1",
    subjectId: "sub1",
    startDate: "2024-02-05",
    endDate: "2024-03-20",
    objectives: [
      "Compreender o conceito de números inteiros",
      "Realizar operações básicas com números positivos e negativos",
      "Resolver problemas envolvendo números inteiros"
    ],
    bnccReferences: ["EF06MA03", "EF06MA11", "EF06MA12"],
    contents: [
      "Números positivos e negativos",
      "Adição e subtração de números inteiros",
      "Multiplicação e divisão de números inteiros",
      "Propriedades das operações"
    ],
    methodology: "Aulas expositivas com exemplos práticos, jogos matemáticos como 'Banco Imobiliário', resolução de problemas em grupo",
    resources: [
      "Livro didático", 
      "Jogos matemáticos", 
      "Material impresso complementar",
      "Vídeos educativos"
    ],
    evaluation: "Exercícios avaliativos, participação em sala, avaliação escrita ao final da unidade",
    createdAt: "2024-01-20T09:15:00Z",
    updatedAt: "2024-01-20T09:15:00Z"
  },
  {
    id: "tp2",
    title: "Frações e Números Decimais",
    description: "Conceitos e operações com frações",
    annualPlanId: "ap1",
    subjectId: "sub1",
    startDate: "2024-03-22",
    endDate: "2024-05-15",
    objectives: [
      "Compreender o conceito de fração como parte de um todo",
      "Realizar operações com frações",
      "Converter frações em números decimais e vice-versa"
    ],
    bnccReferences: ["EF06MA07", "EF06MA08", "EF06MA09"],
    contents: [
      "Conceito de fração",
      "Frações equivalentes",
      "Operações com frações",
      "Números decimais",
      "Porcentagem"
    ],
    methodology: "Utilização de materiais concretos, atividades práticas, resolução de problemas contextualizados",
    resources: [
      "Material dourado", 
      "Jogos de frações", 
      "Fichas impressas",
      "Aplicativos digitais"
    ],
    evaluation: "Atividades práticas, trabalho em grupo, prova individual",
    createdAt: "2024-01-22T11:30:00Z",
    updatedAt: "2024-01-22T11:30:00Z"
  }
];

// Mock Lesson Plans
export const lessonPlans: LessonPlan[] = [
  {
    id: "lp1",
    title: "Introdução aos Números Inteiros",
    teachingPlanId: "tp1",
    date: "2024-02-05",
    duration: 50,
    objectives: [
      "Compreender o conceito de números positivos e negativos",
      "Identificar números inteiros em situações cotidianas"
    ],
    contents: [
      "Conceito de números inteiros",
      "Representação na reta numérica",
      "Números inteiros no cotidiano"
    ],
    activities: [
      "Apresentação do conceito utilizando exemplos do cotidiano (temperatura, saldo bancário)",
      "Construção de uma reta numérica coletiva",
      "Atividade em duplas: identificação de números inteiros em situações diversas"
    ],
    resources: [
      "Apresentação de slides",
      "Fichas com exemplos de situações cotidianas",
      "Material para construção da reta numérica"
    ],
    homework: "Exercícios do livro didático, páginas 23-24",
    createdAt: "2024-01-25T08:40:00Z",
    updatedAt: "2024-01-25T08:40:00Z"
  },
  {
    id: "lp2",
    title: "Operações de Adição e Subtração com Números Inteiros",
    teachingPlanId: "tp1",
    date: "2024-02-07",
    duration: 50,
    objectives: [
      "Compreender as regras de adição de números inteiros",
      "Resolver operações de adição e subtração com números positivos e negativos"
    ],
    contents: [
      "Adição de números inteiros",
      "Subtração de números inteiros",
      "Propriedades das operações"
    ],
    activities: [
      "Revisão da aula anterior",
      "Explicação das regras de adição com material visual",
      "Resolução de exercícios em grupo",
      "Jogo 'Sobe e Desce' com cartas de números positivos e negativos"
    ],
    resources: [
      "Fichas de exercícios",
      "Cartas numeradas para o jogo",
      "Quadro branco e marcadores"
    ],
    homework: "Lista de problemas envolvendo adição e subtração de números inteiros",
    evaluation: "Observação da participação e desempenho durante o jogo",
    createdAt: "2024-01-25T10:15:00Z",
    updatedAt: "2024-01-25T10:15:00Z"
  }
];

// Mock Assessments
export const assessments: Assessment[] = [
  {
    id: "as1",
    title: "Avaliação Diagnóstica - Matemática 6º Ano",
    description: "Avaliação para identificar conhecimentos prévios dos alunos",
    subjectId: "sub1",
    type: "diagnostic",
    totalPoints: 10,
    date: "2024-02-08",
    createdAt: "2024-01-26T09:00:00Z",
    updatedAt: "2024-01-26T09:00:00Z"
  },
  {
    id: "as2",
    title: "Prova - Números Inteiros",
    description: "Avaliação sobre operações com números inteiros",
    subjectId: "sub1",
    teachingPlanId: "tp1",
    type: "summative",
    totalPoints: 10,
    date: "2024-03-15",
    dueDate: "2024-03-15",
    createdAt: "2024-02-20T14:30:00Z",
    updatedAt: "2024-02-20T14:30:00Z"
  }
];

// Mock Students
export const students: Student[] = [
  {
    id: "st1",
    name: "Ana Silva",
    registration: "2024001"
  },
  {
    id: "st2",
    name: "Bruno Costa",
    registration: "2024002"
  },
  {
    id: "st3",
    name: "Carolina Souza",
    registration: "2024003"
  },
  {
    id: "st4",
    name: "Diego Oliveira",
    registration: "2024004"
  },
  {
    id: "st5",
    name: "Elena Santos",
    registration: "2024005"
  }
];

// Mock Student Assessments
export const studentAssessments: StudentAssessment[] = [
  {
    id: "sa1",
    studentId: "st1",
    assessmentId: "as1",
    score: 8.5,
    feedback: "Bom domínio dos conceitos básicos de aritmética",
    gradedDate: "2024-02-10T10:20:00Z"
  },
  {
    id: "sa2",
    studentId: "st2",
    assessmentId: "as1",
    score: 7.0,
    feedback: "Precisa revisar operações com frações",
    gradedDate: "2024-02-10T10:25:00Z"
  },
  {
    id: "sa3",
    studentId: "st3",
    assessmentId: "as1",
    score: 9.0,
    feedback: "Excelente compreensão dos conceitos matemáticos",
    gradedDate: "2024-02-10T10:30:00Z"
  },
  {
    id: "sa4",
    studentId: "st4",
    assessmentId: "as1",
    score: 6.5,
    feedback: "Dificuldades com problemas envolvendo decimais",
    gradedDate: "2024-02-10T10:35:00Z"
  },
  {
    id: "sa5",
    studentId: "st5",
    assessmentId: "as1",
    score: 8.0,
    feedback: "Bom desempenho geral, com dificuldade em geometria",
    gradedDate: "2024-02-10T10:40:00Z"
  }
];

// Mock Calendar Events
export const calendarEvents: CalendarEvent[] = [
  {
    id: "ce1",
    title: "Aula: Introdução aos Números Inteiros",
    description: "Primeira aula sobre números inteiros",
    startDate: "2024-02-05T08:00:00Z",
    endDate: "2024-02-05T08:50:00Z",
    allDay: false,
    type: "class",
    subjectId: "sub1",
    lessonPlanId: "lp1"
  },
  {
    id: "ce2",
    title: "Aula: Operações de Adição e Subtração",
    startDate: "2024-02-07T08:00:00Z",
    endDate: "2024-02-07T08:50:00Z",
    allDay: false,
    type: "class",
    subjectId: "sub1",
    lessonPlanId: "lp2"
  },
  {
    id: "ce3",
    title: "Avaliação Diagnóstica - Matemática",
    description: "Avaliação inicial para identificar conhecimentos prévios",
    startDate: "2024-02-08T08:00:00Z",
    endDate: "2024-02-08T09:40:00Z",
    allDay: false,
    type: "exam",
    subjectId: "sub1",
    assessmentId: "as1"
  },
  {
    id: "ce4",
    title: "Reunião Pedagógica",
    description: "Reunião com coordenação para alinhamento do bimestre",
    startDate: "2024-02-09T14:00:00Z",
    endDate: "2024-02-09T16:00:00Z",
    allDay: false,
    type: "meeting",
    location: "Sala de Reuniões"
  },
  {
    id: "ce5",
    title: "Entrega Planos de Aula - Março",
    description: "Prazo para entrega dos planos de aula do mês de março",
    startDate: "2024-02-25T23:59:00Z",
    allDay: true,
    type: "deadline"
  },
  {
    id: "ce6",
    title: "Prova - Números Inteiros",
    startDate: "2024-03-15T08:00:00Z",
    endDate: "2024-03-15T09:40:00Z",
    allDay: false,
    type: "exam",
    subjectId: "sub1",
    assessmentId: "as2"
  }
];

// Mock Materials
export const materials: Material[] = [
  {
    id: "m1",
    title: "Apresentação - Números Inteiros",
    description: "Slides sobre conceitos básicos de números inteiros",
    type: "document",
    url: "/materiais/numeros_inteiros_slides.pdf",
    tags: ["números inteiros", "matemática", "6º ano"],
    subjectId: "sub1",
    createdAt: "2024-01-20T10:00:00Z",
    updatedAt: "2024-01-20T10:00:00Z"
  },
  {
    id: "m2",
    title: "Lista de Exercícios - Operações com Números Inteiros",
    description: "Lista com exercícios de fixação sobre adição e subtração",
    type: "document",
    url: "/materiais/exercicios_numeros_inteiros.pdf",
    tags: ["números inteiros", "exercícios", "matemática", "6º ano"],
    subjectId: "sub1",
    createdAt: "2024-01-22T14:30:00Z",
    updatedAt: "2024-01-22T14:30:00Z"
  },
  {
    id: "m3",
    title: "Vídeo - Números Inteiros no Cotidiano",
    description: "Vídeo explicativo sobre aplicações dos números inteiros",
    type: "video",
    url: "https://www.youtube.com/watch?v=example",
    tags: ["números inteiros", "vídeo", "aplicações", "matemática"],
    subjectId: "sub1",
    createdAt: "2024-01-23T09:45:00Z",
    updatedAt: "2024-01-23T09:45:00Z"
  },
  {
    id: "m4",
    title: "Jogo - Dominó de Números Inteiros",
    description: "Instruções e material para o jogo de dominó com operações",
    type: "document",
    url: "/materiais/domino_numeros_inteiros.pdf",
    tags: ["jogo", "números inteiros", "dominó", "matemática"],
    subjectId: "sub1",
    createdAt: "2024-01-24T11:20:00Z",
    updatedAt: "2024-01-24T11:20:00Z"
  },
  {
    id: "m5",
    title: "Site - Khan Academy: Números Inteiros",
    description: "Link para módulo de números inteiros com explicações e exercícios",
    type: "link",
    url: "https://pt.khanacademy.org/math/arithmetic/arith-review-negative-numbers",
    tags: ["khan academy", "números inteiros", "recurso online"],
    subjectId: "sub1",
    createdAt: "2024-01-25T16:15:00Z",
    updatedAt: "2024-01-25T16:15:00Z"
  }
];
