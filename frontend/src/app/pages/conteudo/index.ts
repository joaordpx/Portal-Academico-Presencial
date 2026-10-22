import { isValidElement, type ReactElement, type ReactNode } from "react";
import {
  PanelAccordion,
  PanelCardGrid,
  PanelInfo,
  PanelLinks,
  PanelNote,
  PanelRedirect,
  PanelRelated,
  PanelSteps,
} from "../../components/layout/SectionLayout";
import { Glossario } from "./AjudaSuporteComponentes";
import { conteudoAjudaSuporte } from "./ajudaSuporte";
import { conteudoAssistenciaEstudantil } from "./assistenciaEstudantil";
import { conteudoEditais } from "./editais";
import { conteudoMovimentoEstudantil } from "./movimentoEstudantil";
import { conteudoServicosDocumentos } from "./servicosDocumentos";
import { conteudoVidaAcademica } from "./vidaAcademica";
import type { PaginaConteudo } from "./tipos";

/**
 * Índice do conteúdo das páginas de seção para a busca global.
 *
 * Lê as mesmas seções que as páginas mostram e extrai o que dá para abrir
 * direto: a seção (/pagina#secao), cada link ou documento de dentro dela,
 * as perguntas frequentes e as siglas do glossário. Este módulo é carregado
 * sob demanda, só quando a busca é usada.
 */

export const PAGINAS_CONTEUDO: PaginaConteudo[] = [
  conteudoVidaAcademica,
  conteudoServicosDocumentos,
  conteudoAssistenciaEstudantil,
  conteudoEditais,
  conteudoMovimentoEstudantil,
  conteudoAjudaSuporte,
];

export type TipoConteudo = "secao" | "link" | "pergunta" | "sigla";

export interface ItemConteudo {
  id: string;
  tipo: TipoConteudo;
  titulo: string;
  detalhe: string;
  /** Página do portal (com #seção) */
  to?: string;
  /** Fonte oficial (abre em nova aba) */
  url?: string;
  /** Texto extra que também casa na busca, sem aparecer na tela */
  extras: string[];
}

type Props = Record<string, unknown>;
type LinkDado = { label: string; desc?: string; href?: string; to?: string };

/** Todo o texto visível de um trecho de JSX (respostas, notas...) */
export function textoDe(no: ReactNode): string {
  let texto = "";
  if (typeof no === "string" || typeof no === "number") texto = String(no);
  else if (Array.isArray(no)) texto = no.map(textoDe).join(" ");
  else if (isValidElement(no)) texto = textoDe((no.props as Props).children as ReactNode);
  return texto.replace(/\s+/g, " ").trim();
}

function percorrer(no: ReactNode, visitar: (el: ReactElement<Props>) => void) {
  if (Array.isArray(no)) no.forEach((n) => percorrer(n, visitar));
  else if (isValidElement<Props>(no)) {
    visitar(no);
    percorrer(no.props.children as ReactNode, visitar);
  }
}

/** Para onde o link leva: página do portal ou fonte oficial; e-mail não vira resultado */
function destinoDe(l: { href?: string; to?: string }): Pick<ItemConteudo, "to" | "url"> | null {
  const alvo = l.to ?? l.href;
  if (!alvo || alvo.startsWith("mailto:") || alvo.startsWith("tel:")) return null;
  return alvo.startsWith("/") ? { to: alvo } : { url: alvo };
}

/** Os dois textos têm alguma palavra significativa em comum (sem acento, 4+ letras)? */
function compartilhaPalavra(a: string, b: string) {
  const palavras = (t: string) =>
    new Set(
      t
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .toLowerCase()
        .split(/[^\p{L}\p{N}]+/u)
        .filter((p) => p.length >= 4),
    );
  const pb = palavras(b);
  return [...palavras(a)].some((p) => pb.has(p));
}

