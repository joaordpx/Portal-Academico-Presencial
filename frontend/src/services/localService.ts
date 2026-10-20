import type { Local, Unidade } from "../types";

/**
 * Serviço de Unidades e Localização.
 *
 * ⚠️ DADOS SIMULADOS — a estrutura está correta, mas a ocupação real de cada
 * prédio, as coordenadas e os dados de acessibilidade precisam ser conferidos.
 *
 * MODELAGEM: o vínculo estável é PRÉDIO → CENTRO DE ENSINO (o Prédio 3 é o
 * CCET, e isso não muda). O campo `cursosDoCentro` lista os cursos do centro
 * apenas para o estudante se identificar — NÃO indica onde as aulas ocorrem,
 * já que turmas mudam de prédio a cada semestre. Horário e sala do aluno ficam
 * na página do curso, não aqui.
 *
 * Prédios 1 a 6 concentram salas de aula (sede dos centros); a partir do 7 são
 * setores administrativos e serviços (reitoria, biblioteca, RU...).
 *
 * `svgId` liga cada registro ao <path> da futura planta do campus.
 *
 * Mock temporário — para integrar, importe `fetchApi` de "./api", descomente a chamada
 * e remova o mock.
 * Backend previsto (Laravel): GET /locais, GET /locais/{slug}, GET /unidades.
 */

const MC = "Campus Montes Claros";

