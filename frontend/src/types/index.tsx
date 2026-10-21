export interface Comunicado {
  id: number;
  tag: string;
  tagColor: string;
  title: string;
  desc: string;
  publico: string;
  campus: string;
  data: string;
}

export interface Oportunidade {
  id: number;
  title: string;
  tipo: string;
  prazo: string;
  publico: string;
  campus: string;
}

export interface Noticia {
  id: number;
  cat: string;
  catColor: string;
  bg: string;
  img: string;
  title: string;
  desc: string;
  date: string;
}

export interface DestaqueHero {
  texto: string;
  corFundo: string;
  ativo: boolean;
}

/* ─────────────── Unidades e Localização ─────────────── */

export type LocalTipo =
  | "Salas de aula"
  | "Administrativo"
  | "Biblioteca"
  | "Laboratório"
  | "Alimentação"
  | "Esportivo"
  | "Serviço";

/** Centro de ensino sediado no prédio (vínculo estável, ao contrário das turmas) */
export interface CentroEnsino {
  sigla: string; // CCET
  nome: string; // Centro de Ciências Exatas e Tecnológicas
}

/** Faixa de horário de funcionamento — vários registros p/ RU, biblioteca etc. */
export interface HorarioFuncionamento {
  dias?: string; // "Segunda a sexta" — ausente quando a fonte não informa
  horas: string; // "08h às 18h"
  rotulo?: string; // "Almoço", "Jantar", "Café da manhã"
}

/** Só traz as chaves cadastradas (a API omite as vazias) */
export interface Contato {
  telefone?: string;
  email?: string;
  ramal?: string;
}

/** Campus ou núcleo da universidade — GET /api/campi */
export interface Unidade {
  slug: string;
  nome: string; // "Campus Montes Claros"
  cidade: string;
  regiao: string | null;
  sede: boolean; // campus-sede (Montes Claros) — vem primeiro na lista
  endereco: string | null;
  contato: Contato;
  horarios: HorarioFuncionamento[];
  cursos: string[]; // nomes dos cursos ofertados no campus
  servicos: string[];
  mapsUrl: string | null;
}

/** Itens do levantamento; uma chave ausente equivale a "não possui" */
export interface Acessibilidade {
  rampa?: boolean;
  elevador?: boolean;
  banheiroAdaptado?: boolean;
  pisoTatil?: boolean;
  vagaEspecial?: boolean;
}

/**
 * Local do campus (prédio, setor, serviço...) — GET /api/locais.
 *
 * `svgId` amarra o registro ao <path> correspondente na planta do campus —
 * quando o SVG existir, o mapa vira apenas uma camada de apresentação sobre
 * estes mesmos dados. `coordenadas` alimentam o botão "Como chegar".
 */
export interface Local {
  id: number;
  slug: string;
  nome: string; // ex.: "Prédio 1"
  numero: number | null; // prédios são numerados (1 a 13)
  tipo: LocalTipo;
  campus: string; // nome do campus, ex.: "Campus Montes Claros"
  descricao: string | null;
  /** Centro de ensino sediado no prédio — vínculo estável */
  centro: CentroEnsino | null;
  /**
   * Cursos vinculados ao centro. NÃO indica onde as aulas acontecem:
   * turmas mudam de prédio a cada semestre. Serve para o estudante
   * identificar o prédio do seu centro.
   */
  cursosDoCentro: string[];
  /** Setores administrativos que funcionam no local */
  setores: string[];
  /** Serviços disponíveis (biblioteca, cantina, laboratórios...) */
  servicos: string[];
  /** Localização interna, ex.: "Prédio 7 · Sala 101" */
  localizacao: string | null;
  contato: Contato;
  horarios: HorarioFuncionamento[];
  coordenadas: { lat: number; lng: number } | null;
  svgId: string | null; // id do <path> na planta do campus
  /** Nulo enquanto o levantamento de acessibilidade do local não for concluído */
  acessibilidade: Acessibilidade | null;
}

/* ─────────────── Eventos ─────────────── */

export type EventoTipo = "Cultural" | "Acadêmico" | "Comunitário";

/**
 * Origem do registro:
 * - "externo": importado da API de um sistema externo
 * - "manual": cadastrado por um administrador no portal
 * Em ambos os casos o evento ganha página de detalhe própria no portal.
 */
export type EventoOrigem = "externo" | "manual";

/** Registro cru de um evento (espelha a futura tabela) */
export interface Evento {
  id: number;
  slug: string; // rota /eventos/:slug
  titulo: string;
  descricao: string; // resumo exibido no card
  conteudo?: string[]; // texto completo da página de detalhe (opcional)
  tipo: EventoTipo;
  data: string; // ISO (YYYY-MM-DD)
  dataFim?: string; // ISO — eventos de vários dias
  horario: string; // ex.: "19:30 - 21:30"
  local: string; // ex.: "Auditório CCH — Prédio 2"
  campus: string; // ex.: "Campus Montes Claros"
  imagem: string;
  origem: EventoOrigem;
  organizador?: string;
  /** Página oficial do evento (inscrição). Pode ser o único conteúdo, em cadastros de encaminhamento. */
  linkOficial?: string;
  inscricoesAbertas?: boolean;
}

