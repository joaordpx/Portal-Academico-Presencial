import { ApiError, fetchApi } from "./api";
import type { Local, Unidade } from "../types";

/**
 * Serviço de Unidades e Localização — consome a API pública do backend.
 *
 * MODELAGEM: o vínculo estável é PRÉDIO → CENTRO DE ENSINO (o Prédio 3 é o
 * CCET, e isso não muda). O campo `cursosDoCentro` lista os cursos do centro
 * apenas para o estudante se identificar — NÃO indica onde as aulas ocorrem,
 * já que turmas mudam de prédio a cada semestre.
 *
 * `acessibilidade` chega nula enquanto o levantamento do local não for
 * concluído: o portal não afirma o que ainda não foi conferido.
 *
 * Os registros já vêm no formato de exibição (não há campos derivados), por
 * isso não existe camada `toView` aqui.
 */

/** Locais publicados, opcionalmente filtrados pelo slug do campus */
export async function getLocais(campusSlug?: string): Promise<Local[]> {
  const filtro = campusSlug ? `?campus=${encodeURIComponent(campusSlug)}` : "";
  return fetchApi<Local[]>(`/locais${filtro}`);
}

/** Detalhe de um local pelo slug; `null` quando não existe (404) */
export async function getLocal(slug: string): Promise<Local | null> {
  try {
    return await fetchApi<Local>(`/locais/${encodeURIComponent(slug)}`);
  } catch (erro) {
    if (erro instanceof ApiError && erro.status === 404) return null;
    throw erro;
  }
}

/** Demais campi da universidade — o campus-sede tem aba própria na página */
export async function getUnidades(): Promise<Unidade[]> {
  const campi = await fetchApi<Unidade[]>("/campi");
  return campi.filter((c) => !c.sede);
}
