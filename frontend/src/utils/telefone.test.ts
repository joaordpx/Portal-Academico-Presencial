import { describe, expect, it } from "vitest";
import { digitosDoTelefone, numerosDoTelefone } from "./telefone";
import { CATALOGO_TELEFONICO } from "../app/pages/conteudo/catalogoTelefonico";

const exibicao = (texto: string) => numerosDoTelefone(texto).map((t) => t.exibicao);

describe("numerosDoTelefone", () => {
  it("lê o formato mais comum", () => {
    expect(numerosDoTelefone("(38) 3229 8101")).toEqual([
      { exibicao: "(38) 3229-8101", tel: "+553832298101" },
    ]);
    expect(exibicao("(38) 3229-8000")).toEqual(["(38) 3229-8000"]);
  });

  it("completa os ramais com o prefixo do número anterior", () => {
    expect(exibicao("(38) 3229 8100/8103/8104/8019")).toEqual([
      "(38) 3229-8100",
      "(38) 3229-8103",
      "(38) 3229-8104",
      "(38) 3229-8019",
    ]);
    expect(exibicao("(38) 3229 8256 e 8015")).toEqual(["(38) 3229-8256", "(38) 3229-8015"]);
    expect(exibicao("(38) 3229 8340-8303")).toEqual(["(38) 3229-8340", "(38) 3229-8303"]);
  });

  it("reconhece um segundo número completo com outro prefixo", () => {
    expect(exibicao("(38) 3229 8403 / 3221-1303")).toEqual(["(38) 3229-8403", "(38) 3221-1303"]);
    expect(exibicao("(38) 3229 8210 / (38) 3229 8215")).toEqual([
      "(38) 3229-8210",
      "(38) 3229-8215",
    ]);
  });

  it("aceita travessão e falta de espaço depois do DDD", () => {
    expect(exibicao("(38) 3224 – 8372")).toEqual(["(38) 3224-8372"]);
    expect(exibicao("(38)3621-5932 / 3229-8085")).toEqual(["(38) 3621-5932", "(38) 3229-8085"]);
  });

  it("separa fixos, ramais e celulares misturados", () => {
    expect(exibicao("(38)3821 2756/ 1378/2111/9200 8855/9128 9659")).toEqual([
      "(38) 3821-2756",
      "(38) 3821-1378",
      "(38) 3821-2111",
      "(38) 9200-8855",
      "(38) 9128-9659",
    ]);
  });

  it("usa o DDD de cada cidade", () => {
    expect(numerosDoTelefone("(33) 3721 6279")[0].tel).toBe("+553337216279");
    expect(exibicao("(31) 3915 3280/3286")).toEqual(["(31) 3915-3280", "(31) 3915-3286"]);
  });

  it("devolve lista vazia quando não há número", () => {
    expect(numerosDoTelefone("a combinar")).toEqual([]);
  });

  it("entende todos os telefones do catálogo", () => {
    const semNumero = CATALOGO_TELEFONICO.flatMap((g) =>
      g.contatos.filter(([, tel]) => numerosDoTelefone(tel).length === 0),
    );
    expect(semNumero).toEqual([]);
  });
});

describe("digitosDoTelefone", () => {
  it("dá o número local e o ramal, para buscar por eles", () => {
    expect(digitosDoTelefone("(38) 3229 8101")).toEqual(["32298101", "8101"]);
  });
});
