import { fetchApi } from "./api";
import { getCursos } from "./cursoService";
import { getEditais } from "./editalService";
import { getEventos } from "./eventoService";
import { getLocais, getUnidades } from "./localService";
import { formatarData, formatarPeriodo } from "../utils/data";

/**
 * Busca global do portal (⌘K).
 *
 * A busca roda no navegador: o volume é pequeno (algumas centenas de itens)
 * e assim não depende de nenhum serviço extra no servidor. O índice junta o
 * conteúdo das páginas de seção (seções, links e documentos, perguntas
 * frequentes e siglas — ver app/pages/conteudo) com cursos, locais, editais
 * e eventos da API. Cada resultado leva direto ao conteúdo, não à página
 * genérica. O índice é montado uma vez por visita.
 *
 * Se um dia o volume crescer (documentos, por exemplo), basta trocar
 * `getIndiceBusca`/`buscar` por uma chamada ao backend — a tela não muda.
 */

export type TipoBusca =
  "link" | "secao" | "pergunta" | "sigla" | "curso" | "local" | "campus" | "edital" | "evento";

export interface ItemBusca {
  id: string;
  tipo: TipoBusca;
  titulo: string;
  detalhe: string;
  /** Página do portal (pode ter #seção) */
  to?: string;
  /** Fonte oficial (abre em nova aba) */
  url?: string;
  /** Palavras do título, já normalizadas */
  palavrasTitulo: string[];
  /** Todas as palavras pesquisáveis, já normalizadas */
  palavras: string[];
}

export interface IndiceBusca {
  itens: ItemBusca[];
  /** Fontes que falharam; a busca segue com o que carregou */
  falhas: number;
}

/** Desempate entre tipos: o destino mais específico (o link) vem antes da seção */
export const ORDEM_TIPOS: TipoBusca[] = [
  "link",
  "secao",
  "pergunta",
  "sigla",
  "curso",
  "local",
  "campus",
  "edital",
  "evento",
];

export const ROTULO_TIPO: Record<TipoBusca, string> = {
  link: "Links e documentos",
  secao: "No portal",
  pergunta: "Perguntas frequentes",
  sigla: "Siglas",
  curso: "Cursos",
  local: "Locais",
  campus: "Campi",
  edital: "Editais",
  evento: "Eventos",
};

const MAX_POR_TIPO = 5;

/** Slug do campus-sede na API, cujos prédios a página de Unidades mostra */
const CAMPUS_SEDE = "montes-claros";

