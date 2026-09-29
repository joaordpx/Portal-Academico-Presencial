import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  CalendarHeart,
  MapPin,
  Clock,
  Calendar,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  SlidersHorizontal,
  LayoutGrid,
  List as ListIcon,
} from "lucide-react";
import { PageHeader } from "../components/layout/PageHeader";
import { Reveal } from "../components/shared/Reveal";
import { ImageWithFallback } from "../components/shared/ImageWithFallback";
import { getEventos } from "../../services/eventoService";
import { formatarDataSemana, mesAbreviado, partesData, diasAte } from "../../utils/data";
import type { Evento, EventoTipo } from "../../types";

const PAGE_SIZE = 9;

/* Cada tipo tem sua cor — acento semântico sobre a base roxa do portal */
const TIPO: Record<EventoTipo, string> = {
  Acadêmico: "bg-[#6E3AFF]/12 text-[#6E3AFF]",
  Cultural: "bg-[#FF4D2E]/12 text-[#FF4D2E]",
  Comunitário: "bg-[#00B894]/14 text-[#0a7d68]",
};

const sortOptions = [
  { id: "data-asc", label: "Data — mais próximos" },
  { id: "data-desc", label: "Data — mais distantes" },
  { id: "alfabetica", label: "Ordem alfabética" },
] as const;

type SortId = (typeof sortOptions)[number]["id"];

/** Marcador de data em fita, com recorte na base */
function BadgeData({ iso, small = false }: { iso: string; small?: boolean }) {
  const { dia } = partesData(iso);
  return (
    <div
      className={`flex flex-col items-center bg-[#5B2FD1] text-white shadow-[0_4px_14px_-2px_rgba(0,0,0,0.35)] ${
        small ? "w-[48px] px-2 pb-4 pt-2" : "w-[62px] px-2 pb-6 pt-3"
      }`}
      style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 78%, 0 100%)" }}
    >
      <span
        className={`font-bold leading-none tracking-[-0.045em] ${small ? "text-[24px]" : "text-[32px]"}`}
      >
        {dia}
      </span>
      <span
        className={`mt-1 font-bold uppercase tracking-[0.14em] text-white/80 ${
          small ? "text-[9px]" : "text-[10px]"
        }`}
      >
        {mesAbreviado(iso).replace(".", "")}
      </span>
    </div>
  );
}

/** Selo de urgência (hoje / faltam N dias) */
function SeloPrazo({ dias }: { dias: number }) {
  if (dias < 0 || dias > 7) return null;
  return (
    <span className="inline-flex items-center gap-1 rounded-[4px] bg-[#FF4D2E]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.06em] text-[#FF4D2E]">
      {dias === 0 ? "Hoje" : `Em ${dias} dia${dias > 1 ? "s" : ""}`}
    </span>
  );
}

