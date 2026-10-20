import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowUpRight,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  LayoutGrid,
  List as ListIcon,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { PageHeader } from "../components/layout/PageHeader";
import { Reveal } from "../components/shared/Reveal";
import { ImageWithFallback } from "../components/shared/ImageWithFallback";
import { getCursos } from "../../services/cursoService";
import type { CursoResumo } from "../../types";

const filters = {
  centro: ["Todos", "CCET", "CCSA", "CCBS", "CCH"],
  turno: ["Todos", "Integral", "Matutino", "Vespertino", "Noturno"],
  grau: ["Todos", "Bacharelado", "Licenciatura", "Técnico", "Tecnólogo", "Especialização"],
  area: [
    "Todas",
    "Ciências Agrárias",
    "Ciências Biológicas",
    "Ciências Sociais e Aplicadas",
    "Exatas e da Terra",
    "Ciências Humanas",
    "Ciências da Saúde",
    "Engenharias",
    "Linguística, Letras e Artes",
  ],
};

const sortOptions = [
  { id: "alfabetica", label: "Ordem Alfabética" },
  { id: "duracao-asc", label: "Menor Duração" },
  { id: "duracao-desc", label: "Maior Duração" },
] as const;

type SortId = (typeof sortOptions)[number]["id"];

const PAGE_SIZE = 8;

// Cada categoria de tag recebe uma cor da paleta do portal (roxo, verde, amarelo + apoios).
const tagStyles: Record<string, string> = {
  Bacharelado: "bg-[#00B894]/12 text-[#0a7d68]",
  Licenciatura: "bg-[#6E3AFF]/12 text-[#6E3AFF]",
  Técnico: "bg-[#2B6CFF]/12 text-[#2B6CFF]",
  Tecnólogo: "bg-[#FFB800]/18 text-[#9a7000]",
  Especialização: "bg-[#FF5C8A]/12 text-[#d63864]",
  Presencial: "bg-[#1a1a1a]/[0.06] text-[#1a1a1a]/65",
  EAD: "bg-[#6E3AFF]/12 text-[#6E3AFF]",
  Híbrido: "bg-[#FFB800]/18 text-[#9a7000]",
};