const locais: Local[] = [
  {
    id: 1,
    slug: "predio-1",
    nome: "Prédio 1",
    numero: 1,
    tipo: "Salas de aula",
    campus: MC,
    descricao: "Sede do Centro de Ciências Sociais Aplicadas, com salas de aula e coordenações.",
    centro: { sigla: "CCSA", nome: "Centro de Ciências Sociais Aplicadas" },
    cursosDoCentro: ["Direito", "Administração", "Ciências Contábeis", "Ciências Econômicas"],
    setores: ["Coordenações dos cursos do CCSA"],
    servicos: ["Salas de aula", "Cantina", "Área de convivência"],
    acessibilidade: { rampa: true, elevador: false, banheiroAdaptado: true, pisoTatil: false },

    localizacao: "Prédio 1",
    contato: { telefone: "(38) 3229-8000", email: "ccsa@unimontes.br" },
    horarios: [{ dias: "Segunda a sexta", horas: "07h às 22h30" }],
    coordenadas: { lat: -16.7181, lng: -43.8664 },
    svgId: "predio-1",
  },
  {
    id: 2,
    slug: "predio-2",
    nome: "Prédio 2",
    numero: 2,
    tipo: "Salas de aula",
    campus: MC,
    descricao: "Sede do Centro de Ciências Humanas, com salas de aula e auditório.",
    centro: { sigla: "CCH", nome: "Centro de Ciências Humanas" },
    cursosDoCentro: ["Pedagogia", "História", "Geografia", "Letras", "Psicologia"],
    setores: ["Coordenações dos cursos do CCH"],
    servicos: ["Auditório", "Salas de aula"],
    acessibilidade: { rampa: true, elevador: true, banheiroAdaptado: true, pisoTatil: true },

    localizacao: "Prédio 2",
    contato: { telefone: "(38) 3229-8000", email: "cch@unimontes.br" },
    horarios: [{ dias: "Segunda a sexta", horas: "07h às 22h30" }],
    coordenadas: { lat: -16.7185, lng: -43.8669 },
    svgId: "predio-2",
  },
  {
    id: 3,
    slug: "predio-3",
    nome: "Prédio 3",
    numero: 3,
    tipo: "Salas de aula",
    campus: MC,
    descricao: "Sede do Centro de Ciências Exatas e Tecnológicas, com laboratórios de informática.",
    centro: { sigla: "CCET", nome: "Centro de Ciências Exatas e Tecnológicas" },
    cursosDoCentro: [
      "Sistemas de Informação",
      "Engenharia de Sistemas",
      "Engenharia Civil",
      "Física",
      "Matemática",
    ],
    setores: ["Coordenações dos cursos do CCET"],
    servicos: ["Laboratório Central de Informática", "Salas de aula"],
    acessibilidade: { rampa: true, elevador: false, banheiroAdaptado: true, pisoTatil: false },

    localizacao: "Prédio 3",
    contato: { telefone: "(38) 3229-8000", email: "ccet@unimontes.br" },
    horarios: [{ dias: "Segunda a sexta", horas: "07h às 22h30" }],
    coordenadas: { lat: -16.719, lng: -43.8659 },
    svgId: "predio-3",
  },
  {
    id: 4,
    slug: "predio-4",
    nome: "Prédio 4",
    numero: 4,
    tipo: "Salas de aula",
    campus: MC,
    descricao: "Sede do Centro de Ciências Biológicas e da Saúde.",
    centro: { sigla: "CCBS", nome: "Centro de Ciências Biológicas e da Saúde" },
    cursosDoCentro: ["Enfermagem", "Medicina", "Odontologia", "Ciências Biológicas", "Psicologia"],
    setores: ["Coordenações dos cursos do CCBS"],
    servicos: ["Laboratórios", "Salas de aula"],
    acessibilidade: { rampa: true, elevador: true, banheiroAdaptado: true, pisoTatil: true },

    localizacao: "Prédio 4",
    contato: { telefone: "(38) 3229-8000", email: "ccbs@unimontes.br" },
    horarios: [{ dias: "Segunda a sexta", horas: "07h às 22h30" }],
    coordenadas: { lat: -16.7193, lng: -43.8665 },
    svgId: "predio-4",
  },
  {
    id: 5,
    slug: "predio-5",
    nome: "Prédio 5",
    numero: 5,
    tipo: "Salas de aula",
    campus: MC,
    descricao: "Salas de aula compartilhadas entre centros e anfiteatro.",
    cursosDoCentro: [],
    setores: [],
    servicos: ["Anfiteatro", "Salas de aula"],
    acessibilidade: { rampa: true, elevador: false, banheiroAdaptado: true, pisoTatil: false },

    localizacao: "Prédio 5",
    contato: { telefone: "(38) 3229-8000" },
    horarios: [{ dias: "Segunda a sexta", horas: "07h às 22h30" }],
    coordenadas: { lat: -16.7187, lng: -43.8655 },
    svgId: "predio-5",
  },
  {
    id: 6,
    slug: "predio-6",
    nome: "Prédio 6",
    numero: 6,
    tipo: "Salas de aula",
    campus: MC,
    descricao: "Salas de aula e laboratórios de uso compartilhado.",
    cursosDoCentro: [],
    setores: [],
    servicos: ["Laboratórios", "Salas de aula"],
    acessibilidade: { rampa: true, elevador: false, banheiroAdaptado: true, pisoTatil: false },

    localizacao: "Prédio 6",
    contato: { telefone: "(38) 3229-8000" },
    horarios: [{ dias: "Segunda a sexta", horas: "07h às 22h30" }],
    coordenadas: { lat: -16.7184, lng: -43.865 },
    svgId: "predio-6",
  },
  {
    id: 7,
    slug: "reitoria",
    nome: "Reitoria",
    numero: 7,
    tipo: "Administrativo",
    campus: MC,
    descricao: "Sede administrativa da universidade e das pró-reitorias.",
    cursosDoCentro: [],
    setores: [
      "Reitoria",
      "Pró-Reitoria de Ensino",
      "Pró-Reitoria de Extensão",
      "Pró-Reitoria de Pesquisa",
    ],
    servicos: ["Atendimento administrativo"],
    acessibilidade: {
      rampa: true,
      elevador: true,
      banheiroAdaptado: true,
      pisoTatil: true,
      vagaEspecial: true,
    },

    localizacao: "Prédio 7",
    contato: { telefone: "(38) 3229-8000", email: "reitoria@unimontes.br" },
    horarios: [{ dias: "Segunda a sexta", horas: "08h às 18h" }],
    coordenadas: { lat: -16.7176, lng: -43.8672 },
    svgId: "reitoria",
  },
  {
    id: 8,
    slug: "secretaria-geral",
    nome: "Secretaria Geral",
    numero: 8,
    tipo: "Administrativo",
    campus: MC,
    descricao: "Matrícula inicial, documentos acadêmicos, histórico e protocolos.",
    cursosDoCentro: [],
    setores: ["Secretaria Geral", "Protocolo"],
    servicos: ["Matrícula", "Declarações e histórico", "Protocolo de requerimentos"],
    acessibilidade: {
      rampa: true,
      elevador: false,
      banheiroAdaptado: true,
      pisoTatil: true,
      vagaEspecial: true,
    },

    localizacao: "Prédio 8 · Sala 101",
    contato: { telefone: "(38) 3229-8000", email: "secretaria@unimontes.br" },
    horarios: [{ dias: "Segunda a sexta", horas: "08h às 17h" }],
    coordenadas: { lat: -16.7178, lng: -43.8674 },
    svgId: "secretaria-geral",
  },
  {
    id: 9,
    slug: "biblioteca-central",
    nome: "Biblioteca Central",
    numero: 9,
    tipo: "Biblioteca",
    campus: MC,
    descricao: "Acervo físico, salas de estudo e acesso às bases digitais.",
    cursosDoCentro: [],
    setores: ["Sistema de Bibliotecas"],
    servicos: ["Acervo", "Salas de estudo", "Empréstimo e renovação", "Computadores"],
    acessibilidade: { rampa: true, elevador: true, banheiroAdaptado: true, pisoTatil: true },

    localizacao: "Prédio 9",
    contato: { telefone: "(38) 3229-8300", email: "biblioteca@unimontes.br" },
    horarios: [
      { dias: "Segunda a sexta", horas: "07h às 22h" },
      { dias: "Sábado", horas: "08h às 12h" },
    ],
    coordenadas: { lat: -16.7183, lng: -43.8676 },
    svgId: "biblioteca",
  },
  {
    id: 10,
    slug: "restaurante-universitario",
    nome: "Restaurante Universitário",
    numero: 10,
    tipo: "Alimentação",
    campus: MC,
    descricao: "Refeições subsidiadas para a comunidade acadêmica.",
    cursosDoCentro: [],
    setores: ["Assistência Estudantil"],
    servicos: ["Almoço", "Jantar"],
    acessibilidade: { rampa: true, elevador: false, banheiroAdaptado: true, pisoTatil: false },

    localizacao: "Prédio 10",
    contato: { telefone: "(38) 3229-8400", email: "ru@unimontes.br" },
    horarios: [
      { dias: "Segunda a sexta", horas: "06h30 às 08h", rotulo: "Café da manhã" },
      { dias: "Segunda a sexta", horas: "11h às 14h", rotulo: "Almoço" },
      { dias: "Segunda a sexta", horas: "17h30 às 19h30", rotulo: "Jantar" },
    ],
    coordenadas: { lat: -16.7188, lng: -43.8681 },
    svgId: "ru",
  },
  {
    id: 11,
    slug: "centro-esportivo",
    nome: "Centro Esportivo",
    numero: 11,
    tipo: "Esportivo",
    campus: MC,
    descricao: "Quadras poliesportivas, piscina e espaço para atividades físicas.",
    cursosDoCentro: [],
    setores: [],
    servicos: ["Quadras", "Piscina", "Vestiários"],
    acessibilidade: { rampa: true, elevador: false, banheiroAdaptado: true, pisoTatil: false },

    localizacao: "Prédio 11",
    contato: { telefone: "(38) 3229-8500", email: "esportes@unimontes.br" },
    horarios: [{ dias: "Segunda a sexta", horas: "07h às 21h" }],
    coordenadas: { lat: -16.7196, lng: -43.8687 },
    svgId: "centro-esportivo",
  },
  {
    id: 12,
    slug: "nusi",
    nome: "NUSI — Núcleo de Sociedade Inclusiva",
    numero: 12,
    tipo: "Serviço",
    campus: MC,
    descricao: "Apoio a estudantes com necessidades educacionais específicas.",
    cursosDoCentro: [],
    setores: ["NUSI"],
    servicos: ["Atendimento especializado", "Recursos de acessibilidade"],
    acessibilidade: {
      rampa: true,
      elevador: true,
      banheiroAdaptado: true,
      pisoTatil: true,
      vagaEspecial: true,
    },

    localizacao: "Prédio 12",
    contato: { telefone: "(38) 3229-8600", email: "nusi@unimontes.br" },
    horarios: [{ dias: "Segunda a sexta", horas: "08h às 17h" }],
    coordenadas: { lat: -16.7179, lng: -43.8668 },
    svgId: "nusi",
  },
  {
    id: 13,
    slug: "laboratorios",
    nome: "Complexo de Laboratórios",
    numero: 13,
    tipo: "Laboratório",
    campus: MC,
    descricao: "Laboratórios de pesquisa e ensino de uso compartilhado.",
    cursosDoCentro: [],
    setores: [],
    servicos: ["Laboratórios de pesquisa", "Laboratórios didáticos"],
    acessibilidade: { rampa: true, elevador: false, banheiroAdaptado: true, pisoTatil: false },

    localizacao: "Prédio 13",
    contato: { telefone: "(38) 3229-8700" },
    horarios: [{ dias: "Segunda a sexta", horas: "07h às 18h" }],
    coordenadas: { lat: -16.7198, lng: -43.8662 },
    svgId: "laboratorios",
  },
];

