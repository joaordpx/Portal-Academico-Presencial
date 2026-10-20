import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  ArrowUpRight,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  AlarmClock,
  X,
} from "lucide-react";
import { PageHeader } from "../components/layout/PageHeader";
import { Reveal } from "../components/shared/Reveal";
import { SectionLayout, PanelLinks } from "../components/layout/SectionLayout";
import { getEditais } from "../../services/editalService";
import type { Edital, EditalTipo } from "../../types";

const HOJE = new Date();
const PAGE_SIZE = 6;

/* Cores por tipo de edital — variação da paleta do portal */
const TIPO_STYLE: Record<EditalTipo, string> = {
  Monitoria: "bg-[#6E3AFF]/12 text-[#6E3AFF]",
  Extensão: "bg-[#00B894]/14 text-[#0a7d68]",
  Pesquisa: "bg-[#2B6CFF]/12 text-[#2B6CFF]",
  Estágio: "bg-[#FFB800]/18 text-[#9a7000]",
  Assistência: "bg-[#FF4D2E]/12 text-[#FF4D2E]",
  Mobilidade: "bg-[#FF5C8A]/12 text-[#d63864]",
};

function diasRestantes(prazoIso: string) {
  const prazo = new Date(prazoIso + "T23:59:59");
  return Math.ceil((prazo.getTime() - HOJE.getTime()) / 86_400_000);
}

function formatarData(iso: string) {
  const [a, m, d] = iso.split("-");
  return `${d}/${m}/${a}`;
}