export function indexarConteudo(paginas: PaginaConteudo[] = PAGINAS_CONTEUDO): ItemConteudo[] {
  const itens: ItemConteudo[] = [];
  /** Link já indexado por destino, com o quanto a seção dele "combina" com o link */
  const linksVistos = new Map<string, { item: ItemConteudo; combina: boolean }>();

  // O mesmo link costuma aparecer em várias seções (o calendário está em "Sou
  // Calouro" e em "Calendário Acadêmico"): fica um resultado só, atribuído à
  // seção cujo nome tem a ver com ele.
  const addLink = (l: LinkDado, onde: string, idBase: string, rotuloSecao = "") => {
    const destino = destinoDe(l);
    const chave = destino?.url ?? destino?.to;
    if (!destino || !chave) return;
    const combina = compartilhaPalavra(l.label, rotuloSecao);
    const visto = linksVistos.get(chave);
    if (visto) {
      if (combina && !visto.combina) {
        visto.item.detalhe = onde;
        visto.combina = true;
      }
      return;
    }
    const item: ItemConteudo = {
      id: `link-${idBase}-${itens.length}`,
      tipo: "link",
      titulo: l.label,
      detalhe: onde,
      ...destino,
      extras: [l.desc ?? ""],
    };
    linksVistos.set(chave, { item, combina });
    itens.push(item);
  };

  for (const pagina of paginas) {
    for (const secao of pagina.secoes) {
      const onde = `${pagina.titulo} › ${secao.label}`;
      const destinoSecao = `${pagina.caminho}#${secao.id}`;
      const idBase = `${pagina.caminho.slice(1)}-${secao.id}`;
      const textos: string[] = [...(secao.buscaPor ?? [])];

      percorrer(secao.content, (el) => {
        const p = el.props;
        if (typeof p.intro === "string") textos.push(p.intro);

        switch (el.type) {
          case PanelLinks:
            for (const l of p.links as LinkDado[]) {
              textos.push(l.label, l.desc ?? "");
              addLink(l, onde, idBase, secao.label);
            }
            break;
          case PanelRelated:
            // "Veja também" leva a outras páginas: só ajuda a achar esta seção
            for (const l of p.links as LinkDado[]) textos.push(l.label);
            break;
          case PanelCardGrid:
            for (const c of p.cards as { title: string; desc: string; href?: string }[]) {
              textos.push(c.title, c.desc);
              if (c.href)
                addLink({ label: c.title, desc: c.desc, href: c.href }, onde, idBase, secao.label);
            }
            break;
          case PanelRedirect: {
            const r = p as { title: string; note?: string; href: string };
            textos.push(r.title, r.note ?? "");
            addLink({ label: r.title, desc: r.note, href: r.href }, onde, idBase, secao.label);
            break;
          }
          case PanelAccordion:
            for (const q of p.itens as { titulo: string; conteudo: ReactNode }[]) {
              textos.push(q.titulo);
              itens.push({
                id: `pergunta-${idBase}-${itens.length}`,
                tipo: "pergunta",
                titulo: q.titulo,
                detalhe: onde,
                to: destinoSecao,
                extras: [textoDe(q.conteudo)],
              });
            }
            break;
          case PanelInfo:
            for (const i of p.itens as { rotulo: string; valor: string; detalhe?: string }[]) {
              textos.push(i.rotulo, i.valor, i.detalhe ?? "");
            }
            break;
          case PanelSteps:
            for (const t of p.tracks as {
              label: string;
              steps: { title: string; desc: string }[];
            }[]) {
              textos.push(t.label, ...t.steps.flatMap((s) => [s.title, s.desc]));
            }
            break;
          case PanelNote:
            textos.push(textoDe(p.children as ReactNode));
            break;
          case Glossario:
            for (const s of p.siglas as { sigla: string; significado: string }[]) {
              itens.push({
                id: `sigla-${s.sigla}`,
                tipo: "sigla",
                titulo: s.sigla,
                detalhe: s.significado,
                to: destinoSecao,
                extras: [],
              });
            }
            break;
        }
      });

      itens.push({
        id: `secao-${idBase}`,
        tipo: "secao",
        titulo: secao.label,
        detalhe: pagina.titulo,
        to: destinoSecao,
        extras: textos.filter(Boolean),
      });
    }

    // "Mais acessados" do topo da página, quando ainda não apareceram numa seção
    for (const l of pagina.popular ?? []) {
      addLink(l, `${pagina.titulo} › Mais acessados`, `${pagina.caminho.slice(1)}-popular`);
    }
  }

  return itens;
}
