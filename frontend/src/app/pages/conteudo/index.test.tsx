import { describe, expect, it } from "vitest";
import {
  PanelAccordion,
  PanelLinks,
  PanelNote,
  PanelRedirect,
  PanelRelated,
} from "../../components/layout/SectionLayout";
import { Glossario } from "./AjudaSuporteComponentes";
import { PAGINAS_CONTEUDO, indexarConteudo, textoDe } from "./index";
import type { PaginaConteudo } from "./tipos";

const PAGINA: PaginaConteudo = {
  caminho: "/exemplo",
  titulo: "Exemplo",
  popular: [
    { label: "Calendário", href: "https://unimontes.br/calendario/" },
    { label: "Só no topo", href: "https://unimontes.br/topo/" },
  ],
  secoes: [
    {
      id: "calouro",
      label: "Sou Calouro",
      content: (
        <PanelLinks
          intro="Primeiros passos."
          links={[
            { label: "Calendário Acadêmico", href: "https://unimontes.br/calendario/" },
            { label: "Fale por e-mail", href: "mailto:x@unimontes.br" },
            { label: "Sem link", desc: "Só informativo." },
          ]}
        />
      ),
    },
    {
      id: "calendario",
      label: "Calendário Acadêmico",
      buscaPor: ["feriados"],
      content: (
        <>
          <PanelRedirect
            title="Calendário Acadêmico"
            href="https://unimontes.br/calendario/"
            note="Página oficial."
          />
          <PanelRelated links={[{ label: "Ajuda e Suporte", to: "/ajuda-suporte" }]} />
          <PanelNote>
            Dúvidas? <strong>Procure a coordenação.</strong>
          </PanelNote>
        </>
      ),
    },
    {
      id: "faq",
      label: "FAQ",
      content: (
        <PanelAccordion
          itens={[{ titulo: "Como trancar?", conteudo: <p>Pelo WebGiz, no prazo.</p> }]}
        />
      ),
    },
    {
      id: "glossario",
      label: "Glossário",
      content: <Glossario siglas={[{ sigla: "RU", significado: "Restaurante Universitário" }]} />,
    },
  ],
};

const itens = indexarConteudo([PAGINA]);
const porTipo = (tipo: string) => itens.filter((i) => i.tipo === tipo);

describe("indexarConteudo", () => {
  it("cria um resultado por seção, apontando para /pagina#secao", () => {
    expect(porTipo("secao").map((s) => s.to)).toEqual([
      "/exemplo#calouro",
      "/exemplo#calendario",
      "/exemplo#faq",
      "/exemplo#glossario",
    ]);
  });

  it("a seção fica encontrável pelo texto de dentro dela e pelos sinônimos", () => {
    const cal = porTipo("secao").find((s) => s.to === "/exemplo#calendario")!;
    expect(cal.extras).toEqual(
      expect.arrayContaining(["feriados", "Página oficial.", "Dúvidas? Procure a coordenação."]),
    );
  });

  it("um link repetido em várias seções vira um resultado só, na seção que combina com ele", () => {
    const calendario = porTipo("link").filter((l) => l.url === "https://unimontes.br/calendario/");
    expect(calendario).toHaveLength(1);
    expect(calendario[0].detalhe).toBe("Exemplo › Calendário Acadêmico");
  });

  it("não cria resultado para e-mail, item sem link nem 'veja também'", () => {
    const titulos = porTipo("link").map((l) => l.titulo);
    expect(titulos).not.toContain("Fale por e-mail");
    expect(titulos).not.toContain("Sem link");
    expect(titulos).not.toContain("Ajuda e Suporte");
  });

  it("inclui os 'Mais acessados' que não aparecem em nenhuma seção", () => {
    expect(porTipo("link").find((l) => l.titulo === "Só no topo")?.detalhe).toBe(
      "Exemplo › Mais acessados",
    );
  });

  it("indexa perguntas frequentes com o texto da resposta", () => {
    expect(porTipo("pergunta")).toEqual([
      expect.objectContaining({
        titulo: "Como trancar?",
        to: "/exemplo#faq",
        extras: ["Pelo WebGiz, no prazo."],
      }),
    ]);
  });

  it("indexa siglas do glossário com o significado", () => {
    expect(porTipo("sigla")).toEqual([
      expect.objectContaining({ titulo: "RU", detalhe: "Restaurante Universitário" }),
    ]);
  });
});

describe("conteúdo real do portal", () => {
  it("todas as seções têm id único dentro da página", () => {
    for (const p of PAGINAS_CONTEUDO) {
      const ids = p.secoes.map((s) => s.id);
      expect(new Set(ids).size, p.caminho).toBe(ids.length);
    }
  });

  it("gera resultados de todos os tipos", () => {
    const tipos = new Set(indexarConteudo().map((i) => i.tipo));
    expect([...tipos].sort()).toEqual(["link", "pergunta", "secao", "sigla"]);
  });
});

describe("textoDe", () => {
  it("junta o texto de JSX aninhado", () => {
    expect(
      textoDe(
        <>
          Olá, <strong>mundo</strong> {2026}
        </>,
      ),
    ).toBe("Olá, mundo 2026");
  });
});
