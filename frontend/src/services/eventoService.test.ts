import { describe, expect, it } from "vitest";
import { getEventos, getEvento } from "./eventoService";

describe("getEventos", () => {
  it("retorna a lista de eventos", async () => {
    const eventos = await getEventos();
    expect(eventos.length).toBeGreaterThan(0);
  });

  it("não repete slugs — eles são usados como rota", async () => {
    const eventos = await getEventos();
    const slugs = eventos.map((e) => e.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("usa datas em formato ISO, exigidas pela ordenação e pelos filtros", async () => {
    const eventos = await getEventos();
    for (const e of eventos) {
      expect(e.data).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      if (e.dataFim) expect(e.dataFim).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("nunca termina antes de começar", async () => {
    const eventos = await getEventos();
    for (const e of eventos) {
      if (e.dataFim) expect(e.dataFim >= e.data).toBe(true);
    }
  });

  it("separa local e campus — a listagem os exibe em linhas distintas", async () => {
    const eventos = await getEventos();
    for (const e of eventos) {
      expect(e.local).toBeTruthy();
      expect(e.campus).toBeTruthy();
    }
  });
});

describe("getEvento", () => {
  it("encontra o evento pelo slug", async () => {
    const evento = await getEvento("semana-do-direito-2026");
    expect(evento?.titulo).toBe("Semana do Direito 2026");
  });

  it("retorna null para slug inexistente", async () => {
    expect(await getEvento("nao-existe")).toBeNull();
  });

  it("todo evento sem conteúdo próprio oferece link externo", async () => {
    // Cadastros de encaminhamento precisam ter para onde encaminhar
    const eventos = await getEventos();
    const semSaida = eventos.filter((e) => !e.conteudo?.length && !e.linkOficial);
    expect(semSaida.map((e) => e.slug)).toEqual([]);
  });
});
