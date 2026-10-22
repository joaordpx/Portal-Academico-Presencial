import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router";
import { ArrowUpRight, Copy, MessageCircle, Phone, Search, X } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "../components/layout/PageHeader";
import {
  CATALOGO_ATUALIZADO_EM,
  CATALOGO_FONTE,
  CATALOGO_TELEFONICO,
  CATEGORIAS_CONTATO,
  PREFIXO_RAMAL,
  TELEFONE_GERAL,
  type CategoriaContato,
  type GrupoContatos,
} from "./conteudo/catalogoTelefonico";
import { digitosDoTelefone, numerosDoTelefone, type Telefone } from "../../utils/telefone";
import { normalizar } from "../../utils/texto";

const ROTULO_CATEGORIA = Object.fromEntries(
  CATEGORIAS_CONTATO.map((c) => [c.id, c.rotulo]),
) as Record<CategoriaContato, string>;

const atualizadoEm = CATALOGO_ATUALIZADO_EM.split("-").reverse().join("/");

/** Texto pesquisável de cada contato, montado uma vez */
const PESQUISAVEL = new Map(
  CATALOGO_TELEFONICO.map((g) => [
    g.id,
    {
      grupo: normalizar(g.titulo),
      contatos: g.contatos.map(([setor, tel]) =>
        normalizar([setor, tel, ...digitosDoTelefone(tel)].join(" ")),
      ),
    },
  ]),
);

/** Grupos e contatos que contêm todas as palavras digitadas */
function filtrar(termo: string, categoria: CategoriaContato | "todas"): GrupoContatos[] {
  const palavras = normalizar(termo).split(" ").filter(Boolean);
  return CATALOGO_TELEFONICO.filter((g) => categoria === "todas" || g.categoria === categoria)
    .map((g) => {
      if (palavras.length === 0) return g;
      const p = PESQUISAVEL.get(g.id)!;
      const contatos = g.contatos.filter((_, i) =>
        palavras.every((w) => p.grupo.includes(w) || p.contatos[i].includes(w)),
      );
      return { ...g, contatos };
    })
    .filter((g) => g.contatos.length > 0);
}

async function copiar(numero: string) {
  try {
    await navigator.clipboard.writeText(numero);
    toast.success("Número copiado", { description: numero });
  } catch {
    toast.error("Não foi possível copiar", { description: numero });
  }
}