/** Sem acentos, minúsculas e espaços simples: "  Matrícula " → "matricula" */
export function normalizar(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function palavrasDe(...textos: (string | null | undefined)[]) {
  const todas = textos.filter(Boolean).flatMap((t) => {
    const n = normalizar(t as string);
    // "Wi-Fi" vira "wi", "fi" e também "wifi", que é como muita gente digita
    const unidas =
      n.match(/[\p{L}\p{N}]+(?:-[\p{L}\p{N}]+)+/gu)?.map((p) => p.replace(/-/g, "")) ?? [];
    return [...n.split(/[^\p{L}\p{N}]+/u), ...unidas];
  });
  return Array.from(new Set(todas.filter(Boolean)));
}

type ItemSemPalavras = Omit<ItemBusca, "palavrasTitulo" | "palavras"> & { extras?: string[] };

function item({ extras = [], ...i }: ItemSemPalavras): ItemBusca {
  return {
    ...i,
    palavrasTitulo: palavrasDe(i.titulo),
    palavras: palavrasDe(i.titulo, i.detalhe, ...extras),
  };
}

/** Uma montagem por visita; uma falha permite tentar de novo na próxima abertura */
let indiceEmCache: Promise<IndiceBusca> | null = null;

export function getIndiceBusca(hoje = new Date()): Promise<IndiceBusca> {
  indiceEmCache ??= montarIndice(hoje).then((indice) => {
    if (indice.falhas > 0) indiceEmCache = null;
    return indice;
  });
  return indiceEmCache;
}

/** Começa a montar o índice antes de a busca abrir (ex.: mouse sobre o botão) */
export function preCarregarBusca() {
  void getIndiceBusca();
}

/** Só para testes */
export function limparCacheBusca() {
  indiceEmCache = null;
}

async function montarIndice(hoje: Date): Promise<IndiceBusca> {
  const [conteudo, cursos, locais, campi, editais, eventos] = await Promise.allSettled([
    // Carregado sob demanda: só quem usa a busca baixa o conteúdo das páginas
    import("../app/pages/conteudo").then((m) => m.indexarConteudo()),
    getCursos(),
    // Os mesmos locais que a página de Unidades mostra, para o link sempre abrir o prédio
    getLocais(CAMPUS_SEDE),
    getUnidades(),
    getEditais(hoje),
    getEventos(hoje),
  ]);

  const itens: ItemBusca[] = [];
  let falhas = 0;

  if (conteudo.status === "fulfilled") {
    for (const c of conteudo.value) itens.push(item(c));
  } else falhas++;

  if (cursos.status === "fulfilled") {
    for (const c of cursos.value) {
      itens.push(
        item({
          id: `curso-${c.slug}`,
          tipo: "curso",
          titulo: c.nome,
          detalhe: [c.grau, c.campi.join(", ")].join(" · "),
          to: `/cursos/${c.slug}`,
          extras: [c.area, c.centro ?? "", ...c.turnos],
        }),
      );
    }
  } else falhas++;

  if (locais.status === "fulfilled") {
    for (const l of locais.value) {
      itens.push(
        item({
          id: `local-${l.slug}`,
          tipo: "local",
          titulo: l.nome,
          detalhe: l.centro ? `${l.centro.sigla} · ${l.campus}` : `${l.tipo} · ${l.campus}`,
          to: `/unidades-localizacao#${l.slug}`,
          extras: [
            l.descricao ?? "",
            l.centro?.nome ?? "",
            l.localizacao ?? "",
            ...l.setores,
            ...l.servicos,
          ],
        }),
      );
    }
  } else falhas++;

  if (campi.status === "fulfilled") {
    for (const u of campi.value) {
      itens.push(
        item({
          id: `campus-${u.slug}`,
          tipo: "campus",
          titulo: u.nome,
          detalhe: [u.cidade, u.regiao].filter(Boolean).join(" · "),
          to: `/unidades-localizacao#campus-${u.slug}`,
          extras: [u.endereco ?? "", "campus", ...u.cursos, ...u.servicos],
        }),
      );
    }
  } else falhas++;

  if (editais.status === "fulfilled") {
    for (const e of editais.value) {
      itens.push(
        item({
          id: `edital-${e.id}`,
          tipo: "edital",
          titulo: e.titulo,
          detalhe: `${e.status} · prazo ${formatarData(e.prazo)}`,
          url: e.url ?? undefined,
          to: e.url ? undefined : "/editais-oportunidades",
          extras: [e.tipo, e.publico, e.campus, "edital"],
        }),
      );
    }
  } else falhas++;

  if (eventos.status === "fulfilled") {
    for (const e of eventos.value) {
      itens.push(
        item({
          id: `evento-${e.slug}`,
          tipo: "evento",
          titulo: e.titulo,
          detalhe: [formatarPeriodo(e.data, e.dataFim), e.local ?? e.campus]
            .filter(Boolean)
            .join(" · "),
          to: `/eventos/${e.slug}`,
          extras: [e.descricao, e.tipo, e.organizador ?? "", "evento"],
        }),
      );
    }
  } else falhas++;

  return { itens, falhas };
}

/**
 * Cada palavra digitada precisa ser o começo de alguma palavra do item
 * ("matr" encontra "Matrícula"). Palavras do título valem mais; empates vão
 * pela ordem dos grupos e depois por ordem alfabética.
 */
export function buscar(indice: IndiceBusca, termo: string): ItemBusca[] {
  const consulta = normalizar(termo);
  const tokens = consulta.split(/[^\p{L}\p{N}]+/u).filter(Boolean);
  if (tokens.length === 0) return [];

  const comPontos: { item: ItemBusca; pontos: number }[] = [];
  for (const it of indice.itens) {
    let pontos = 0;
    let casouTodos = true;
    for (const t of tokens) {
      if (it.palavrasTitulo.some((p) => p.startsWith(t))) pontos += 3;
      else if (it.palavras.some((p) => p.startsWith(t))) pontos += 1;
      else {
        casouTodos = false;
        break;
      }
    }
    if (!casouTodos) continue;
    if (normalizar(it.titulo).startsWith(consulta)) pontos += 2;
    comPontos.push({ item: it, pontos });
  }

  comPontos.sort(
    (a, b) =>
      b.pontos - a.pontos ||
      ORDEM_TIPOS.indexOf(a.item.tipo) - ORDEM_TIPOS.indexOf(b.item.tipo) ||
      a.item.titulo.localeCompare(b.item.titulo, "pt-BR"),
  );

  // Limite por grupo, para um tipo numeroso não esconder os outros
  const porTipo = new Map<TipoBusca, number>();
  return comPontos
    .map((c) => c.item)
    .filter((it) => {
      const n = porTipo.get(it.tipo) ?? 0;
      porTipo.set(it.tipo, n + 1);
      return n < MAX_POR_TIPO;
    });
}

/* ── Estatísticas (lidas no painel de administração) ── */

export interface RegistroBusca {
  termo: string;
  resultados: number;
  /** Tipo do resultado clicado; ausente quando não houve clique */
  tipoClicado?: TipoBusca;
  /** Posição do resultado clicado na lista, começando em 1 */
  posicao?: number;
}

/**
 * Acompanha uma abertura da busca para as estatísticas.
 *
 * Uma busca só conta depois de "assentar" (a pessoa parou de digitar) e é
 * enviada quando termina: clique num resultado, janela fechada ou troca de
 * assunto. Refinar o termo ("ped" → "pedagogia") não conta como outra busca,
 * e nada é enviado tecla a tecla.
 */
export function criarSessaoBusca(enviar = registrarBusca, esperaMs = 1500) {
  let assentada: { termo: string; resultados: number } | null = null;
  let timer: ReturnType<typeof setTimeout> | null = null;

  const cancelar = () => {
    if (timer) clearTimeout(timer);
    timer = null;
  };

  return {
    /** A cada mudança do termo ou da quantidade de resultados */
    digitou(termo: string, resultados: number) {
      const atual = termo.trim();
      const anterior = assentada?.termo;
      if (assentada && anterior !== atual) {
        const refinou = atual.startsWith(anterior!) || anterior!.startsWith(atual);
        if (!refinou) enviar(assentada);
        assentada = null;
      }
      cancelar();
      if (normalizar(atual).length < 2) return;
      timer = setTimeout(() => {
        assentada = { termo: atual, resultados };
      }, esperaMs);
    },

    /** Clicou num resultado: a busca termina com sucesso */
    clicou(termo: string, resultados: number, tipoClicado: TipoBusca, posicao: number) {
      cancelar();
      assentada = null;
      enviar({ termo: termo.trim(), resultados, tipoClicado, posicao });
    },

    /** Fechou sem clicar: conta só se a busca chegou a assentar */
    encerrou() {
      cancelar();
      if (assentada) enviar(assentada);
      assentada = null;
    },
  };
}

/**
 * Envia uma busca concluída para as estatísticas. Nunca atrapalha quem está
 * buscando: falhas são ignoradas e nada identifica a pessoa (sem login, sem
 * cookie; o servidor não guarda IP).
 */
export function registrarBusca(registro: RegistroBusca): void {
  if (normalizar(registro.termo).length < 2) return;
  fetchApi("/buscas", {
    method: "POST",
    body: JSON.stringify({
      termo: registro.termo,
      resultados: registro.resultados,
      tipoClicado: registro.tipoClicado ?? null,
      posicao: registro.posicao ?? null,
    }),
    keepalive: true,
  }).catch(() => undefined);
}
