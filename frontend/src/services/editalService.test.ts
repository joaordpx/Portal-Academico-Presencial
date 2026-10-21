import { afterEach, describe, expect, it, vi } from "vitest";
import { getEditais, toEditalView } from "./editalService";
import type { Edital } from "../types";

/** Data local fixa (meio-dia evita qualquer efeito de fuso) */
const HOJE = new Date(2026, 9, 20, 12); // 20/10/2026

/** Edital no formato exato devolvido por GET /api/editais */
function edital(id: number, prazo: string): Edital {
  return {
    id,
    titulo: `Edital ${id}`,
    tipo: "Extensão",
    publico: "Todos os cursos",
    campus: "Montes Claros",
    prazo,
    url: null,
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

describe("toEditalView", () => {
  it("continua aberto durante todo o último dia do prazo", () => {
    const e = toEditalView(edital(1, "2026-10-20"), HOJE);
    expect(e.status).toBe("Aberto");
    expect(e.diasRestantes).toBe(0);
  });

  it("encerra no dia seguinte ao prazo", () => {
    const e = toEditalView(edital(1, "2026-10-19"), HOJE);
    expect(e.status).toBe("Encerrado");
    expect(e.diasRestantes).toBe(-1);
  });

  it("conta os dias que faltam", () => {
    expect(toEditalView(edital(1, "2026-10-27"), HOJE).diasRestantes).toBe(7);
  });
});

describe("getEditais", () => {
  it("busca na API e ordena: abertos pelo prazo mais próximo, depois encerrados mais recentes", async () => {
    const fetchMock = respostaApi(200, [
      edital(1, "2026-11-05"),
      edital(2, "2026-09-01"),
      edital(3, "2026-10-25"),
      edital(4, "2026-10-10"),
    ]);

    const editais = await getEditais(HOJE);

    expect(fetchMock.mock.calls[0][0]).toMatch(/\/editais$/);
    expect(editais.map((e) => e.id)).toEqual([3, 1, 4, 2]);
    expect(editais.map((e) => e.status)).toEqual(["Aberto", "Aberto", "Encerrado", "Encerrado"]);
  });

  it("propaga a falha para a página exibir o erro", async () => {
    respostaApi(500);
    await expect(getEditais(HOJE)).rejects.toThrow();
  });
});