export function CatalogoTelefonico() {
  const location = useLocation();
  const grupoDoEndereco = decodeURIComponent(location.hash.slice(1));
  const [termo, setTermo] = useState("");
  const [categoria, setCategoria] = useState<CategoriaContato | "todas">("todas");

  const grupos = useMemo(() => filtrar(termo, categoria), [termo, categoria]);
  const totalContatos = grupos.reduce((n, g) => n + g.contatos.length, 0);
  const filtrando = termo.trim() !== "" || categoria !== "todas";

  // Chegando por um link (ex.: da busca do portal), leva até o grupo e o destaca
  useEffect(() => {
    if (!grupoDoEndereco) return;
    document
      .getElementById(grupoDoEndereco)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [grupoDoEndereco]);

  function limpar() {
    setTermo("");
    setCategoria("todas");
  }

  return (
    <>
      <PageHeader
        eyebrow="Contatos"
        title="Catálogo telefônico."
        description="Telefones dos setores da Unimontes, do campus-sede aos outros campi. Toque no número para ligar."
        icon={Phone}
      />

      <section className="bg-white">
        <div className="mx-auto max-w-[1400px] px-6 py-10 lg:px-12 lg:py-14">
          {/* Atalhos mais usados */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <a
              href={`tel:${numerosDoTelefone(TELEFONE_GERAL)[0].tel}`}
              className="group rounded-[10px] border border-[#1a1a1a] bg-[#1a1a1a] p-5 text-white transition-colors hover:border-[#6E3AFF] hover:bg-[#6E3AFF]"
            >
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/60">
                Telefone geral
              </div>
              <div className="mt-2 flex items-center gap-2 text-[22px] font-bold tracking-[-0.02em]">
                <Phone className="h-5 w-5" /> {TELEFONE_GERAL}
              </div>
            </a>
            <div className="rounded-[10px] border border-[#e5e5e5] p-5">
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#1a1a1a]/50">
                Ramais
              </div>
              <p className="mt-2 text-[14px] leading-[1.5] text-[#1a1a1a]/75">
                Para ligar de fora para um ramal, disque <strong>(38) {PREFIXO_RAMAL}</strong> +
                número do ramal. Ex.: ramal 8040 → (38) {PREFIXO_RAMAL}-8040.
              </p>
            </div>
            <Link
              to="/ajuda-suporte#fale-conosco"
              className="group flex flex-col justify-between rounded-[10px] border border-[#e5e5e5] p-5 transition-colors hover:border-[#6E3AFF]"
            >
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#1a1a1a]/50">
                Prefere escrever?
              </div>
              <div className="mt-2 flex items-center justify-between gap-2 text-[15px] font-bold text-[#1a1a1a] group-hover:text-[#6E3AFF]">
                <span className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" /> Fale com a Unimontes
                </span>
                <ArrowUpRight className="h-4 w-4" />
              </div>
            </Link>
          </div>

          {/* Busca e filtros */}
          <div className="mt-10">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#1a1a1a]/50" />
              <input
                type="search"
                value={termo}
                onChange={(e) => setTermo(e.target.value)}
                placeholder="Busque por setor, órgão ou número (ex.: Secretaria Geral, DTI, 8040)"
                aria-label="Buscar no catálogo telefônico"
                className="w-full rounded-[6px] border border-[#d4d4d4] bg-white py-3.5 pl-11 pr-10 text-[15px] text-[#1a1a1a] outline-none transition-colors placeholder:text-[#1a1a1a]/40 focus:border-[#6E3AFF]"
              />
              {termo && (
                <button
                  type="button"
                  onClick={() => setTermo("")}
                  aria-label="Limpar busca"
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-[#1a1a1a]/45 hover:bg-[#1a1a1a]/[0.06] hover:text-[#1a1a1a]"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <div
              className="mt-4 flex gap-2 overflow-x-auto pb-1"
              role="group"
              aria-label="Filtrar por área"
            >
              {[{ id: "todas" as const, rotulo: "Todos" }, ...CATEGORIAS_CONTATO].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategoria(c.id)}
                  aria-pressed={categoria === c.id}
                  className={`shrink-0 rounded-[6px] border px-3 py-1.5 text-[12.5px] font-semibold transition-colors ${
                    categoria === c.id
                      ? "border-[#6E3AFF] bg-[#6E3AFF] text-white"
                      : "border-[#d4d4d4] bg-white text-[#1a1a1a]/70 hover:border-[#1a1a1a]/50 hover:text-[#1a1a1a]"
                  }`}
                >
                  {c.rotulo}
                </button>
              ))}
            </div>

            <div
              className="mt-6 flex items-center justify-between border-b border-[#e5e5e5] pb-3 text-[13px] text-[#1a1a1a]/60"
              aria-live="polite"
            >
              <span>
                <span className="font-bold text-[#1a1a1a]">{totalContatos}</span>{" "}
                {totalContatos === 1 ? "telefone" : "telefones"} em{" "}
                <span className="font-bold text-[#1a1a1a]">{grupos.length}</span>{" "}
                {grupos.length === 1 ? "setor" : "setores"}
              </span>
              {filtrando && (
                <button
                  type="button"
                  onClick={limpar}
                  className="inline-flex items-center gap-1 text-[12px] font-bold text-[#6E3AFF] hover:underline"
                >
                  <X className="h-3 w-3" /> Limpar filtros
                </button>
              )}
            </div>
          </div>

          {/* Lista */}
          {grupos.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-[18px] font-bold text-[#1a1a1a]">Nenhum telefone encontrado</p>
              <p className="mt-2 text-[14px] text-[#1a1a1a]/55">
                Tente o nome do órgão (ex.: "Pró-Reitoria") ou só parte do nome do setor.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-12">
              {/* Índice dos setores visíveis */}
              <nav aria-label="Setores" className="hidden lg:col-span-3 lg:block">
                <div className="sticky top-[150px] max-h-[calc(100vh-180px)] overflow-y-auto pr-2">
                  <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#1a1a1a]/40">
                    Setores
                  </div>
                  <ul className="mt-3 space-y-0.5">
                    {grupos.map((g) => (
                      <li key={g.id}>
                        <a
                          href={`#${g.id}`}
                          className={`block rounded-[6px] px-3 py-1.5 text-[13px] leading-[1.35] transition-colors ${
                            grupoDoEndereco === g.id
                              ? "bg-[#6E3AFF]/[0.08] font-bold text-[#6E3AFF]"
                              : "text-[#1a1a1a]/65 hover:bg-[#1a1a1a]/[0.04] hover:text-[#1a1a1a]"
                          }`}
                        >
                          {g.titulo}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </nav>

              <div className="space-y-6 lg:col-span-9">
                {grupos.map((g) => (
                  <GrupoDeContatos key={g.id} grupo={g} destacado={grupoDoEndereco === g.id} />
                ))}
              </div>
            </div>
          )}

          <p className="mt-12 border-t border-[#e5e5e5] pt-5 text-[12.5px] text-[#1a1a1a]/55">
            Fonte: catálogo oficial da Unimontes, versão de {atualizadoEm}.{" "}
            <a
              href={CATALOGO_FONTE}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#2563EB] hover:underline"
            >
              Ver no site oficial
            </a>
          </p>
        </div>
      </section>
    </>
  );
}

function GrupoDeContatos({ grupo, destacado }: { grupo: GrupoContatos; destacado: boolean }) {
  return (
    <section
      id={grupo.id}
      aria-labelledby={`${grupo.id}-titulo`}
      className={`scroll-mt-40 overflow-hidden rounded-[12px] border bg-white ${
        destacado ? "border-[#6E3AFF] ring-2 ring-[#6E3AFF]/20" : "border-[#e5e5e5]"
      }`}
    >
      <header className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[#e5e5e5] bg-[#fafafa] px-5 py-3.5">
        <h2
          id={`${grupo.id}-titulo`}
          className="text-[16px] font-bold tracking-[-0.01em] text-[#1a1a1a]"
        >
          {grupo.titulo}
        </h2>
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#1a1a1a]/45">
          {ROTULO_CATEGORIA[grupo.categoria]}
        </span>
      </header>
      <ul className="divide-y divide-[#f0f0f0]">
        {grupo.contatos.map(([setor, texto]) => (
          <li
            key={`${setor}-${texto}`}
            className="flex flex-col gap-2 px-5 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
          >
            <span className="min-w-0 text-[14px] leading-[1.4] text-[#1a1a1a]/85">{setor}</span>
            <Numeros setor={setor} texto={texto} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function Numeros({ setor, texto }: { setor: string; texto: string }) {
  const numeros: Telefone[] = numerosDoTelefone(texto);
  if (numeros.length === 0) {
    return <span className="text-[14px] text-[#1a1a1a]/70">{texto}</span>;
  }
  return (
    <span className="flex shrink-0 flex-wrap gap-1.5 sm:justify-end">
      {numeros.map((n) => (
        <span
          key={n.tel}
          className="inline-flex items-stretch overflow-hidden rounded-[6px] border border-[#e5e5e5]"
        >
          <a
            href={`tel:${n.tel}`}
            aria-label={`Ligar para ${setor}: ${n.exibicao}`}
            className="px-2.5 py-1 text-[13px] font-semibold tabular-nums text-[#1a1a1a] transition-colors hover:bg-[#6E3AFF] hover:text-white"
          >
            {n.exibicao}
          </a>
          <button
            type="button"
            onClick={() => copiar(n.exibicao)}
            aria-label={`Copiar ${n.exibicao}`}
            title="Copiar número"
            className="border-l border-[#e5e5e5] px-2 text-[#1a1a1a]/45 transition-colors hover:bg-[#1a1a1a]/[0.05] hover:text-[#1a1a1a]"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
        </span>
      ))}
    </span>
  );
}
