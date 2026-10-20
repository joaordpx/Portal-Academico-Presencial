import { afterEach, describe, expect, it, vi } from "vitest";
import { getCursos, getCurso, toCursoView } from "./cursoService";
import type { Curso } from "../types";

/** Registro no formato exato devolvido por GET /api/cursos/{slug} */
function cursoApi(overrides: Partial<Curso> = {}): Curso {
  return {
    slug: "sistemas-de-informacao",
    nome: "Sistemas de Informação",
    grau: "Bacharelado",
    modalidade: "Presencial",
    campi: ["Montes Claros"],
    centro: "CCET",
    turnos: ["Diurno"],
    area: "Ciências Exatas e da Terra",
    duracao: 8,
    imagem: "https://exemplo.test/si.jpg",
    vagas: [{ campus: "Montes Claros", quantidade: 28, periodicidade: "semestrais" }],
    descricao: ["Primeiro parágrafo.", "Segundo parágrafo."],
    perfilEgresso: [],
    mercadoTrabalho: [],
    coordenacao: {
      coordenador: "Prof. Fulano",
      email: "si@unimontes.br",
      telefone: "(38) 3229-8276",
      localizacao: "Prédio 3",
    },
    documentos: { matrizUrl: "https://exemplo.test/matriz.pdf", ppcUrl: null },
    regulamentoTccUrl: null,
    paginaOficial: "https://unimontes.br/curso/sistemas-de-informacao/",
    documentosExtras: [],
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

describe("getCursos", () => {
  it("busca a listagem na API", async () => {
    const lista = [cursoApi()];
    const fetchMock = respostaApi(200, lista);

    await expect(getCursos()).resolves.toEqual(lista);
    expect(fetchMock.mock.calls[0][0]).toMatch(/\/cursos$/);
  });

  it("propaga a falha para a página exibir o erro", async () => {
    respostaApi(500);
    await expect(getCursos()).rejects.toThrow();
  });
});

describe("getCurso", () => {
  it("busca o curso pelo slug e devolve a view", async () => {
    const fetchMock = respostaApi(200, cursoApi());

    const curso = await getCurso("sistemas-de-informacao");
    expect(curso?.nome).toBe("Sistemas de Informação");
    expect(fetchMock.mock.calls[0][0]).toMatch(/\/cursos\/sistemas-de-informacao$/);
  });

  it("devolve null quando o curso não existe (404)", async () => {
    respostaApi(404, { message: "Not Found" });
    await expect(getCurso("nao-existe")).resolves.toBeNull();
  });

  it("propaga erros que não são 404", async () => {
    respostaApi(500);
    await expect(getCurso("sistemas-de-informacao")).rejects.toThrow();
  });

  it("escapa o slug na URL", async () => {
    const fetchMock = respostaApi(404);
    await getCurso("a/b");
    expect(fetchMock.mock.calls[0][0]).toMatch(/\/cursos\/a%2Fb$/);
  });
});

describe("toCursoView", () => {
  it("deriva os campos de apresentação a partir dos dados crus", () => {
    const curso = toCursoView(cursoApi());
    // 8 períodos equivalem a 4 anos
    expect(curso.duracaoLabel).toBe("4 anos");
    expect(curso.eyebrow).toBe("Graduação Bacharelado");
    expect(curso.tipo).toBe("Diurno");
  });

  it("junta vários turnos e campi em texto corrido", () => {
    const curso = toCursoView(
      cursoApi({ turnos: ["Matutino", "Noturno"], campi: ["Montes Claros", "Januária", "Unaí"] }),
    );
    expect(curso.tipo).toBe("Matutino e Noturno");
    expect(curso.dados).toContainEqual({
      rotulo: "Campi",
      valor: "Montes Claros, Januária e Unaí",
    });
  });

  it("usa 'Graduação Tecnológica' para tecnólogos", () => {
    expect(toCursoView(cursoApi({ grau: "Tecnólogo" })).eyebrow).toBe("Graduação Tecnológica");
  });

  it("não inventa duração quando a API não informa", () => {
    const curso = toCursoView(cursoApi({ duracao: null }));
    expect(curso.duracaoLabel).toBe("Consulte o PPC");
  });

  it("agrupa vagas iguais em vários campi", () => {
    const curso = toCursoView(
      cursoApi({
        vagas: [
          { campus: "Montes Claros", quantidade: 70, periodicidade: "anuais" },
          { campus: "Januária", quantidade: 35, periodicidade: "anuais" },
          { campus: "Unaí", quantidade: 35, periodicidade: "anuais" },
        ],
      }),
    );
    expect(curso.dados).toContainEqual({
      rotulo: "Vagas",
      valor: "70 anuais (Montes Claros) · 35 anuais por campus (2 campi)",
    });
  });

  it("omite vagas e centro quando não cadastrados", () => {
    const rotulos = toCursoView(cursoApi({ vagas: [], centro: null })).dados.map((d) => d.rotulo);
    expect(rotulos).not.toContain("Vagas");
    expect(rotulos).not.toContain("Centro de Ensino");
  });

  it("monta estágio e TCC genéricos com o nome do curso", () => {
    const curso = toCursoView(cursoApi());
    expect(curso.estagio.intro).toContain("Sistemas de Informação");
    expect(curso.tcc.etapas.length).toBeGreaterThan(0);
  });

  it("lista só os documentos que o curso tem, mais os institucionais", () => {
    const curso = toCursoView(
      cursoApi({
        documentosExtras: [{ label: "Pré-requisitos", url: "https://exemplo.test/p.pdf" }],
      }),
    );
    const labels = curso.arquivos.map((a) => a.label);
    expect(labels).toContain("Estrutura Curricular");
    expect(labels).not.toContain("Projeto Pedagógico do Curso (PPC)"); // ppcUrl é null
    expect(labels).toContain("Pré-requisitos");
    expect(labels).toContain("Página do curso no site da Unimontes");
    expect(curso.arquivos.every((a) => a.url)).toBe(true);
  });

  it("converte contatos ausentes da coordenação em campos opcionais", () => {
    const curso = toCursoView(
      cursoApi({
        coordenacao: { coordenador: null, email: null, telefone: null, localizacao: null },
      }),
    );
    expect(curso.coordenacao.coordenador).toBe("Coordenação do curso");
    expect(curso.coordenacao.email).toBeUndefined();
    expect(curso.coordenacao.localizacao).toBeUndefined();
  });
});
