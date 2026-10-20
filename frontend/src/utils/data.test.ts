import { describe, expect, it } from "vitest";
import {
  partesData,
  formatarData,
  formatarDataExtenso,
  formatarDataSemana,
  formatarPeriodo,
  mesAbreviado,
  diasAte,
} from "./data";

describe("partesData", () => {
  it("separa dia, mês abreviado e ano", () => {
    expect(partesData("2026-08-16")).toEqual({ dia: "16", mes: "AGO", ano: "2026" });
  });
});

describe("formatarData", () => {
  it("converte ISO para dd/mm/aaaa", () => {
    expect(formatarData("2026-08-16")).toBe("16/08/2026");
  });
});

describe("formatarDataExtenso", () => {
  it("escreve o mês por extenso e remove o zero à esquerda do dia", () => {
    expect(formatarDataExtenso("2026-08-05")).toBe("5 de agosto de 2026");
  });
});

describe("formatarDataSemana", () => {
  it("inclui o dia da semana", () => {
    // 16/08/2026 é um domingo
    expect(formatarDataSemana("2026-08-16")).toBe("Domingo, 16 de Agosto");
  });

  it("não desloca a data por fuso horário", () => {
    // Datas construídas com `new Date("2026-01-01")` viram 31/12 em fusos negativos
    expect(formatarDataSemana("2026-01-01")).toContain("1 de Janeiro");
  });
});

describe("mesAbreviado", () => {
  it("abrevia com inicial maiúscula e ponto", () => {
    expect(mesAbreviado("2026-03-10")).toBe("Mar.");
  });
});

describe("formatarPeriodo", () => {
  it("mostra apenas uma data quando não há fim", () => {
    expect(formatarPeriodo("2026-08-16")).toBe("16/08/2026");
  });

  it("mostra apenas uma data quando início e fim são iguais", () => {
    expect(formatarPeriodo("2026-08-16", "2026-08-16")).toBe("16/08/2026");
  });

  it("encurta o intervalo quando é dentro do mesmo mês", () => {
    expect(formatarPeriodo("2026-08-16", "2026-08-20")).toBe("16 a 20/08/2026");
  });

  it("mostra as duas datas completas quando o mês muda", () => {
    expect(formatarPeriodo("2026-08-31", "2026-09-02")).toBe("31/08/2026 a 02/09/2026");
  });
});

describe("diasAte", () => {
  const hoje = new Date("2026-08-10T12:00:00");

  it("conta os dias restantes até uma data futura", () => {
    expect(diasAte("2026-08-16", hoje)).toBe(6);
  });

  it("retorna zero no próprio dia", () => {
    expect(diasAte("2026-08-10", hoje)).toBe(0);
  });

  it("retorna negativo para datas passadas", () => {
    expect(diasAte("2026-08-01", hoje)).toBeLessThan(0);
  });
});
