import { describe, expect, it } from "vitest";
import { getCursos, getCurso } from "./cursoService";

describe("getCursos", () => {
  it("retorna a lista de cursos", async () => {
    const cursos = await getCursos();
    expect(cursos.length).toBeGreaterThan(0);
  });

  it("entrega todos os campos que a listagem consome", async () => {
    const [curso] = await getCursos();
    expect(curso).toMatchObject({
      slug: expect.any(String),
      nome: expect.any(String),
      grau: expect.any(String),
      turno: expect.any(String),
      area: expect.any(String),
      duracao: expect.any(Number),
      imagem: expect.any(String),
    });
  });

  it("não repete slugs — eles são usados como rota", async () => {
    const cursos = await getCursos();
    const slugs = cursos.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe("getCurso", () => {
  it("encontra o curso pelo slug", async () => {
    const curso = await getCurso("sistemas-de-informacao");
    expect(curso?.nome).toBe("Sistemas de Informação");
  });

  it("deriva os campos de apresentação a partir dos dados crus", async () => {
    const curso = await getCurso("sistemas-de-informacao");
    // 8 períodos equivalem a 4 anos
    expect(curso?.duracaoLabel).toBe("4 anos");
    expect(curso?.eyebrow).toBe("Graduação Bacharelado");
    expect(curso?.tipo).toBe(curso?.turno);
  });

  it("monta a lista de dados exibida na aba Sobre", async () => {
    const curso = await getCurso("sistemas-de-informacao");
    const rotulos = curso?.dados.map((d) => d.rotulo) ?? [];
    expect(rotulos).toContain("Duração");
    expect(rotulos).toContain("Campus");
    expect(rotulos).toContain("Vagas");
  });

  it("traz os blocos de estágio e TCC preenchidos", async () => {
    const curso = await getCurso("direito");
    expect(curso?.estagio.informacoes.length).toBeGreaterThan(0);
    expect(curso?.tcc.etapas.length).toBeGreaterThan(0);
  });
});
