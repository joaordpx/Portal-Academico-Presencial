import type { CursoResumo, Curso, CursoDetalheView } from "../types";

/**
 * Serviço de Cursos.
 *
 * Os dados abaixo são simulados (mock). Para integrar com o backend,
 * basta descomentar a chamada `fetchApi` correspondente e remover o mock
 * — os componentes já consomem estas funções e não precisarão mudar.
 *
 * Backend previsto (Laravel): GET /courses e GET /courses/{slug}.
 */

const IMG = {
  ti: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=70",
  saude:
    "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=70",
  direito:
    "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=70",
  educacao:
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=70",
  engenharia:
    "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=70",
  cinema:
    "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=70",
  agro: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=70",
  geografia:
    "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=70",
  gestao:
    "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=70",
};

const cursos: CursoResumo[] = [
  {
    slug: "sistemas-de-informacao",
    nome: "Sistemas de Informação",
    grau: "Bacharelado",
    modalidade: "Presencial",
    campus: "Montes Claros",
    centro: "CCET",
    turno: "Noturno",
    area: "Exatas e da Terra",
    duracao: 8,
    imagem: IMG.ti,
  },
  {
    slug: "cinema-e-audiovisual",
    nome: "Cinema e Audiovisual",
    grau: "Licenciatura",
    modalidade: "Presencial",
    campus: "Montes Claros",
    centro: "CCH",
    turno: "Noturno",
    area: "Linguística, Letras e Artes",
    duracao: 8,
    imagem: IMG.cinema,
  },
  {
    slug: "agronomia",
    nome: "Agronomia",
    grau: "Especialização",
    modalidade: "EAD",
    campus: "Januária",
    centro: "CCBS",
    turno: "Integral",
    area: "Ciências Agrárias",
    duracao: 10,
    imagem: IMG.agro,
  },
  {
    slug: "psicologia",
    nome: "Psicologia",
    grau: "Bacharelado",
    modalidade: "Híbrido",
    campus: "Montes Claros",
    centro: "CCBS",
    turno: "Matutino",
    area: "Ciências da Saúde",
    duracao: 10,
    imagem: IMG.saude,
  },
  {
    slug: "ciencias-contabeis",
    nome: "Ciências Contábeis",
    grau: "Bacharelado",
    modalidade: "Presencial",
    campus: "Montes Claros",
    centro: "CCSA",
    turno: "Noturno",
    area: "Ciências Sociais e Aplicadas",
    duracao: 8,
    imagem: IMG.gestao,
  },
  {
    slug: "direito",
    nome: "Direito",
    grau: "Técnico",
    modalidade: "Presencial",
    campus: "Montes Claros",
    centro: "CCSA",
    turno: "Noturno",
    area: "Ciências Sociais e Aplicadas",
    duracao: 8,
    imagem: IMG.direito,
  },
  {
    slug: "medicina",
    nome: "Medicina",
    grau: "Bacharelado",
    modalidade: "Presencial",
    campus: "Montes Claros",
    centro: "CCBS",
    turno: "Integral",
    area: "Ciências da Saúde",
    duracao: 12,
    imagem: IMG.saude,
  },
  {
    slug: "administracao",
    nome: "Administração",
    grau: "Bacharelado",
    modalidade: "Presencial",
    campus: "Montes Claros",
    centro: "CCSA",
    turno: "Integral",
    area: "Ciências Sociais e Aplicadas",
    duracao: 8,
    imagem: IMG.gestao,
  },
  {
    slug: "engenharia-civil",
    nome: "Engenharia Civil",
    grau: "Tecnólogo",
    modalidade: "Presencial",
    campus: "Montes Claros",
    centro: "CCET",
    turno: "Integral",
    area: "Engenharias",
    duracao: 8,
    imagem: IMG.engenharia,
  },
  {
    slug: "geografia",
    nome: "Geografia",
    grau: "Bacharelado",
    modalidade: "Presencial",
    campus: "São Francisco",
    centro: "CCH",
    turno: "Noturno",
    area: "Ciências Humanas",
    duracao: 8,
    imagem: IMG.geografia,
  },
  {
    slug: "pedagogia",
    nome: "Pedagogia",
    grau: "Licenciatura",
    modalidade: "Presencial",
    campus: "Montes Claros",
    centro: "CCH",
    turno: "Noturno",
    area: "Ciências Humanas",
    duracao: 8,
    imagem: IMG.educacao,
  },
  {
    slug: "enfermagem",
    nome: "Enfermagem",
    grau: "Bacharelado",
    modalidade: "Presencial",
    campus: "Montes Claros",
    centro: "CCBS",
    turno: "Integral",
    area: "Ciências da Saúde",
    duracao: 10,
    imagem: IMG.saude,
  },
  {
    slug: "historia",
    nome: "História",
    grau: "Licenciatura",
    modalidade: "Presencial",
    campus: "Montes Claros",
    centro: "CCH",
    turno: "Noturno",
    area: "Ciências Humanas",
    duracao: 8,
    imagem: IMG.educacao,
  },
  {
    slug: "engenharia-agricola",
    nome: "Engenharia Agrícola e Ambiental",
    grau: "Bacharelado",
    modalidade: "Presencial",
    campus: "Januária",
    centro: "CCET",
    turno: "Integral",
    area: "Engenharias",
    duracao: 10,
    imagem: IMG.engenharia,
  },
  {
    slug: "ciencias-biologicas",
    nome: "Ciências Biológicas",
    grau: "Licenciatura",
    modalidade: "Presencial",
    campus: "Montes Claros",
    centro: "CCBS",
    turno: "Vespertino",
    area: "Ciências Biológicas",
    duracao: 8,
    imagem: IMG.agro,
  },
  {
    slug: "matematica",
    nome: "Matemática",
    grau: "Licenciatura",
    modalidade: "EAD",
    campus: "São Francisco",
    centro: "CCET",
    turno: "Noturno",
    area: "Exatas e da Terra",
    duracao: 8,
    imagem: IMG.ti,
  },
];

