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
  dias: string; // "Segunda a sexta"
  horas: string; // "08h às 18h"
  rotulo?: string; // "Almoço", "Jantar", "Café da manhã"
}

export interface Contato {
  telefone?: string;
  email?: string;
  ramal?: string;
}

/** Outro campus da universidade */
export interface Unidade {
  slug: string;
  nome: string;
  cidade: string;
  regiao?: string;
  endereco?: string;
  contato: Contato;
  horarios: HorarioFuncionamento[];
  cursos: string[];
  servicos: string[];
  mapsUrl?: string;
}

export interface Acessibilidade {
  rampa: boolean;
  elevador: boolean;
  banheiroAdaptado: boolean;
  pisoTatil: boolean;
  vagaEspecial?: boolean;
}

/**
 * Local do campus (prédio, setor, serviço...).
 *
 * `svgId` amarra o registro ao <path> correspondente na planta do campus —
 * quando o SVG existir, o mapa vira apenas uma camada de apresentação sobre
 * estes mesmos dados. `coordenadas` alimentam o botão "Como chegar".
 */
export interface Local {
  id: number;
  slug: string;
  nome: string; // ex.: "Prédio 1"
  numero?: number; // prédios são numerados (1 a 13)
  tipo: LocalTipo;
  campus: string; // preparado para multi-campus
  descricao: string;
  /** Centro de ensino sediado no prédio — vínculo estável */
  centro?: CentroEnsino;
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
  acessibilidade: Acessibilidade;
  /** Localização interna, ex.: "Prédio 7 · Sala 101" */
  localizacao?: string;
  contato: Contato;
  horarios: HorarioFuncionamento[];
  coordenadas?: { lat: number; lng: number };
  svgId?: string; // id do <path> na planta do campus
  foto?: string;
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
  "Monitoria" | "Extensão" | "Pesquisa" | "Estágio" | "Assistência" | "Mobilidade";

/** Registro cru de um edital (espelha a futura tabela) */
export interface Edital {
  id: number;
  titulo: string;
  status: EditalStatus;
  tipo: EditalTipo;
  curso: string;
  campus: string;
  prazo: string; // ISO (YYYY-MM-DD) — formatação fica na view
  url?: string;
}

/* ─────────────── Cursos ─────────────── */

export type Grau = "Bacharelado" | "Licenciatura" | "Técnico" | "Tecnólogo" | "Especialização";

export type Modalidade = "Presencial" | "EAD" | "Híbrido";

export type Turno = "Integral" | "Matutino" | "Vespertino" | "Noturno";

export interface MercadoItem {
  titulo: string;
  descricao: string;
}

export interface CursoDocumentos {
  matrizUrl?: string;
  ppcUrl?: string;
  ementasUrl?: string;
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

/** Aba "Coordenação" — contato da coordenação do curso */
export interface CoordenacaoInfo {
  intro: string;
  coordenador: string;
  email: string;
  telefone: string;
  localizacao: string;
  horarioAtendimento: string;
}

/* ── Nível 1: modelo CRU (espelha a futura tabela/relações do backend) ── */

/** Item de listagem — campos crus mínimos (/cursos) */
export interface CursoResumo {
  slug: string;
  nome: string;
  grau: Grau;
  modalidade: Modalidade;
  campus: string;
  centro: string;
  turno: Turno;
  area: string;
  duracao: number; // nº de períodos (semestres)
  imagem: string;
}

/** Registro completo do curso — o que a API/tabela deve retornar (/courses/{slug}) */
export interface Curso extends CursoResumo {
  vagas: number;
  descricao: string[]; // parágrafos (no banco: text)
  perfilEgresso: string[];
  mercadoTrabalho: MercadoItem[];
  documentos: CursoDocumentos;
  estagio: EstagioInfo;
  tcc: TccInfo;
  arquivos: CursoDocLink[]; // aba "Documentos": repositório de arquivos do curso
  coordenacao: CoordenacaoInfo;
}

/* ── Nível 2: VIEW derivada (formatada para a UI; não persiste) ── */

export interface CursoDado {
  rotulo: string;
  valor: string;
}

/** Detalhe pronto para renderizar — derivado de `Curso` no serviço */
export interface CursoDetalheView extends Curso {
  eyebrow: string; // derivado de grau, ex.: "Graduação Bacharelado"
  tipo: string; // derivado de turno
  duracaoLabel: string; // derivado de duracao, ex.: "4 anos"
  dados: CursoDado[]; // pares rótulo/valor montados p/ exibição
}
