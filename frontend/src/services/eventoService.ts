import type { Evento } from "../types";

/**
 * Serviço de Eventos.
 *
 * Os eventos têm duas origens previstas:
 *  - "externo": sincronizados da API de um sistema externo;
 *  - "manual":  cadastrados por um administrador no portal.
 * Em ambos os casos o portal gera a página de detalhe (/eventos/:slug). Um cadastro
 * pode ser apenas de encaminhamento (sem `conteudo`), exibindo o botão para a página
 * oficial — a página de detalhe continua existindo.
 *
 * Mock temporário — para integrar, importe `fetchApi` de "./api", descomente a chamada `fetchApi` e remova o mock.
 * Backend previsto (Laravel): GET /eventos e GET /eventos/{slug}.
 */

const eventos: Evento[] = [
  {
    id: 1,
    slug: "semana-do-direito-2026",
    titulo: "Semana do Direito 2026",
    descricao: "Palestras, mesas-redondas e workshops sobre temas atuais do direito brasileiro.",
    conteudo: [
      "A Semana do Direito reúne professores, profissionais e estudantes para debater temas atuais do direito brasileiro ao longo de uma semana de atividades.",
      "A programação inclui palestras com convidados externos, mesas-redondas temáticas e workshops práticos voltados à formação profissional dos estudantes.",
      "As atividades são abertas à comunidade acadêmica e contam com certificado de participação para os inscritos.",
    ],
    tipo: "Acadêmico",
    data: "2026-08-16",
    dataFim: "2026-08-20",
    horario: "08:00 - 18:00",
    local: "Auditório Central — Prédio 2",
    campus: "Campus Montes Claros",
    imagem:
      "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=70",
    origem: "manual",
    organizador: "Departamento de Direito",
    linkOficial: "#",
    inscricoesAbertas: true,
  },
  {
    id: 2,
    slug: "eclipse-cultural-mostra-de-arte",
    titulo: "Eclipse Cultural — Mostra de Arte e Fotografia",
    descricao: "Exposição aberta ao público com trabalhos de alunos de Artes e Comunicação.",
    conteudo: [
      "A mostra reúne trabalhos produzidos por estudantes dos cursos de Artes e Comunicação ao longo do semestre.",
      "A visitação é gratuita e aberta ao público externo.",
    ],
    tipo: "Cultural",
    data: "2026-08-28",
    horario: "14:00 - 22:00",
    local: "Galeria da Unimontes — Prédio 1",
    campus: "Campus Montes Claros",
    imagem:
      "https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=1200&q=70",
    origem: "manual",
    organizador: "Centro de Ciências Humanas",
  },
  {
    id: 3,
    slug: "hackathon-tecnologias-inovacao-sociedade",
    titulo: "Hackathon Tecnologias, Inovação e Sociedade",
    descricao:
      "Competição de 48 horas para soluções tecnológicas com impacto social no Norte de Minas.",
    tipo: "Acadêmico",
    data: "2026-08-31",
    dataFim: "2026-09-02",
    horario: "08:00 - 19:00",
    local: "Laboratório Central do CCET — Prédio 3",
    campus: "Campus Montes Claros",
    imagem:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=70",
    origem: "externo",
    organizador: "Centro de Ciências Exatas e Tecnológicas",
    linkOficial: "#",
    inscricoesAbertas: true,
  },
  {
    id: 4,
    slug: "simposio-de-extensao-universitaria",
    titulo: "Simpósio de Extensão Universitária",
    descricao: "Projetos de extensão desenvolvidos junto às comunidades do Norte de Minas.",
    conteudo: [
      "O simpósio apresenta os projetos de extensão desenvolvidos por alunos e professores em parceria com comunidades da região.",
      "Inclui apresentação de trabalhos, rodas de conversa e premiação das melhores experiências extensionistas do ano.",
    ],
    tipo: "Comunitário",
    data: "2026-09-05",
    horario: "08:00 - 17:00",
    local: "Auditório Central — Prédio 2",
    campus: "Campus Montes Claros",
    imagem:
      "https://images.unsplash.com/photo-1559223607-a43c990c692c?auto=format&fit=crop&w=1200&q=70",
    origem: "manual",
    organizador: "Pró-Reitoria de Extensão",
  },
  {
    id: 5,
    slug: "noite-cultural-dce",
    titulo: "Noite Cultural — DCE Unimontes",
    descricao: "Apresentações musicais, teatrais e exposições organizadas pelo DCE.",
    tipo: "Cultural",
    data: "2026-09-18",
    horario: "18:00 - 22:00",
    local: "Praça de Convivência — Prédio 4",
    campus: "Campus Montes Claros",
    imagem:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=70",
    origem: "externo",
    organizador: "Diretório Central dos Estudantes",
    linkOficial: "#",
  },
  {
    id: 6,
    slug: "feira-de-profissoes",
    titulo: "Feira de Profissões e Carreiras",
    descricao:
      "Estudantes do ensino médio conhecem os cursos da Unimontes com apresentações de cada centro.",
    tipo: "Comunitário",
    data: "2026-10-03",
    horario: "09:00 - 16:00",
    local: "Ginásio Poliesportivo",
    campus: "Campus Montes Claros",
    imagem:
      "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1200&q=70",
    origem: "manual",
    organizador: "Pró-Reitoria de Ensino",
    inscricoesAbertas: true,
    linkOficial: "#",
  },
  {
    id: 7,
    slug: "encontro-de-iniciacao-cientifica",
    titulo: "Encontro de Iniciação Científica",
    descricao: "Apresentação dos trabalhos de pesquisa desenvolvidos pelos bolsistas PIBIC.",
    tipo: "Acadêmico",
    data: "2026-10-21",
    dataFim: "2026-10-23",
    horario: "08:00 - 18:00",
    local: "Centro de Convenções",
    campus: "Campus Januária",
    imagem:
      "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=70",
    origem: "externo",
    organizador: "Pró-Reitoria de Pesquisa",
    linkOficial: "#",
  },
  {
    id: 8,
    slug: "festival-de-musica-universitaria",
    titulo: "Festival de Música Universitária",
    descricao: "Apresentações de bandas e artistas formados por estudantes da universidade.",
    conteudo: [
      "O festival reúne bandas e artistas formados por estudantes dos diversos cursos da universidade em uma noite aberta à comunidade.",
      "A entrada é gratuita e a programação completa é divulgada pelos canais do Diretório Central dos Estudantes.",
    ],
    tipo: "Cultural",
    data: "2026-11-07",
    horario: "19:30 - 23:00",
    local: "Anfiteatro — Prédio 5",
    campus: "Campus Montes Claros",
    imagem:
      "https://images.unsplash.com/photo-1470229722913-7ea0d1e2ba28?auto=format&fit=crop&w=1200&q=70",
    origem: "manual",
    organizador: "Diretório Central dos Estudantes",
  },
];

/** Lista de eventos */
export async function getEventos(): Promise<Evento[]> {
  // return fetchApi<Evento[]>("/eventos");
  return eventos;
}

/** Detalhe de um evento pelo slug */
export async function getEvento(slug: string): Promise<Evento | null> {
  // return fetchApi<Evento>(`/eventos/${slug}`);
  return eventos.find((e) => e.slug === slug) ?? null;
}
