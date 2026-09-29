import type { Edital } from "../types";

/**
 * Serviço de Editais e Oportunidades.
 *
 * Mock temporário — para integrar, importe `fetchApi` de "./api", descomente a chamada `fetchApi` e remova o mock.
 * Backend previsto (Laravel): GET /editais.
 */

const editais: Edital[] = [
  {
    id: 1,
    titulo: "Edital de Monitoria 2026/1",
    status: "Aberto",
    tipo: "Monitoria",
    curso: "Diversos cursos",
    campus: "Montes Claros",
    prazo: "2026-08-20",
  },
  {
    id: 2,
    titulo: "Edital de Extensão — Projeto Comunidade",
    status: "Aberto",
    tipo: "Extensão",
    curso: "Todos os cursos",
    campus: "Montes Claros",
    prazo: "2026-08-25",
  },
  {
    id: 3,
    titulo: "Edital de Iniciação Científica PIBIC 2026",
    status: "Encerrado",
    tipo: "Pesquisa",
    curso: "Todos os cursos",
    campus: "Todos",
    prazo: "2026-07-15",
  },
  {
    id: 4,
    titulo: "Edital de Estágio em Empresas Parceiras",
    status: "Aberto",
    tipo: "Estágio",
    curso: "Administração",
    campus: "Vários campi",
    prazo: "2026-08-06",
  },
  {
    id: 5,
    titulo: "Programa de Bolsa Permanência 2026",
    status: "Aberto",
    tipo: "Assistência",
    curso: "Todos os cursos",
    campus: "Todos",
    prazo: "2026-08-10",
  },
  {
    id: 6,
    titulo: "Edital de Mobilidade Acadêmica Internacional",
    status: "Encerrado",
    tipo: "Mobilidade",
    curso: "Todos os cursos",
    campus: "Todos",
    prazo: "2026-07-01",
  },
  {
    id: 7,
    titulo: "Edital de Apoio a Eventos Estudantis",
    status: "Aberto",
    tipo: "Extensão",
    curso: "Todos os cursos",
    campus: "Montes Claros",
    prazo: "2026-09-12",
  },
  {
    id: 8,
    titulo: "Edital de Monitoria Voluntária 2026/2",
    status: "Aberto",
    tipo: "Monitoria",
    curso: "Diversos cursos",
    campus: "Januária",
    prazo: "2026-09-30",
  },
];

/** Lista de editais (aba "Editais") */
export async function getEditais(): Promise<Edital[]> {
  // return fetchApi<Edital[]>("/editais");
  return editais;
}

/** Opções de filtro derivadas dos dados (viram endpoints/enums no backend) */
export async function getEditaisFiltros() {
  const unicos = (vals: string[]) => Array.from(new Set(vals));
  return {
    curso: ["Todos", ...unicos(editais.map((e) => e.curso))],
    campus: ["Todos", ...unicos(editais.map((e) => e.campus))],
    tipo: ["Todos", ...unicos(editais.map((e) => e.tipo))],
  };
}
