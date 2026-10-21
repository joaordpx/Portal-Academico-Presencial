import { fetchApi } from "./api";
import { diasAte } from "../utils/data";
import type { Edital, EditalView } from "../types";

/**
 * Serviço de Editais e Oportunidades — consome a API pública do backend.
 *
 * O status NÃO é guardado no banco: é derivado do prazo em `toEditalView`,
 * para nunca exibir como "Aberto" um edital que já venceu.
 */

/** Editais com status derivado: abertos primeiro (prazo mais próximo), depois encerrados (mais recentes) */
export async function getEditais(hoje = new Date()): Promise<EditalView[]> {
  const editais = await fetchApi<Edital[]>("/editais");
  const views = editais.map((e) => toEditalView(e, hoje));
  const abertos = views
    .filter((e) => e.status === "Aberto")
    .sort((a, b) => a.prazo.localeCompare(b.prazo));
  const encerrados = views
    .filter((e) => e.status === "Encerrado")
    .sort((a, b) => b.prazo.localeCompare(a.prazo));
  return [...abertos, ...encerrados];
}

/** O prazo é o último dia de inscrição: o edital segue aberto durante todo esse dia */
export function toEditalView(e: Edital, hoje = new Date()): EditalView {
  const diasRestantes = diasAte(e.prazo, hoje);
  return { ...e, status: diasRestantes >= 0 ? "Aberto" : "Encerrado", diasRestantes };
}
