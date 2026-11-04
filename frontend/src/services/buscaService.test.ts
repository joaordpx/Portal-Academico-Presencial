import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  buscar,
  criarSessaoBusca,
  getIndiceBusca,
  limparCacheBusca,
  normalizar,
  registrarBusca,
  type IndiceBusca,
} from "./buscaService";

const HOJE = new Date(2026, 9, 20, 12); // 20/10/2026

const API: Record<string, unknown> = {
  "/cursos": [
    {
      slug: "pedagogia",
      nome: "Pedagogia",
      grau: "Licenciatura",
      modalidade: "Presencial",
      campi: ["Montes Claros", "Januária"],
      centro: "CCH",
      turnos: ["Vespertino", "Noturno"],
      area: "Ciências Humanas",
      duracao: 8,
      imagem: null,
    },
    {
      slug: "sistemas-de-informacao",
      nome: "Sistemas de Informação",
      grau: "Bacharelado",
      modalidade: "Presencial",
      campi: ["Montes Claros"],
      centro: "CCET",
      turnos: ["Diurno"],
      area: "Ciências Exatas e da Terra",
      duracao: 8,
      imagem: null,
    },
  ],
  "/locais": [
    {
      id: 2,
      slug: "predio-2",
      nome: "Prédio 2",
      numero: 2,
      tipo: "Salas de aula",
      campus: "Campus Montes Claros",
      descricao: "Sede do CCH. No térreo funciona a Secretaria Geral.",
      centro: { sigla: "CCH", nome: "Centro de Ciências Humanas" },
      cursosDoCentro: ["Pedagogia"],
      setores: ["Secretaria Geral"],
      servicos: ["Auditório"],
      localizacao: null,
      contato: {},
      horarios: [],
      coordenadas: null,
      svgId: null,
      acessibilidade: null,
    },
  ],
  "/editais": [
    {
      id: 1,
      titulo: "Edital de Monitoria 2026/2",
      tipo: "Monitoria",
      publico: "Todos os cursos",
      campus: "Montes Claros",
      prazo: "2026-10-30",
      url: "https://unimontes.br/edital/monitoria",
    },
  ],
  "/campi": [
    {
      slug: "montes-claros",
      nome: "Campus Montes Claros",
      cidade: "Montes Claros",
      regiao: "Norte de Minas",
      sede: true,
      endereco: null,
      contato: {},
      horarios: [],
      cursos: [],
      servicos: [],
      mapsUrl: null,
    },
    {
      slug: "januaria",
      nome: "Campus Januária",
      cidade: "Januária",
      regiao: "Norte de Minas",
      sede: false,
      endereco: null,
      contato: {},
      horarios: [],
      cursos: ["Pedagogia"],
      servicos: ["Biblioteca"],
      mapsUrl: null,
    },
  ],
  "/eventos": [
    {
      id: 1,
      slug: "semana-de-inovacao",
      titulo: "Semana Municipal de Inovação",
      descricao: "Palestras e hackathon.",
      conteudo: null,
      tipo: "Comunitário",
      data: "2026-10-19",
      dataFim: "2026-10-23",
      horario: null,
      local: "Parque de Exposições",
      campus: "Montes Claros",
      imagem: null,
      origem: "manual",
      organizador: null,
      linkOficial: null,
      inscricoesAbertas: false,
    },
  ],
};

