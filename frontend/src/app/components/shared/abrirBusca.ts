/**
 * Abre a busca global (⌘K) de qualquer lugar do portal, opcionalmente já com
 * um termo — usado pelas caixas de busca e sugestões das páginas de seção.
 * O cabeçalho escuta o evento e mostra a janela de busca.
 */

export const EVENTO_ABRIR_BUSCA = "portal:abrir-busca";

export function abrirBusca(termo = "") {
  window.dispatchEvent(new CustomEvent<string>(EVENTO_ABRIR_BUSCA, { detail: termo }));
}