export function Eventos() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [tipo, setTipo] = useState("Todos");
  const [campus, setCampus] = useState("Todos");
  const [periodo, setPeriodo] = useState("Todos");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<SortId>("data-asc");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    let ativo = true;
    getEventos()
      .then((d) => ativo && setEventos(d))
      .finally(() => ativo && setLoading(false));
    return () => {
      ativo = false;
    };
  }, []);

  const filtros = useMemo(
    () => ({
      tipo: ["Todos", "Acadêmico", "Cultural", "Comunitário"],
      campus: ["Todos", ...Array.from(new Set(eventos.map((e) => e.campus)))],
      periodo: ["Todos", "Próximos 7 dias", "Próximos 30 dias", "Já realizados"],
    }),
    [eventos],
  );

  const activeFilters = [tipo, campus, periodo].filter((f) => f !== "Todos").length;

  const filtrados = useMemo(() => {
    const termo = q.trim().toLowerCase();
    const resultado = eventos.filter((e) => {
      const dias = diasAte(e.data);
      const casaPeriodo =
        periodo === "Todos" ||
        (periodo === "Próximos 7 dias" && dias >= 0 && dias <= 7) ||
        (periodo === "Próximos 30 dias" && dias >= 0 && dias <= 30) ||
        (periodo === "Já realizados" && dias < 0);

      return (
        (tipo === "Todos" || e.tipo === tipo) &&
        (campus === "Todos" || e.campus === campus) &&
        casaPeriodo &&
        (termo === "" ||
          e.titulo.toLowerCase().includes(termo) ||
          e.descricao.toLowerCase().includes(termo) ||
          e.local.toLowerCase().includes(termo))
      );
    });

    return [...resultado].sort((a, b) => {
      if (sort === "alfabetica") return a.titulo.localeCompare(b.titulo, "pt-BR");
      if (sort === "data-desc") return b.data.localeCompare(a.data);
      return a.data.localeCompare(b.data);
    });
  }, [eventos, tipo, campus, periodo, q, sort]);

  const totalPages = Math.max(1, Math.ceil(filtrados.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginados = filtrados.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function aplicar(setter: (v: string) => void, valor: string) {
    setter(valor);
    setPage(1);
  }

  function limpar() {
    setTipo("Todos");
    setCampus("Todos");
    setPeriodo("Todos");
    setQ("");
    setPage(1);
  }

  return (
    <>
      <PageHeader
        eyebrow="Eventos"
        title="Eventos da Unimontes."
        description="Eventos acadêmicos, culturais e comunitários abertos à comunidade universitária."
        icon={CalendarHeart}
      />

      <section className="bg-white">
        <div className="mx-auto max-w-[1400px] px-6 py-12 lg:px-12 lg:py-16">
          {/* Toolbar: filtrar + busca + organizar */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <button
              onClick={() => setShowFilters((s) => !s)}
              className={`inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-[6px] border px-4 py-3 text-[13px] font-bold shadow-[0_1px_2px_rgba(16,24,40,0.06)] transition-colors ${
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
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setPage(1);
                }}
                placeholder="Buscar evento por nome, descrição ou local..."
                className="w-full rounded-[6px] border border-[#d4d4d4] bg-white py-3 pl-11 pr-10 text-[14px] text-[#1a1a1a] outline-none transition-colors placeholder:text-[#1a1a1a]/40 focus:border-[#6E3AFF]"
              />
              {q && (
                <button
                  onClick={() => setQ("")}
                  aria-label="Limpar busca"
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-[#1a1a1a]/40 transition-colors hover:bg-[#1a1a1a]/[0.06] hover:text-[#1a1a1a]"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
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

          {/* Painel de filtros */}
          <AnimatePresence initial={false}>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="mt-5 grid grid-cols-1 gap-6 rounded-[10px] border border-[#e0e0e0] bg-[#fafafa] p-6 sm:grid-cols-3">
                  {[
                    { label: "Tipo de evento", value: tipo, set: setTipo, opts: filtros.tipo },
                    { label: "Campus", value: campus, set: setCampus, opts: filtros.campus },
                    { label: "Período", value: periodo, set: setPeriodo, opts: filtros.periodo },
                  ].map((f) => (
                    <div key={f.label}>
                      <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#1a1a1a]/70">
                        {f.label}
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {f.opts.map((o) => (
                          <button
                            key={o}
                            onClick={() => aplicar(f.set, o)}
                            className={`cursor-pointer rounded-[6px] border px-3 py-1.5 text-[12px] font-semibold transition-colors ${
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

          {/* Resultados + alternância de visualização */}
          <div className="mt-8 flex items-center justify-between border-b border-[#e5e5e5] pb-4">
            <div className="text-[13px] text-[#1a1a1a]/60">
              <span className="font-bold text-[#1a1a1a]">{filtrados.length}</span>{" "}
              {filtrados.length === 1 ? "evento encontrado" : "eventos encontrados"}
              {q && <span> para "{q}"</span>}
              {(activeFilters > 0 || q) && (
                <button
                  onClick={limpar}
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
                className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-[4px] transition-colors ${
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
                className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-[4px] transition-colors ${
                  view === "list"
                    ? "bg-[#6E3AFF] text-white"
                    : "text-[#1a1a1a]/60 hover:bg-[#1a1a1a]/[0.05] hover:text-[#1a1a1a]"
                }`}
              >
                <ListIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Conteúdo */}
          {loading ? (
            <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="overflow-hidden rounded-[10px] border border-[#e5e5e5]">
                  <div className="aspect-[16/9] animate-pulse bg-[#f0f0f0]" />
                  <div className="space-y-3 p-5">
                    <div className="h-5 w-3/4 animate-pulse rounded bg-[#f0f0f0]" />
                    <div className="h-3 w-full animate-pulse rounded bg-[#f0f0f0]" />
                  </div>
                </div>
              ))}
            </div>
          ) : paginados.length === 0 ? (
            <div className="py-24 text-center">
              <p className="text-[18px] font-bold text-[#1a1a1a]">Nenhum evento encontrado</p>
              <p className="mt-2 text-[14px] text-[#1a1a1a]/55">
                Ajuste os filtros ou tente outro termo de busca.
              </p>
              <button
                onClick={limpar}
                className="mt-6 inline-flex cursor-pointer items-center gap-1.5 rounded-[6px] border border-[#6E3AFF] px-4 py-2.5 text-[13px] font-bold text-[#6E3AFF] transition-colors hover:bg-[#6E3AFF] hover:text-white"
              >
                Limpar filtros
              </button>
            </div>
          ) : view === "grid" ? (
            /* ── Grade ── */
            <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {paginados.map((e, i) => (
                <Reveal key={e.id} delay={(i % 3) * 0.05}>
                  <motion.article whileHover={{ y: -4 }} className="h-full">
                    <Link
                      to={`/eventos/${e.slug}`}
                      className="group flex h-full flex-col overflow-hidden rounded-[16px] border border-black/[0.06] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04),0_8px_24px_-12px_rgba(16,24,40,0.12)] transition-all duration-300 hover:border-[#6E3AFF]/30 hover:shadow-[0_2px_4px_rgba(16,24,40,0.04),0_20px_40px_-16px_rgba(110,58,255,0.28)]"
                    >
                      <div className="relative aspect-[16/9] overflow-hidden">
                        <ImageWithFallback
                          src={e.imagem}
                          alt={e.titulo}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute left-4 top-0">
                          <BadgeData iso={e.data} />
                        </div>
                      </div>

                      <div className="flex flex-1 flex-col p-5">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span
                            className={`inline-flex items-center rounded-[4px] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] ${TIPO[e.tipo]}`}
                          >
                            {e.tipo}
                          </span>
                          <SeloPrazo dias={diasAte(e.data)} />
                        </div>

                        <h3 className="mt-2.5 text-balance text-[16px] font-bold leading-[1.3] tracking-[-0.015em] text-[#1a1a1a]">
                          {e.titulo}
                        </h3>
                        <p className="mt-2 flex-1 text-[13px] leading-[1.55] text-[#1a1a1a]/60">
                          {e.descricao}
                        </p>

                        <dl className="mt-4 space-y-1.5 border-t border-[#e5e5e5] pt-3.5 text-[12.5px] text-[#1a1a1a]/70">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3.5 w-3.5 shrink-0 text-[#6E3AFF]" />
                            <dd>{formatarDataSemana(e.data)}</dd>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-3.5 w-3.5 shrink-0 text-[#6E3AFF]" />
                            <dd>{e.horario}</dd>
                          </div>
                          <div className="flex items-start gap-2">
                            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#6E3AFF]" />
                            <dd>
                              {e.local}
                              <span className="block text-[#1a1a1a]/50">{e.campus}</span>
                            </dd>
                          </div>
                        </dl>
                      </div>
                    </Link>
                  </motion.article>
                </Reveal>
              ))}
            </div>
          ) : (
            /* ── Lista ── */
            <div className="mt-8 flex flex-col gap-3">
              {paginados.map((e, i) => (
                <Reveal key={e.id} delay={(i % 6) * 0.04}>
                  <Link
                    to={`/eventos/${e.slug}`}
                    className="group flex items-stretch gap-5 overflow-hidden rounded-[16px] border border-black/[0.06] bg-white p-3 pr-5 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_8px_24px_-12px_rgba(16,24,40,0.10)] transition-all duration-300 hover:border-[#6E3AFF]/30 hover:shadow-[0_2px_4px_rgba(16,24,40,0.04),0_16px_32px_-16px_rgba(110,58,255,0.25)]"
                  >
                    <div className="relative h-[112px] w-[160px] shrink-0 overflow-hidden rounded-[12px]">
                      <ImageWithFallback
                        src={e.imagem}
                        alt={e.titulo}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute left-2.5 top-0">
                        <BadgeData iso={e.data} small />
                      </div>
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col justify-center gap-1.5">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span
                          className={`inline-flex items-center rounded-[4px] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] ${TIPO[e.tipo]}`}
                        >
                          {e.tipo}
                        </span>
                        <SeloPrazo dias={diasAte(e.data)} />
                      </div>
                      <h3 className="truncate text-[17px] font-bold tracking-[-0.015em] text-[#1a1a1a]">
                        {e.titulo}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[12.5px] text-[#1a1a1a]/70">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 shrink-0 text-[#6E3AFF]" />
                          {formatarDataSemana(e.data)}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 shrink-0 text-[#6E3AFF]" />
                          {e.horario}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 shrink-0 text-[#6E3AFF]" />
                          {e.local} · {e.campus}
                        </span>
                      </div>
                    </div>
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

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`flex h-9 min-w-9 cursor-pointer items-center justify-center rounded-[6px] px-3 text-[13px] font-bold transition-colors ${
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
      className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-[6px] text-[#1a1a1a]/55 transition-colors hover:bg-[#1a1a1a]/[0.05] hover:text-[#1a1a1a] disabled:pointer-events-none disabled:opacity-30"
    >
      {children}
    </button>
  );
}
