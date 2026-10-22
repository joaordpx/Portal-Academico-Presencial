import type { Section } from "../../components/layout/SectionLayout";

/**
 * Conteúdo de uma página de seções (Vida Acadêmica, Serviços e Documentos...).
 *
 * Fica fora do componente da página para ter uma fonte única: a página
 * mostra estas seções e a busca global indexa as mesmas seções, links e
 * perguntas — sem lista de palavras-chave duplicada para manter.
 */
export interface PaginaConteudo {
  /** Rota da página, ex.: "/vida-academica" */
  caminho: string;
  titulo: string;
  /** Atalhos "Mais acessados" do topo da página */
  popular?: { label: string; href?: string }[];
  /** Sugestões de busca do topo da página */
  tags?: string[];
  secoes: Section[];
}