/** Demais campi da universidade */
const unidades: Unidade[] = [
  {
    slug: "januaria",
    nome: "Campus Januária",
    cidade: "Januária/MG",
    regiao: "Norte de Minas",
    endereco: "Rua Petrolina Vieira, 1609 — Bico da Pedra, Januária/MG · CEP 39440-000",
    contato: { telefone: "(38) 3621-7099", email: "januaria@unimontes.br" },
    horarios: [{ dias: "Segunda a sexta", horas: "08h às 17h" }],
    cursos: ["Agronomia", "Zootecnia", "Administração"],
    servicos: [
      "Biblioteca",
      "Laboratórios de Informática",
      "Laboratório de Agronomia",
      "Clínica veterinária",
    ],
  },
  {
    slug: "pirapora",
    nome: "Campus Pirapora",
    cidade: "Pirapora/MG",
    regiao: "Norte de Minas",
    endereco: "Rua Humberto Mallard, 1200 — Centro, Pirapora/MG · CEP 39270-000",
    contato: { telefone: "(38) 3741-5299", email: "pirapora@unimontes.br" },
    horarios: [{ dias: "Segunda a sexta", horas: "08h às 17h" }],
    cursos: ["Administração", "Letras", "Ciências Contábeis"],
    servicos: ["Biblioteca", "Laboratórios de Informática", "Auditório", "Cantina"],
  },
  {
    slug: "salinas",
    nome: "Campus Salinas",
    cidade: "Salinas/MG",
    regiao: "Norte de Minas",
    endereco: "Avenida Marechal Castelo Branco, 3768 — Santa Cruz, Salinas/MG · CEP 39560-000",
    contato: { telefone: "(38) 3841-5199", email: "salinas@unimontes.br" },
    horarios: [{ dias: "Segunda a sexta", horas: "08h às 17h" }],
    cursos: ["Ciências Contábeis", "Pedagogia", "Segurança Pública"],
    servicos: [
      "Biblioteca",
      "Laboratórios de Informática",
      "Sala de Estudo",
      "Quadra Poliesportiva",
    ],
  },
  {
    slug: "sao-francisco",
    nome: "Campus São Francisco",
    cidade: "São Francisco/MG",
    regiao: "Norte de Minas",
    endereco: "Endereço a confirmar",
    contato: { telefone: "(38) 3631-1099", email: "saofrancisco@unimontes.br" },
    horarios: [{ dias: "Segunda a sexta", horas: "08h às 17h" }],
    cursos: ["Geografia", "Matemática", "Pedagogia"],
    servicos: ["Biblioteca", "Laboratórios de Informática"],
  },
];

/** Lista de locais (opcionalmente filtrada por campus) */
export async function getLocais(campus?: string): Promise<Local[]> {
  // return fetchApi<Local[]>(campus ? `/locais?campus=${campus}` : "/locais");
  return campus ? locais.filter((l) => l.campus === campus) : locais;
}

/** Detalhe de um local pelo slug */
export async function getLocal(slug: string): Promise<Local | null> {
  // return fetchApi<Local>(`/locais/${slug}`);
  return locais.find((l) => l.slug === slug) ?? null;
}

/** Demais campi da universidade */
export async function getUnidades(): Promise<Unidade[]> {
  // return fetchApi<Unidade[]>("/unidades");
  return unidades;
}