function Tag({ label, className }: { label: string; className: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-[4px] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em] ${className}`}
    >
      {label}
    </span>
  );
}

function ListaEditais() {
  const [editais, setEditais] = useState<Edital[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("Todos");
  const [curso, setCurso] = useState("Todos");
  const [campus, setCampus] = useState("Todos");
  const [tipo, setTipo] = useState("Todos");
  const [page, setPage] = useState(1);

  useEffect(() => {
    let ativo = true;
    getEditais()
      .then((d) => ativo && setEditais(d))
      .finally(() => ativo && setLoading(false));
    return () => {
      ativo = false;
    };
  }, []);

  const opcoes = useMemo(() => {
    const unicos = (v: string[]) => Array.from(new Set(v));
    return {
      curso: ["Todos", ...unicos(editais.map((e) => e.curso))],
      campus: ["Todos", ...unicos(editais.map((e) => e.campus))],
      tipo: ["Todos", ...unicos(editais.map((e) => e.tipo))],
    };
  }, [editais]);

  const filtrados = useMemo(
    () =>
      editais.filter(
        (e) =>
          (status === "Todos" || e.status === status) &&
          (curso === "Todos" || e.curso === curso) &&
          (campus === "Todos" || e.campus === campus) &&
          (tipo === "Todos" || e.tipo === tipo),
      ),
    [editais, status, curso, campus, tipo],
  );

  const totalPages = Math.max(1, Math.ceil(filtrados.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginados = filtrados.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const ativos = [status, curso, campus, tipo].filter((f) => f !== "Todos").length;

  function limpar() {
    setStatus("Todos");
    setCurso("Todos");
    setCampus("Todos");
    setTipo("Todos");
    setPage(1);
  }

  const selects = [
    { label: "Curso", value: curso, set: setCurso, opts: opcoes.curso },
    { label: "Campus", value: campus, set: setCampus, opts: opcoes.campus },
    { label: "Tipo", value: tipo, set: setTipo, opts: opcoes.tipo },
  ];

  return (
    <div>
      <p className="max-w-2xl text-[17px] leading-[1.6] text-[#1a1a1a]/70">
        Consulte editais abertos, encerrados e filtre por curso, campus ou tipo.
      </p>

      {/* Filtros */}
      <div className="mt-8 rounded-[10px] border border-[#e5e5e5] bg-[#fafafa] p-6">
        <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#1a1a1a]/70">
          Filtros
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {["Todos", "Aberto", "Encerrado"].map((s) => (
            <button
              key={s}
              onClick={() => {
                setStatus(s);
                setPage(1);
              }}
              className={`rounded-[6px] border px-3.5 py-2 text-[12.5px] font-semibold transition-colors ${
                status === s
                  ? "border-[#6E3AFF] bg-[#6E3AFF] text-white"
                  : "border-[#e5e5e5] bg-white text-[#1a1a1a]/65 hover:border-[#1a1a1a]/40"
              }`}
            >
              {s === "Todos" ? "Todos os editais" : `Editais ${s}s`}
            </button>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {selects.map((s) => (
            <label key={s.label} className="block">
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#1a1a1a]/45">
                {s.label}
              </span>
              <select
                value={s.value}
                onChange={(e) => {
                  s.set(e.target.value);
                  setPage(1);
                }}
                className="mt-1.5 w-full cursor-pointer rounded-[6px] border border-[#e5e5e5] bg-white px-3 py-2.5 text-[13px] font-semibold text-[#1a1a1a] outline-none transition-colors focus:border-[#6E3AFF]"
              >
                {s.opts.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>

        {ativos > 0 && (
          <button
            onClick={limpar}
            className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-bold text-[#6E3AFF] hover:underline"
          >
            <X className="h-3.5 w-3.5" /> Limpar filtros ({ativos})
          </button>
        )}
      </div>

      {/* Contagem */}
      <div className="mt-8 flex items-center justify-between border-b border-[#e5e5e5] pb-4 text-[13px] text-[#1a1a1a]/60">
        <span>
          <span className="font-bold text-[#1a1a1a]">{filtrados.length}</span>{" "}
          {filtrados.length === 1 ? "edital encontrado" : "editais encontrados"}
        </span>
      </div>

      {/* Cards */}
      {loading ? (
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-52 animate-pulse rounded-[10px] bg-[#f0f0f0]" />
          ))}
        </div>
      ) : paginados.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-[18px] font-bold text-[#1a1a1a]">Nenhum edital encontrado</p>
          <p className="mt-2 text-[14px] text-[#1a1a1a]/55">
            Ajuste os filtros para ver mais resultados.
          </p>
          <button
            onClick={limpar}
            className="mt-6 inline-flex items-center gap-1.5 rounded-[6px] border border-[#6E3AFF] px-4 py-2.5 text-[13px] font-bold text-[#6E3AFF] transition-colors hover:bg-[#6E3AFF] hover:text-white"
          >
            Limpar filtros
          </button>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {paginados.map((e, i) => {
            const dias = diasRestantes(e.prazo);
            const aberto = e.status === "Aberto";
            const urgente = aberto && dias >= 0 && dias <= 7;

            return (
              <Reveal key={e.id} delay={(i % 4) * 0.05}>
                <motion.article whileHover={{ y: -3 }} className="h-full">
                  <div className="flex h-full flex-col rounded-[10px] border border-[#e5e5e5] bg-white p-6 transition-all duration-200 hover:border-[#6E3AFF]/50 hover:shadow-[0_10px_28px_rgba(110,58,255,0.12)]">
                    <div className="flex flex-wrap gap-1.5">
                      <Tag
                        label={e.status}
                        className={
                          aberto
                            ? "bg-[#00B894]/14 text-[#0a7d68]"
                            : "bg-[#1a1a1a]/[0.07] text-[#1a1a1a]/55"
                        }
                      />
                      <Tag label={e.tipo} className={TIPO_STYLE[e.tipo]} />
                      <Tag label={e.campus} className="bg-[#1a1a1a]/[0.06] text-[#1a1a1a]/60" />
                    </div>

                    <h3 className="mt-3.5 text-balance text-[19px] font-bold leading-[1.2] tracking-[-0.02em] text-[#1a1a1a]">
                      {e.titulo}
                    </h3>

                    <dl className="mt-4 flex-1 space-y-1.5 text-[13px]">
                      <div className="flex gap-2">
                        <dt className="font-bold text-[#1a1a1a]/70">Curso:</dt>
                        <dd className="text-[#1a1a1a]/60">{e.curso}</dd>
                      </div>
                      <div className="flex gap-2">
                        <dt className="font-bold text-[#1a1a1a]/70">Campus:</dt>
                        <dd className="text-[#1a1a1a]/60">{e.campus}</dd>
                      </div>
                      <div className="flex items-center gap-2">
                        <dt className="font-bold text-[#1a1a1a]/70">Prazo:</dt>
                        <dd className={urgente ? "font-bold text-[#FF4D2E]" : "text-[#1a1a1a]/60"}>
                          {formatarData(e.prazo)}
                        </dd>
                        {urgente && (
                          <span className="inline-flex items-center gap-1 rounded-[4px] bg-[#FF4D2E]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-[#FF4D2E]">
                            <AlarmClock className="h-3 w-3" />
                            {dias === 0 ? "Último dia" : `${dias} dia${dias > 1 ? "s" : ""}`}
                          </span>
                        )}
                      </div>
                    </dl>

                    <a
                      href={e.url ?? "#"}
                      className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-[6px] border border-[#1a1a1a] px-4 py-2.5 text-[12px] font-bold uppercase tracking-[0.12em] text-[#1a1a1a] transition-colors hover:border-[#6E3AFF] hover:bg-[#6E3AFF] hover:text-white"
                    >
                      Ver edital <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </motion.article>
              </Reveal>
            );
          })}
        </div>
      )}

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-1.5">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex h-9 items-center gap-1.5 rounded-[6px] px-3 text-[12px] font-bold text-[#1a1a1a]/60 transition-colors hover:bg-[#1a1a1a]/[0.05] hover:text-[#1a1a1a] disabled:pointer-events-none disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" /> Anterior
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
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
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="flex h-9 items-center gap-1.5 rounded-[6px] px-3 text-[12px] font-bold text-[#1a1a1a]/60 transition-colors hover:bg-[#1a1a1a]/[0.05] hover:text-[#1a1a1a] disabled:pointer-events-none disabled:opacity-30"
          >
            Próxima <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

const sections = [
  { id: "editais", label: "Editais", content: <ListaEditais /> },
  {
    id: "estagios",
    label: "Estágios",
    content: (
      <PanelLinks
        accent="roxo"
        intro="Oportunidades e informações para estágio acadêmico."
        links={[
          { label: "Vagas" },
          { label: "Documentos" },
          { label: "Regulamentos" },
          { label: "Convênios" },
          { label: "Contatos" },
        ]}
      />
    ),
  },
  {
    id: "bolsas",
    label: "Bolsas e Monitoria",
    content: (
      <PanelLinks
        accent="roxo"
        intro="Acompanhe oportunidades de apoio acadêmico e participação em programas."
        links={[
          { label: "Monitoria" },
          { label: "Iniciação Científica" },
          { label: "Extensão" },
          { label: "Assistência Estudantil" },
        ]}
      />
    ),
  },
  {
    id: "pesquisa",
    label: "Pesquisa e Extensão",
    content: (
      <PanelLinks
        accent="roxo"
        intro="Programas e projetos ligados à produção acadêmica e à atuação extensionista."
        links={[{ label: "Programas" }, { label: "Projetos" }, { label: "Sistemas Relacionados" }]}
      />
    ),
  },
];

const sidebarRelated = [
  { label: "Cursos", to: "/cursos" },
  { label: "Documentos e Requerimentos", to: "/servicos-documentos" },
  { label: "Assistência Estudantil", to: "/assistencia-estudantil" },
  { label: "Ajuda e Suporte", to: "/contato" },
  { label: "Calendário Acadêmico", to: "/vida-academica" },
];

export function Editais() {
  return (
    <>
      <PageHeader
        eyebrow="Editais e Oportunidades"
        title="Editais, bolsas, estágios e oportunidades."
        description="Esta seção reúne oportunidades acadêmicas com prazos, filtros e agrupamentos por tema, curso e campus."
        icon={ClipboardList}
        accent="roxo"
      />
      <SectionLayout
        accent="roxo"
        sidebarTitle="Menu"
        sidebarRelated={sidebarRelated}
        sections={sections}
        related={[]}
      />
    </>
  );
}
