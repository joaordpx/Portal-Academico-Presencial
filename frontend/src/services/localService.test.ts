import { afterEach, describe, expect, it, vi } from "vitest";
import { getLocais, getLocal, getUnidades } from "./localService";
import type { Unidade } from "../types";

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

/** Campus no formato exato devolvido por GET /api/campi */
function campus(slug: string, sede = false): Unidade {
  return {
    slug,
    nome: `Campus ${slug}`,
    cidade: slug,
    regiao: null,
    sede,
    endereco: null,
    contato: {},
    horarios: [],
    cursos: [],
    servicos: [],
    mapsUrl: null,
  };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("getLocais", () => {
  it("filtra pelo slug do campus na query string", async () => {
    const fetchMock = respostaApi(200, []);
    await getLocais("montes-claros");
    expect(fetchMock.mock.calls[0][0]).toMatch(/\/locais\?campus=montes-claros$/);
  });

  it("sem campus busca todos os locais", async () => {
    const fetchMock = respostaApi(200, []);
    await getLocais();
    expect(fetchMock.mock.calls[0][0]).toMatch(/\/locais$/);
  });

  it("propaga a falha para a página exibir o erro", async () => {
    respostaApi(500);
    await expect(getLocais("montes-claros")).rejects.toThrow();
  });
});

describe("getLocal", () => {
  it("devolve null quando o local não existe (404)", async () => {
    respostaApi(404);
    await expect(getLocal("nao-existe")).resolves.toBeNull();
  });

  it("propaga erros que não são 404", async () => {
    respostaApi(500);
    await expect(getLocal("predio-1")).rejects.toThrow();
  });
});

describe("getUnidades", () => {
  it("devolve só os campi fora da sede, na ordem da API", async () => {
    respostaApi(200, [campus("montes-claros", true), campus("almenara"), campus("janauba")]);
    const unidades = await getUnidades();
    expect(unidades.map((u) => u.slug)).toEqual(["almenara", "janauba"]);
  });
});