/** Lista de cursos (página /cursos) */
export async function getCursos(): Promise<CursoResumo[]> {
  // return fetchApi<CursoResumo[]>("/courses");
  return cursos;
}

/**
 * Detalhe de um curso pelo slug (página /cursos/:slug).
 *
 * Fluxo: obtém o registro CRU e o transforma na VIEW derivada.
 * Ao integrar, troque `mockCurso(slug)` por `fetchApi<Curso>(...)` —
 * `toCursoView` (formatação para a UI) permanece igual.
 */
export async function getCurso(slug: string): Promise<CursoDetalheView | null> {
  // const curso = await fetchApi<Curso>(`/courses/${slug}`);
  const curso = mockCurso(slug);
  return curso ? toCursoView(curso) : null;
}

/**
 * MOCK: monta um registro CRU (equivalente a uma linha da tabela + relações).
 * Some quando o backend passar a fornecer o `Curso` completo.
 */
function mockCurso(slug: string): Curso | null {
  const base = cursos.find((c) => c.slug === slug) ?? cursos.find((c) => c.slug === "direito");
  if (!base) return null;
  return {
    ...base,
    vagas: 50,
    descricao: [
      `O curso forma profissionais críticos e humanistas, capazes de interpretar a realidade social e atuar com responsabilidade ética nos diversos campos do ${base.nome.toLowerCase()}.`,
      "A formação combina teoria, prática e atividades de extensão junto à comunidade, cobrindo as áreas fundamentais, profissionais e aplicadas da profissão.",
      "A infraestrutura inclui salas amplas, biblioteca especializada, laboratórios e projetos de atendimento à população.",
    ],
    perfilEgresso: [
      "Interpretar e aplicar os conhecimentos da área com rigor técnico e sensibilidade social.",
      "Atuar na defesa de direitos e na promoção da cidadania.",
      "Compreender a função social da profissão em contextos contemporâneos.",
      "Desenvolver raciocínio crítico e capacidade de argumentação.",
      "Realizar pesquisa científica aplicada à sua área de formação.",
      "Exercer liderança e trabalhar em equipes multidisciplinares.",
    ],
    mercadoTrabalho: [
      {
        titulo: "Setor Público",
        descricao: "Carreiras em órgãos e instituições públicas via concurso.",
      },
      { titulo: "Iniciativa Privada", descricao: "Atuação em empresas e organizações do setor." },
      { titulo: "Autônomo", descricao: "Prestação de serviços de forma independente." },
      { titulo: "Consultoria", descricao: "Assessoria técnica especializada a empresas e órgãos." },
      { titulo: "Terceiro Setor", descricao: "ONGs, fundações e projetos sociais." },
      { titulo: "Docência e Pesquisa", descricao: "Carreira acadêmica e produção científica." },
    ],
    documentos: {},
    estagio: {
      intro:
        "O estágio supervisionado é componente curricular obrigatório, com carga horária de 300 horas, realizado a partir da segunda metade do curso.",
      informacoes: [
        { rotulo: "Carga horária", valor: "300 horas obrigatórias" },
        { rotulo: "Período", valor: "A partir do 7º período" },
        { rotulo: "Local", valor: "Unidade concedente conveniada ao curso" },
        { rotulo: "Orientação", valor: "Professor orientador designado" },
      ],
      descricao:
        "Durante o estágio, o estudante tem contato direto com a prática profissional, participando das atividades típicas da área de formação sob supervisão.",
      documentosNecessarios: [
        "Termo de Compromisso de Estágio",
        "Plano de Atividades",
        "Relatórios periódicos de acompanhamento",
        "Relatório final de estágio",
      ],
      contatoEmail: "estagios@unimontes.br",
    },
    tcc: {
      intro: `O Trabalho de Conclusão de Curso (TCC) é requisito obrigatório para a obtenção do grau em ${base.nome}. Consiste na elaboração de monografia ou artigo científico sobre tema de relevância na área.`,
      orientacoes: [
        { rotulo: "Modalidade", valor: "Monografia ou artigo científico" },
        { rotulo: "Período", valor: "Nos dois últimos períodos" },
        { rotulo: "Orientação", valor: "Professor orientador da área temática escolhida" },
        { rotulo: "Apresentação", valor: "Defesa pública perante banca examinadora" },
      ],
      descricao:
        "O TCC deve seguir as normas técnicas da ABNT e o regulamento específico do curso. A defesa é realizada perante banca composta por três professores avaliadores.",
      etapas: [
        "Escolha do tema e orientador",
        "Elaboração do projeto de pesquisa",
        "Desenvolvimento da pesquisa e redação",
        "Entrega da versão preliminar para o orientador",
        "Revisão e ajustes",
        "Entrega da versão final",
        "Defesa pública",
      ],
      documentos: [
        { label: "Regulamento de TCC do curso" },
        { label: "Manual de normas técnicas (ABNT)" },
        { label: "Modelo de formatação" },
        { label: "Calendário de prazos e entregas" },
      ],
    },
    arquivos: [
      { label: "Horários", destaque: true, desc: "Horários de aula por turma e período letivo." },
      {
        label: "Matriz Curricular",
        destaque: true,
        desc: "Disciplinas, períodos e carga horária do curso.",
      },
      { label: "Ementas", destaque: true, desc: "Conteúdo programático de cada disciplina." },
      { label: "PPC — Projeto Pedagógico do Curso" },
      { label: "Regulamento de Estágio" },
      { label: "Normas de TCC" },
      { label: "Atividades Complementares" },
      { label: "Formulários" },
      { label: "Perguntas Frequentes" },
    ],
    coordenacao: {
      intro: `A coordenação do curso de ${base.nome} está à disposição para atender estudantes, professores e comunidade externa em relação a informações acadêmicas, documentação, matrículas e demais assuntos relacionados ao curso.`,
      coordenador: "Prof.(a) Coordenador(a) do Curso",
      email: "coordenacao@unimontes.br",
      telefone: "(38) 3229-8000",
      localizacao: "Campus Universitário Prof. Darcy Ribeiro — bloco e sala do curso",
      horarioAtendimento: "Segunda a sexta, conforme horário divulgado",
    },
  };
}

/**
 * Transforma o registro CRU na VIEW derivada consumida pela página de detalhe.
 * Aqui mora toda a formatação de apresentação — mantida no frontend.
 */
function toCursoView(c: Curso): CursoDetalheView {
  const anos = Math.round(c.duracao / 2);
  return {
    ...c,
    eyebrow: `Graduação ${c.grau}`,
    tipo: c.turno,
    duracaoLabel: `${anos} anos`,
    dados: [
      { rotulo: "Duração", valor: `${anos} anos (${c.duracao} períodos)` },
      { rotulo: "Centro de Ensino", valor: c.centro },
      { rotulo: "Campus", valor: c.campus },
      { rotulo: "Grau", valor: c.grau },
      { rotulo: "Modalidade", valor: c.modalidade },
      { rotulo: "Turno", valor: c.turno },
      { rotulo: "Área", valor: c.area },
      { rotulo: "Vagas", valor: `${c.vagas} vagas` },
    ],
  };
}