function respostas(falhar: string[] = []) {
  const fetchMock = vi.fn((url: string, init?: RequestInit) => {
    const caminho = new URL(url).pathname.replace(/^\/api/, "");
    if (init?.method === "POST") return Promise.resolve(new Response(null, { status: 204 }));
    if (falhar.includes(caminho)) return Promise.resolve(new Response("{}", { status: 500 }));
    return Promise.resolve(
      new Response(JSON.stringify(API[caminho] ?? []), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

beforeEach(() => limparCacheBusca());
afterEach(() => vi.unstubAllGlobals());

async function indice(): Promise<IndiceBusca> {
  respostas();
  return getIndiceBusca(HOJE);
}

describe("normalizar", () => {
  it("ignora acentos, maiúsculas e espaços extras", () => {
    expect(normalizar("  Matrícula   ACADÊMICA ")).toBe("matricula academica");
  });
});

describe("buscar", () => {
  it("encontra sem acento o que foi escrito com acento", async () => {
    const r = buscar(await indice(), "informacao");
    expect(r[0]?.titulo).toBe("Sistemas de Informação");
  });

  it("casa pelo começo das palavras", async () => {
    const r = buscar(await indice(), "peda");
    expect(r.map((i) => i.id)).toContain("curso-pedagogia");
  });

  it("exige todas as palavras digitadas", async () => {
    const ix = await indice();
    expect(buscar(ix, "sistemas noturno")).toEqual([]);
    expect(buscar(ix, "sistemas diurno")[0]?.id).toBe("curso-sistemas-de-informacao");
  });

  it("dá mais peso ao título do que ao restante", async () => {
    // "Prédio 2" casa no título do local; nas seções do portal só aparece no texto
    expect(buscar(await indice(), "predio 2")[0]?.id).toBe("local-predio-2");
  });

  it("leva direto ao conteúdo das páginas, não à página genérica", async () => {
    const r = buscar(await indice(), "calendario");
    // O primeiro resultado abre o calendário em si; a seção vem logo depois
    expect(r[0]).toMatchObject({ tipo: "link" });
    expect(r[0]?.url).toMatch(/^https:\/\/unimontes\.br\//);
    expect(r.find((i) => i.tipo === "secao")).toMatchObject({
      titulo: "Calendário Acadêmico",
      to: "/vida-academica#calendario",
    });
  });

  it("encontra perguntas frequentes pela pergunta", async () => {
    const r = buscar(await indice(), "esqueci senha webgiz");
    expect(r[0]).toMatchObject({ tipo: "pergunta", to: "/ajuda-suporte#problemas-acesso" });
  });

  it("acha seções pelos sinônimos de buscaPor", async () => {
    const r = buscar(await indice(), "bandejao");
    expect(r[0]).toMatchObject({ tipo: "secao", to: "/assistencia-estudantil#ru" });
  });

  it("explica siglas do glossário", async () => {
    const r = buscar(await indice(), "peaes");
    expect(r.find((i) => i.tipo === "sigla")?.detalhe).toBe(
      "Programa Estadual de Assistência Estudantil",
    );
  });

  it('acha "Wi-Fi" digitado como "wifi"', async () => {
    expect(buscar(await indice(), "wifi")[0]?.titulo).toMatch(/Wi-Fi/);
  });

  it("leva cada tipo ao destino certo", async () => {
    const ix = await indice();
    expect(buscar(ix, "predio 2")[0]).toMatchObject({
      tipo: "local",
      to: "/unidades-localizacao#predio-2",
    });
    // Só os outros campi entram; o campus-sede tem aba própria
    expect(buscar(ix, "campus januaria")[0]).toMatchObject({
      tipo: "campus",
      to: "/unidades-localizacao#campus-januaria",
    });
    expect(buscar(ix, "campus").map((i) => i.id)).not.toContain("campus-montes-claros");
    expect(buscar(ix, "monitoria 2026")[0]).toMatchObject({
      tipo: "edital",
      url: "https://unimontes.br/edital/monitoria",
    });
    expect(buscar(ix, "inovacao")[0]).toMatchObject({
      tipo: "evento",
      to: "/eventos/semana-de-inovacao",
      detalhe: "19 a 23/10/2026 · Parque de Exposições",
    });
  });

  it("não devolve nada para busca vazia", async () => {
    expect(buscar(await indice(), "   ")).toEqual([]);
  });
});

describe("getIndiceBusca", () => {
  it("monta o índice uma vez por visita", async () => {
    const fetchMock = respostas();
    await getIndiceBusca(HOJE);
    await getIndiceBusca(HOJE);
    expect(fetchMock).toHaveBeenCalledTimes(5);
  });

  it("segue com o conteúdo das páginas e o que carregou quando parte da API falha", async () => {
    respostas(["/cursos"]);
    const ix = await getIndiceBusca(HOJE);
    expect(ix.falhas).toBe(1);
    expect(buscar(ix, "pedagogia").map((i) => i.tipo)).not.toContain("curso");
    expect(buscar(ix, "webgiz").length).toBeGreaterThan(0);
  });

  it("tenta de novo na próxima abertura se algo falhou", async () => {
    const fetchMock = respostas(["/cursos"]);
    await getIndiceBusca(HOJE);
    await getIndiceBusca(HOJE);
    expect(fetchMock).toHaveBeenCalledTimes(10);
  });
});

describe("registrarBusca", () => {
  it("envia termo, resultados e o clique", async () => {
    const fetchMock = respostas();
    registrarBusca({ termo: "pedagogia", resultados: 3, tipoClicado: "curso", posicao: 1 });
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toMatch(/\/buscas$/);
    expect(init?.method).toBe("POST");
    expect(JSON.parse(String(init?.body))).toEqual({
      termo: "pedagogia",
      resultados: 3,
      tipoClicado: "curso",
      posicao: 1,
    });
  });

  it("ignora termos curtos demais", () => {
    const fetchMock = respostas();
    registrarBusca({ termo: " a ", resultados: 10 });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("não quebra quando o servidor falha", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Failed to fetch")));
    expect(() => registrarBusca({ termo: "ru", resultados: 1 })).not.toThrow();
  });
});

describe("criarSessaoBusca", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  function sessao() {
    const enviar = vi.fn();
    return { enviar, s: criarSessaoBusca(enviar, 1500) };
  }

  it("não envia nada enquanto a pessoa digita", () => {
    const { enviar, s } = sessao();
    s.digitou("p", 9);
    s.digitou("pe", 7);
    s.digitou("ped", 2);
    s.encerrou();
    expect(enviar).not.toHaveBeenCalled();
  });

  it("envia ao fechar uma busca que assentou, sem clique", () => {
    const { enviar, s } = sessao();
    s.digitou("bandejao", 0);
    vi.advanceTimersByTime(1500);
    s.encerrou();
    expect(enviar).toHaveBeenCalledExactlyOnceWith({ termo: "bandejao", resultados: 0 });
  });

  it("envia o clique com tipo e posição, uma vez só", () => {
    const { enviar, s } = sessao();
    s.digitou("pedagogia", 3);
    vi.advanceTimersByTime(1500);
    s.clicou("pedagogia", 3, "curso", 1);
    s.encerrou();
    expect(enviar).toHaveBeenCalledExactlyOnceWith({
      termo: "pedagogia",
      resultados: 3,
      tipoClicado: "curso",
      posicao: 1,
    });
  });

  it("refinar o termo não conta como outra busca", () => {
    const { enviar, s } = sessao();
    s.digitou("ped", 4);
    vi.advanceTimersByTime(1500);
    s.digitou("pedagogia", 2);
    vi.advanceTimersByTime(1500);
    s.encerrou();
    expect(enviar).toHaveBeenCalledExactlyOnceWith({ termo: "pedagogia", resultados: 2 });
  });

  it("trocar de assunto encerra a busca anterior", () => {
    const { enviar, s } = sessao();
    s.digitou("ru", 1);
    vi.advanceTimersByTime(1500);
    s.digitou("estagio", 3);
    expect(enviar).toHaveBeenCalledExactlyOnceWith({ termo: "ru", resultados: 1 });
  });

  it("atualiza a quantidade quando o índice termina de carregar", () => {
    const { enviar, s } = sessao();
    s.digitou("medicina", 0);
    s.digitou("medicina", 1);
    vi.advanceTimersByTime(1500);
    s.encerrou();
    expect(enviar).toHaveBeenCalledExactlyOnceWith({ termo: "medicina", resultados: 1 });
  });
});
