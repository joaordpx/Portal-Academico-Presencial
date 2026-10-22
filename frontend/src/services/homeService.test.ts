import { afterEach, describe, expect, it, vi } from "vitest";
import { getDestaqueHero, getOportunidades } from "./homeService";
import type { Edital, Evento } from "../types";

/** Data local fixa (meio-dia evita qualquer efeito de fuso) */
const HOJE = new Date(2026, 9, 20, 12); // 20/10/2026

function edital(id: number, prazo: string, url: string | null = null): Edital {
  return {
    id,
    titulo: `Edital ${id}`,
    tipo: "Extensão",
    publico: "Todos os cursos",
    campus: "Montes Claros",
    prazo,
    url,
  };
}

function evento(id: number, data: string, extra: Partial<Evento> = {}): Evento {
  return {
    id,
    slug: `evento-${id}`,
    titulo: `Evento ${id}`,
    descricao: "Resumo.",
    conteudo: null,
    tipo: "Acadêmico",
    data,
    dataFim: null,
    horario: null,
    local: null,
    campus: "Montes Claros",
    imagem: null,
    origem: "manual",
    organizador: null,
    linkOficial: null,
    inscricoesAbertas: false,
    ...extra,
  };
}

/** Responde /editais e /eventos conforme a URL pedida */
function apiCom(editais: Edital[], eventos: Evento[]) {
  const fetchMock = vi.fn((url: string) => {
    const corpo = url.endsWith("/editais") ? editais : eventos;
    return Promise.resolve(
      new Response(JSON.stringify(corpo), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
  });
  vi.stubGlobal("fetch", fetchMock);
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("getOportunidades", () => {
  it("junta editais abertos e eventos com inscrição aberta, pela data mais próxima", async () => {
    apiCom(
      [edital(1, "2026-11-05", "https://unimontes.br/edital/1"), edital(2, "2026-10-10")],
      [
        evento(7, "2026-10-25", { inscricoesAbertas: true }),
        evento(8, "2026-10-22"), // sem inscrição aberta
      ],
    );

    const ops = await getOportunidades(HOJE);

    expect(ops.map((o) => o.id)).toEqual(["evento-7", "edital-1"]);
    expect(ops[0]).toMatchObject({ tipo: "Evento", rotuloData: "Data", to: "/eventos/evento-7" });
    expect(ops[1]).toMatchObject({
      rotuloData: "Prazo",
      data: "05/11/2026",
      url: "https://unimontes.br/edital/1",
    });
  });

  it("mostra o período de eventos de vários dias", async () => {
    apiCom([], [evento(3, "2026-10-19", { dataFim: "2026-10-23", inscricoesAbertas: true })]);
    const [op] = await getOportunidades(HOJE);
    expect(op.data).toBe("19 a 23/10/2026");
  });

  it("mostra no máximo quatro cards", async () => {
    apiCom(
      [1, 2, 3, 4, 5].map((n) => edital(n, `2026-11-0${n}`)),
      [],
    );
    expect(await getOportunidades(HOJE)).toHaveLength(4);
  });

  it("propaga a falha da API para a seção exibir o erro", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("{}", { status: 500 })));
    await expect(getOportunidades(HOJE)).rejects.toThrow();
  });
});

describe("getDestaqueHero", () => {
  it("destaca o evento que acontece hoje", async () => {
    apiCom([], [evento(1, "2026-10-24"), evento(2, "2026-10-18", { dataFim: "2026-10-23" })]);
    expect(await getDestaqueHero(HOJE)).toMatchObject({
      texto: "Hoje · Evento 2",
      to: "/eventos/evento-2",
    });
  });

  it("senão, o próximo evento da semana", async () => {
    apiCom([], [evento(1, "2026-10-24"), evento(2, "2026-10-21")]);
    expect((await getDestaqueHero(HOJE))?.texto).toBe("Amanhã · Evento 2");
  });

  it("não mostra selo sem evento nos próximos 7 dias", async () => {
    apiCom([], [evento(1, "2026-11-30"), evento(2, "2026-10-01")]);
    expect(await getDestaqueHero(HOJE)).toBeNull();
  });
});