function Tag({ label }: { label: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-[4px] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em] ${
        tagStyles[label] ?? "bg-[#1a1a1a]/[0.06] text-[#1a1a1a]/65"
      }`}
    >
      {label}
    </span>
  );
}

export function Cursos() {
  const [courses, setCourses] = useState<CursoResumo[]>([]);
  const [loading, setLoading] = useState(true);
  const [centro, setCentro] = useState("Todos");
  const [turno, setTurno] = useState("Todos");
  const [grau, setGrau] = useState("Todos");
  const [area, setArea] = useState("Todas");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortId>("alfabetica");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    let ativo = true;
    getCursos()
      .then((data) => ativo && setCourses(data))
      .finally(() => ativo && setLoading(false));
    return () => {
      ativo = false;
    };
  }, []);

  const activeFilters = [centro, turno, grau, area].filter(
    (f) => f !== "Todos" && f !== "Todas",
  ).length;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const result = courses.filter(
      (c) =>
        (centro === "Todos" || c.centro === centro) &&
        (turno === "Todos" || c.turno === turno) &&
        (grau === "Todos" || c.grau === grau) &&
        (area === "Todas" || c.area === area) &&
        (q === "" || c.nome.toLowerCase().includes(q) || c.area.toLowerCase().includes(q)),
    );

    return [...result].sort((a, b) => {
      if (sort === "duracao-asc") return a.duracao - b.duracao;
      if (sort === "duracao-desc") return b.duracao - a.duracao;
      return a.nome.localeCompare(b.nome, "pt-BR");
    });
  }, [courses, centro, turno, grau, area, query, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // Qualquer mudança de filtro/busca volta para a primeira página.
  function resetTo(setter: (v: string) => void, value: string) {
    setter(value);
    setPage(1);
  }

  function clearAll() {
    setCentro("Todos");
    setTurno("Todos");
    setGrau("Todos");
    setArea("Todas");
    setQuery("");
    setPage(1);
  }

  return (
    <>
      <PageHeader
        eyebrow="Cursos"
        title="Cursos da Unimontes."
        description="Cursos de graduação presencial organizados por centros de ensino, áreas e turnos."
        icon={BookOpen}
      />

      <section className="bg-white">
        <div className="mx-auto max-w-[1400px] px-6 py-12 lg:px-12 lg:py-16">
          {/* Toolbar: filtrar + busca + ordenação */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <button
              onClick={() => setShowFilters((s) => !s)}
              className={`inline-flex shrink-0 items-center gap-2 rounded-[6px] border px-4 py-3 text-[13px] font-bold shadow-[0_1px_2px_rgba(16,24,40,0.06)] transition-colors ${
                showFilters || activeFilters > 0
                  ? "border-[#6E3AFF] bg-[#6E3AFF]/[0.06] text-[#6E3AFF]"
                  : "border-[#d4d4d4] bg-[#fafafa] text-[#1a1a1a] hover:border-[#1a1a1a] hover:bg-white"
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filtrar
              {activeFilters > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#6E3AFF] px-1.5 text-[10px] font-bold text-white">
                  {activeFilters}
                </span>
              )}
            </button>

            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#1a1a1a]/55" />
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Buscar curso por nome ou área..."
                className="w-full rounded-[6px] border border-[#d4d4d4] bg-white py-3 pl-11 pr-4 text-[14px] text-[#1a1a1a] outline-none transition-colors placeholder:text-[#1a1a1a]/40 focus:border-[#6E3AFF]"
              />
            </div>

            <div className="flex shrink-0 items-center gap-2.5">
              <span className="hidden text-[12px] font-semibold text-[#1a1a1a]/55 sm:inline">
                Organizar por:
              </span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortId)}
                className="cursor-pointer rounded-[6px] border border-[#d4d4d4] bg-white py-3 pl-3 pr-8 text-[13px] font-semibold text-[#1a1a1a] outline-none transition-colors focus:border-[#6E3AFF]"
              >
                {sortOptions.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Painel de filtros (expansível) */}
          <AnimatePresence initial={false}>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="mt-5 grid grid-cols-1 gap-6 rounded-[10px] border border-[#e0e0e0] bg-[#fafafa] p-6 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    {
                      label: "Centro de Ensino",
                      value: centro,
                      set: setCentro,
                      opts: filters.centro,
                    },
                    { label: "Turno", value: turno, set: setTurno, opts: filters.turno },
                    { label: "Grau", value: grau, set: setGrau, opts: filters.grau },
                    {
                      label: "Área do Conhecimento",
                      value: area,
                      set: setArea,
                      opts: filters.area,
                    },
                  ].map((f) => (
                    <div key={f.label}>
                      <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#1a1a1a]/70">
                        {f.label}
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {f.opts.map((o) => (
                          <button
                            key={o}
                            onClick={() => resetTo(f.set, o)}
                            className={`rounded-[6px] border px-3 py-1.5 text-[12px] font-semibold transition-colors ${
                              f.value === o
                                ? "border-[#6E3AFF] bg-[#6E3AFF] text-white"
                                : "border-[#e5e5e5] bg-white text-[#1a1a1a]/65 hover:border-[#1a1a1a]/40"
                            }`}
                          >
                            {o}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Linha de status: contagem + toggle de visualização */}
          <div className="mt-8 flex items-center justify-between border-b border-[#e5e5e5] pb-4">
            <div className="text-[13px] text-[#1a1a1a]/60">
              Exibindo <span className="font-bold text-[#1a1a1a]">{filtered.length}</span>{" "}
              {filtered.length === 1 ? "curso disponível" : "cursos disponíveis"}
              {activeFilters > 0 && (
                <button
                  onClick={clearAll}
                  className="ml-3 inline-flex items-center gap-1 text-[12px] font-bold text-[#6E3AFF] hover:underline"
                >
                  <X className="h-3 w-3" /> Limpar filtros
                </button>
              )}
            </div>

            <div className="flex items-center gap-1 rounded-[6px] border border-[#d4d4d4] p-1">
              <button
                onClick={() => setView("grid")}
                aria-label="Visualizar em grade"
                className={`flex h-8 w-8 items-center justify-center rounded-[4px] transition-colors ${
                  view === "grid"
                    ? "bg-[#6E3AFF] text-white"
                    : "text-[#1a1a1a]/60 hover:bg-[#1a1a1a]/[0.05] hover:text-[#1a1a1a]"
                }`}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setView("list")}
                aria-label="Visualizar em lista"
                className={`flex h-8 w-8 items-center justify-center rounded-[4px] transition-colors ${
                  view === "list"
                    ? "bg-[#6E3AFF] text-white"
                    : "text-[#1a1a1a]/60 hover:bg-[#1a1a1a]/[0.05] hover:text-[#1a1a1a]"
                }`}
              >
                <ListIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Resultados */}
          {loading ? (
            <div className="grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="overflow-hidden rounded-[10px] border border-[#e5e5e5]">
                  <div className="aspect-[16/10] w-full animate-pulse bg-[#f0f0f0]" />
                  <div className="space-y-3 p-5">
                    <div className="h-3 w-20 animate-pulse rounded bg-[#f0f0f0]" />
                    <div className="h-5 w-3/4 animate-pulse rounded bg-[#f0f0f0]" />
                    <div className="h-3 w-1/2 animate-pulse rounded bg-[#f0f0f0]" />
                  </div>
                </div>
              ))}
            </div>
          ) : paginated.length === 0 ? (
            <div className="py-24 text-center">
              <p className="text-[18px] font-bold text-[#1a1a1a]">Nenhum curso encontrado</p>
              <p className="mt-2 text-[14px] text-[#1a1a1a]/55">
                Ajuste os filtros ou tente outro termo de busca.
              </p>
              <button
                onClick={clearAll}
                className="mt-6 inline-flex items-center gap-1.5 rounded-[6px] border border-[#6E3AFF] px-4 py-2.5 text-[13px] font-bold text-[#6E3AFF] transition-colors hover:bg-[#6E3AFF] hover:text-white"
              >
                Limpar filtros
              </button>
            </div>
          ) : view === "grid" ? (
            <div className="mt-8 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {paginated.map((c, i) => (
                <Reveal key={c.slug} delay={(i % 4) * 0.05}>
                  <motion.div whileHover={{ y: -4 }} className="h-full">
                    <Link
                      to={`/cursos/${c.slug}`}
                      className="group flex h-full flex-col overflow-hidden rounded-[16px] border border-black/[0.06] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04),0_8px_24px_-12px_rgba(16,24,40,0.12)] transition-all duration-300 hover:border-[#6E3AFF]/30 hover:shadow-[0_2px_4px_rgba(16,24,40,0.04),0_20px_40px_-16px_rgba(110,58,255,0.28)]"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <ImageWithFallback
                          src={c.imagem}
                          alt={c.nome}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="flex flex-1 flex-col p-5">
                        <div className="flex flex-wrap gap-1.5">
                          <Tag label={c.grau} />
                          <Tag label={c.modalidade} />
                        </div>
                        <h3 className="mt-3 text-balance text-[18px] font-bold leading-[1.2] tracking-[-0.02em] text-[#1a1a1a]">
                          {c.nome}
                        </h3>
                        <dl className="mt-3 space-y-1 text-[12.5px] text-[#1a1a1a]/60">
                          <div className="flex gap-1.5">
                            <dt className="font-semibold">Turno:</dt>
                            <dd>{c.turno}</dd>
                          </div>
                          <div className="flex gap-1.5">
                            <dt className="font-semibold">Duração:</dt>
                            <dd>{c.duracao} semestres</dd>
                          </div>
                        </dl>
                        <span className="mt-4 inline-flex items-center gap-1.5 pt-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#1a1a1a] transition-colors group-hover:text-[#6E3AFF]">
                          Ver curso
                          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="mt-8 flex flex-col gap-3">
              {paginated.map((c, i) => (
                <Reveal key={c.slug} delay={(i % 6) * 0.04}>
                  <Link
                    to={`/cursos/${c.slug}`}
                    className="group flex items-center gap-5 overflow-hidden rounded-[16px] border border-black/[0.06] bg-white p-3 pr-5 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_8px_24px_-12px_rgba(16,24,40,0.10)] transition-all duration-300 hover:border-[#6E3AFF]/30 hover:shadow-[0_2px_4px_rgba(16,24,40,0.04),0_16px_32px_-16px_rgba(110,58,255,0.25)]"
                  >
                    <div className="h-24 w-32 shrink-0 overflow-hidden rounded-[12px]">
                      <ImageWithFallback
                        src={c.imagem}
                        alt={c.nome}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap gap-1.5">
                        <Tag label={c.grau} />
                        <Tag label={c.modalidade} />
                      </div>
                      <h3 className="mt-2 truncate text-[18px] font-bold tracking-[-0.02em] text-[#1a1a1a]">
                        {c.nome}
                      </h3>
                      <p className="mt-1 text-[12.5px] text-[#1a1a1a]/60">
                        {c.centro} · {c.campus} · {c.turno} · {c.duracao} semestres
                      </p>
                    </div>
                    <ArrowUpRight className="hidden h-5 w-5 shrink-0 text-[#1a1a1a]/30 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#6E3AFF] sm:block" />
                  </Link>
                </Reveal>
              ))}
            </div>
          )}

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-1.5">
              <PagerButton
                onClick={() => setPage(1)}
                disabled={currentPage === 1}
                ariaLabel="Primeira página"
              >
                <ChevronsLeft className="h-4 w-4" />
              </PagerButton>
              <PagerButton
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                ariaLabel="Página anterior"
              >
                <ChevronLeft className="h-4 w-4" />
              </PagerButton>

              {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`flex h-9 min-w-9 items-center justify-center rounded-[6px] px-3 text-[13px] font-bold transition-colors ${
                    p === currentPage
                      ? "bg-[#6E3AFF] text-white"
                      : "text-[#1a1a1a]/60 hover:bg-[#1a1a1a]/[0.05] hover:text-[#1a1a1a]"
                  }`}
                >
                  {p}
                </button>
              ))}

              <PagerButton
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                ariaLabel="Próxima página"
              >
                <ChevronRight className="h-4 w-4" />
              </PagerButton>
              <PagerButton
                onClick={() => setPage(totalPages)}
                disabled={currentPage === totalPages}
                ariaLabel="Última página"
              >
                <ChevronsRight className="h-4 w-4" />
              </PagerButton>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function PagerButton({
  children,
  onClick,
  disabled,
  ariaLabel,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled: boolean;
  ariaLabel: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className="flex h-9 w-9 items-center justify-center rounded-[6px] text-[#1a1a1a]/55 transition-colors hover:bg-[#1a1a1a]/[0.05] hover:text-[#1a1a1a] disabled:pointer-events-none disabled:opacity-30"
    >
      {children}
    </button>
  );
}
