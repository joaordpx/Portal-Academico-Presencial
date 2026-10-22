import { fetchApi } from "./api";
import { getCursos } from "./cursoService";
import { getEditais } from "./editalService";
import { getEventos } from "./eventoService";
import { getLocais } from "./localService";
import { formatarData, formatarPeriodo } from "../utils/data";

/**
 * Busca global do portal (⌘K).
 *
 * A busca roda no navegador: o volume é pequeno (dezenas de registros) e
 * assim não depende de nenhum serviço extra no servidor. O índice junta as
 * páginas fixas do portal com cursos, locais, editais e eventos da API, e é
 * montado uma vez por visita, na primeira abertura da busca.
 *
 * Se um dia o volume crescer (documentos, por exemplo), basta trocar
 * `getIndiceBusca`/`buscar` por uma chamada ao backend — a tela não muda.
 */

export type TipoBusca = "pagina" | "atalho" | "curso" | "local" | "edital" | "evento";

export interface ItemBusca {
  id: string;
  tipo: TipoBusca;
  titulo: string;
  detalhe: string;
  /** Página do portal */
  to?: string;
  /** Fonte oficial (abre em nova aba) */
  url?: string;
  /** Nome do ícone na tela de busca (só para páginas e atalhos) */
  icone?: string;
  /** Palavras do título, já normalizadas */
  palavrasTitulo: string[];
  /** Todas as palavras pesquisáveis, já normalizadas */
  palavras: string[];
}

export interface IndiceBusca {
  itens: ItemBusca[];
  /** Fontes da API que falharam; a busca segue com o que carregou */
  falhas: number;
}

/** Ordem dos grupos na tela e no desempate */
export const ORDEM_TIPOS: TipoBusca[] = ["pagina", "atalho", "curso", "local", "edital", "evento"];

export const ROTULO_TIPO: Record<TipoBusca, string> = {
  pagina: "Páginas",
  atalho: "Ações rápidas",
  curso: "Cursos",
  local: "Locais",
  edital: "Editais",
  evento: "Eventos",
};

const MAX_POR_TIPO = 5;

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
  const todas = textos
    .filter(Boolean)
    .flatMap((t) => normalizar(t as string).split(/[^\p{L}\p{N}]+/u))
    .filter(Boolean);
  return Array.from(new Set(todas));
}

type ItemSemPalavras = Omit<ItemBusca, "palavrasTitulo" | "palavras"> & { extras?: string[] };

function item({ extras = [], ...i }: ItemSemPalavras): ItemBusca {
  return {
    ...i,
    palavrasTitulo: palavrasDe(i.titulo),
    palavras: palavrasDe(i.titulo, i.detalhe, ...extras),
  };
}

/** Seções e atalhos do portal — sempre presentes, mesmo com a API fora do ar */
export const ITENS_FIXOS: ItemBusca[] = [
  item({
    id: "pagina-vida-academica",
    tipo: "pagina",
    titulo: "Vida Acadêmica",
    detalhe: "Calendário · Matrícula · Biblioteca",
    to: "/vida-academica",
    icone: "graduacao",
    extras: ["calendário acadêmico", "rematrícula", "tutoriais", "trancamento"],
  }),
  item({
    id: "pagina-cursos",
    tipo: "pagina",
    titulo: "Cursos",
    detalhe: "Graduação · Centros · Turnos",
    to: "/cursos",
    icone: "livro",
    extras: ["graduação", "bacharelado", "licenciatura"],
  }),
  item({
    id: "pagina-servicos",
    tipo: "pagina",
    titulo: "Serviços e Documentos",
    detalhe: "WebGiz · Declarações · Requerimentos",
    to: "/servicos-documentos",
    icone: "documento",
    extras: ["declaração", "histórico escolar", "requerimento", "diploma", "secretaria geral"],
  }),
  item({
    id: "pagina-editais",
    tipo: "pagina",
    titulo: "Editais e Oportunidades",
    detalhe: "Editais · Estágios · Bolsas",
    to: "/editais-oportunidades",
    icone: "prancheta",
    extras: ["estágio", "bolsa", "monitoria", "iniciação científica", "extensão"],
  }),
  item({
    id: "pagina-eventos",
    tipo: "pagina",
    titulo: "Eventos",
    detalhe: "Cultural · Acadêmico · Comunitário",
    to: "/eventos",
    icone: "calendario",
  }),
  item({
    id: "pagina-assistencia",
    tipo: "pagina",
    titulo: "Assistência Estudantil",
    detalhe: "Auxílios · RU · Saúde",
    to: "/assistencia-estudantil",
    icone: "apoio",
    extras: ["peaes", "restaurante universitário", "bandejão", "moradia", "transporte", "creche"],
  }),
  item({
    id: "pagina-movimento",
    tipo: "pagina",
    titulo: "Movimento Estudantil e Lazer",
    detalhe: "DCE · Atléticas · Esporte",
    to: "/movimento-estudantil-lazer",
    icone: "megafone",
    extras: ["centro acadêmico", "diretório central"],
  }),
  item({
    id: "pagina-unidades",
    tipo: "pagina",
    titulo: "Unidades e Localização",
    detalhe: "Mapa · Prédios · Setores · Campi",
    to: "/unidades-localizacao",
    icone: "mapa",
    extras: ["onde fica", "campus", "prédio"],
  }),
  item({
    id: "pagina-ajuda",
    tipo: "pagina",
    titulo: "Ajuda e Suporte",
    detalhe: "Dúvidas frequentes · Contato",
    to: "/ajuda-suporte",
    icone: "telefone",
    extras: ["fale conosco", "contato", "telefone", "email", "ouvidoria"],
  }),
  item({
    id: "atalho-webgiz",
    tipo: "atalho",
    titulo: "WebGiz",
    detalhe: "Notas, frequência e matrícula",
    to: "/servicos-documentos",
    icone: "monitor",
    extras: ["sistema acadêmico", "notas", "frequência", "boletim"],
  }),
  item({
    id: "atalho-carteirinha",
    tipo: "atalho",
    titulo: "Carteirinha estudantil",
    detalhe: "Como emitir",
    to: "/servicos-documentos",
    icone: "carteirinha",
    extras: ["identidade estudantil", "meia entrada"],
  }),
];

/** Uma montagem por visita; uma falha total permite tentar de novo na próxima abertura */
let indiceEmCache: Promise<IndiceBusca> | null = null;

export function getIndiceBusca(hoje = new Date()): Promise<IndiceBusca> {
  indiceEmCache ??= montarIndice(hoje).then((indice) => {
    if (indice.falhas > 0) indiceEmCache = null;
    return indice;
  });
  return indiceEmCache;
}

/** Só para testes */
export function limparCacheBusca() {
  indiceEmCache = null;
}

async function montarIndice(hoje: Date): Promise<IndiceBusca> {
  const [cursos, locais, editais, eventos] = await Promise.allSettled([
    getCursos(),
    getLocais(),
    getEditais(hoje),
    getEventos(hoje),
  ]);

  const itens = [...ITENS_FIXOS];
  let falhas = 0;

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
          to: "/unidades-localizacao",
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
