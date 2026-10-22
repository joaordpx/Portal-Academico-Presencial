import { afterEach, describe, expect, it, vi } from "vitest";
import { getEventos, getEvento } from "./eventoService";
import type { Evento } from "../types";

/** Data local fixa (meio-dia evita qualquer efeito de fuso) */
const HOJE = new Date(2026, 9, 20, 12); // 20/10/2026

/** Evento no formato exato devolvido por GET /api/eventos */
function evento(overrides: Partial<Evento> = {}): Evento {
  return {
    id: 1,
    slug: "semana-academica",
    titulo: "Semana Acadêmica",
    descricao: "Resumo do evento.",
    conteudo: ["Primeiro parágrafo."],
    tipo: "Acadêmico",
    data: "2026-10-25",
    dataFim: null,
    horario: "19h",
    local: "Auditório do CCH",
    campus: "Montes Claros",
    imagem: null,
    origem: "manual",
    organizador: null,
    linkOficial: null,
    inscricoesAbertas: false,
    ...overrides,
  };
}

function respostaApi(status: number, corpo: unknown = {}) {
  const fetchMock = vi.fn().mockResolvedValue(
    new Response(JSON.stringify(corpo), {
      status,
      headers: { "Content-Type": "application/json" },
    }),
  );
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("getEventos", () => {
  it("busca na API e deriva os dias até cada evento", async () => {
    const fetchMock = respostaApi(200, [
      evento({ id: 1, data: "2026-10-25" }),
      evento({ id: 2, data: "2026-10-10" }),
    ]);

    const eventos = await getEventos(HOJE);

    expect(fetchMock.mock.calls[0][0]).toMatch(/\/eventos$/);
    expect(eventos.map((e) => e.dias)).toEqual([5, -10]);
  });

  it("evento de vários dias em andamento conta como hoje (0)", async () => {
    respostaApi(200, [evento({ data: "2026-10-18", dataFim: "2026-10-22" })]);
    const [e] = await getEventos(HOJE);
    expect(e.dias).toBe(0);
  });

  it("propaga a falha para a página exibir o erro", async () => {
    respostaApi(500);
    await expect(getEventos(HOJE)).rejects.toThrow();
  });
});

describe("getEvento", () => {
  it("busca o evento pelo slug", async () => {
    const fetchMock = respostaApi(200, evento());
    const e = await getEvento("semana-academica", HOJE);
    expect(e?.titulo).toBe("Semana Acadêmica");
    expect(fetchMock.mock.calls[0][0]).toMatch(/\/eventos\/semana-academica$/);
  });

  it("devolve null quando o evento não existe (404)", async () => {
    respostaApi(404);
    await expect(getEvento("nao-existe", HOJE)).resolves.toBeNull();
  });

  it("propaga erros que não são 404", async () => {
    respostaApi(500);
    await expect(getEvento("semana-academica", HOJE)).rejects.toThrow();
  });
});