/* ─────────────── Editais e Oportunidades ─────────────── */

export type EditalStatus = "Aberto" | "Encerrado";

export type EditalTipo =
  | "Monitoria"
  | "Extensão"
  | "Pesquisa"
  | "Estágio"
  | "Assistência"
  | "Mobilidade"
  | "Pós-Graduação";

/**
 * Registro cru de um edital — GET /api/editais.
 * Não traz status: ele é derivado do prazo, para nunca exibir como "Aberto"
 * um edital que já venceu.
 */
export interface Edital {
  id: number;
  titulo: string;
  tipo: EditalTipo;
  publico: string; // ex.: "Todos os cursos", "Graduados"
  campus: string; // ex.: "Montes Claros", "Todos os campi"
  prazo: string; // ISO (YYYY-MM-DD) — último dia de inscrição
  url: string | null; // edital ou notícia no site oficial
}

/** Edital pronto para exibir — derivado de `Edital` no serviço */
export interface EditalView extends Edital {
  status: EditalStatus;
  diasRestantes: number; // dias de calendário até o prazo (0 = último dia, negativo = vencido)
}

/* ─────────────── Cursos ─────────────── */

export type Grau = "Bacharelado" | "Licenciatura" | "Tecnólogo";

export type Modalidade = "Presencial" | "EAD" | "Híbrido";

export type Turno = "Integral" | "Diurno" | "Matutino" | "Vespertino" | "Noturno";

/** Vagas de ingresso de um curso em um campus */
export interface VagasCurso {
  campus: string;
  quantidade: number;
  periodicidade: "semestrais" | "anuais" | null;
}

export interface MercadoItem {
  titulo: string;
  descricao: string;
}

export interface CursoDocumentos {
  matrizUrl: string | null;
  ppcUrl: string | null;
}

export interface InfoItem {
  rotulo: string;
  valor: string;
}

export interface CursoDocLink {
  label: string;
  url?: string;
  destaque?: boolean; // exibir em destaque (mais acessados)
  desc?: string; // descrição curta (usada nos cards em destaque)
}

/* ── Nível 1: modelo CRU (exatamente o que a API devolve) ── */

/** Item de listagem — GET /api/cursos */
export interface CursoResumo {
  slug: string;
  nome: string;
  grau: Grau;
  modalidade: Modalidade;
  campi: string[]; // um curso pode ser ofertado em vários campi (sede primeiro)
  centro: string | null; // sigla do centro de ensino
  turnos: Turno[]; // turnos das entradas de ingressantes
  area: string;
  duracao: number | null; // nº de períodos (semestres)
  imagem: string | null;
}

/** Registro completo do curso — GET /api/cursos/{slug} */
export interface Curso extends CursoResumo {
  vagas: VagasCurso[];
  descricao: string[]; // parágrafos (no banco: text separado por linha em branco)
  perfilEgresso: string[];
  mercadoTrabalho: MercadoItem[];
  coordenacao: {
    coordenador: string | null;
    email: string | null;
    telefone: string | null;
    localizacao: string | null;
  };
  documentos: CursoDocumentos;
  regulamentoTccUrl: string | null;
  paginaOficial: string | null; // página do curso em unimontes.br
  documentosExtras: { label: string; url: string }[];
}

/* ── Nível 2: VIEW derivada (formatada para a UI; não persiste) ── */

export interface CursoDado {
  rotulo: string;
  valor: string;
}

/** Aba "Estágio e TCC" — bloco de estágio */
export interface EstagioInfo {
  intro: string;
  informacoes: InfoItem[];
  descricao: string;
  documentosNecessarios: string[];
  contatoEmail: string;
}

/** Aba "Estágio e TCC" — bloco de TCC */
export interface TccInfo {
  intro: string;
  orientacoes: InfoItem[];
  descricao: string;
  etapas: string[];
  documentos: CursoDocLink[];
}

/** Aba "Coordenação" — contato da coordenação, com as lacunas já resolvidas */
export interface CoordenacaoInfo {
  intro: string;
  coordenador: string;
  email?: string;
  telefone?: string;
  localizacao?: string;
  horarioAtendimento: string;
}

/**
 * Detalhe pronto para renderizar — derivado de `Curso` no serviço.
 * Estágio, TCC e a lista de arquivos são montados no frontend a partir das
 * regras gerais da universidade e dos links que o curso tiver cadastrados.
 */
export interface CursoDetalheView extends Omit<Curso, "coordenacao"> {
  eyebrow: string; // derivado de grau, ex.: "Graduação Bacharelado"
  tipo: string; // derivado de turnos, ex.: "Matutino e Noturno"
  duracaoLabel: string; // derivado de duracao, ex.: "4 anos"
  dados: CursoDado[]; // pares rótulo/valor montados p/ exibição
  estagio: EstagioInfo;
  tcc: TccInfo;
  arquivos: CursoDocLink[]; // aba "Documentos"
  coordenacao: CoordenacaoInfo;
}
