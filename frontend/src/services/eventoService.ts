import { ApiError, fetchApi } from "./api";
import { diasAteEvento } from "../utils/data";
import type { Evento, EventoView } from "../types";

/**
 * Serviço de Eventos — consome a API pública do backend.
 *
 * Os eventos têm duas origens:
 *  - "externo": sincronizados de outro sistema (SiGex, em breve);
 *  - "manual":  cadastrados por um administrador no painel.
 * Em ambos os casos o portal gera a página de detalhe (/eventos/:slug).
 *
 * `dias` é derivado aqui, a partir da data de hoje, e nunca guardado.
 */

/** Lista de eventos publicados, em ordem de data (a página reordena conforme o filtro) */
export async function getEventos(hoje = new Date()): Promise<EventoView[]> {
  const eventos = await fetchApi<Evento[]>("/eventos");
  return eventos.map((e) => toEventoView(e, hoje));
}

/** Detalhe de um evento pelo slug; `null` quando não existe (404) */
export async function getEvento(slug: string, hoje = new Date()): Promise<EventoView | null> {
  try {
    const evento = await fetchApi<Evento>(`/eventos/${encodeURIComponent(slug)}`);
    return toEventoView(evento, hoje);
  } catch (erro) {
    if (erro instanceof ApiError && erro.status === 404) return null;
    throw erro;
  }
}

export function toEventoView(e: Evento, hoje = new Date()): EventoView {
  return { ...e, dias: diasAteEvento(e.data, e.dataFim, hoje) };
}
