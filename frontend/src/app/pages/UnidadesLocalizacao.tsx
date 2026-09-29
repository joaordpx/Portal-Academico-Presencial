import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  MapPin,
  Search,
  X,
  Map as MapIcon,
  Navigation,
  Clock,
  Phone,
  Mail,
  GraduationCap,
  Briefcase,
  Sparkles,
  Accessibility,
  Check,
  Minus,
  ArrowLeft,
  Info,
  FileText,
  Download,
  Maximize2,
} from "lucide-react";
import { PageHeader } from "../components/layout/PageHeader";
import { getLocais, getUnidades } from "../../services/localService";
import type { Local, LocalTipo, Unidade, HorarioFuncionamento } from "../../types";

const TABS = ["Campus Montes Claros", "Demais Unidades", "Organograma"] as const;
type Tab = (typeof TABS)[number];

const CAMPUS_ATUAL = "Campus Montes Claros";
const CAMPUS_COORD = { lat: -16.7183, lng: -43.867 };

const TIPOS: ("Todos" | LocalTipo)[] = [
  "Todos",
  "Salas de aula",
  "Administrativo",
  "Biblioteca",
  "Laboratório",
  "Alimentação",
  "Esportivo",
  "Serviço",
];

const TIPO_STYLE: Record<LocalTipo, string> = {
  "Salas de aula": "bg-[#6E3AFF]/12 text-[#6E3AFF]",
  Administrativo: "bg-[#2B6CFF]/12 text-[#2B6CFF]",
  Biblioteca: "bg-[#FFB800]/18 text-[#9a7000]",
  Laboratório: "bg-[#00B894]/14 text-[#0a7d68]",
  Alimentação: "bg-[#FF4D2E]/12 text-[#FF4D2E]",
  Esportivo: "bg-[#FF5C8A]/12 text-[#d63864]",
  Serviço: "bg-[#1a1a1a]/[0.07] text-[#1a1a1a]/65",
};

function mapsUrl(l: Local) {
  const destino = l.coordenadas
    ? `${l.coordenadas.lat},${l.coordenadas.lng}`
    : encodeURIComponent(`${l.nome} Unimontes Montes Claros`);
  return `https://www.google.com/maps/dir/?api=1&destination=${destino}`;
}

/** Lista de horários em texto: "Segunda a sexta, 08h às 17h" */
function Horarios({ horarios }: { horarios: HorarioFuncionamento[] }) {
  return (
    <>
      {horarios.map((h, i) => (
        <span key={i} className="block">
          {h.rotulo && <span className="font-semibold">{h.rotulo}: </span>}
          {h.dias}, {h.horas}
        </span>
      ))}
    </>
  );
}

export function UnidadesLocalizacao() {
  const [tab, setTab] = useState<Tab>("Campus Montes Claros");

  return (
    <>
      <PageHeader
        eyebrow="Unidades e Localização"
        title="Encontre-se no campus."
        description="Encontre mapas, prédios, setores, laboratórios e contatos das unidades da Unimontes."
        icon={MapPin}
      />

      <section className="sticky top-[125px] z-30 border-b border-[#e5e5e5] bg-white/95 backdrop-blur">
        <div className="mx-auto max-w-[1400px] px-6 py-3 lg:px-12">
          <div className="flex gap-1.5 overflow-x-auto">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`relative shrink-0 cursor-pointer whitespace-nowrap rounded-full px-5 py-2.5 text-[12.5px] font-bold uppercase tracking-[0.1em] transition-colors ${
                  tab === t
                    ? "text-white"
                    : "text-[#1a1a1a]/55 hover:bg-[#1a1a1a]/[0.05] hover:text-[#1a1a1a]"
                }`}
              >
                {tab === t && (
                  <motion.span
                    layoutId="unidades-tab"
                    className="absolute inset-0 rounded-full bg-[#1a1a1a]"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{t}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-[1400px] px-6 py-12 lg:px-12 lg:py-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
            >
              {tab === "Campus Montes Claros" && <CampusMontesClaros />}
              {tab === "Demais Unidades" && <DemaisUnidades />}
              {tab === "Organograma" && <Organograma />}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </>
  );
}

/* ───────────── Campus Montes Claros: Mapa | Contatos ───────────── */

function CampusMontesClaros() {
  const [sub, setSub] = useState<"mapa" | "contatos">("mapa");
  const [locais, setLocais] = useState<Local[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ativo = true;
    getLocais(CAMPUS_ATUAL)
      .then((d) => ativo && setLocais(d))
      .finally(() => ativo && setLoading(false));
    return () => {
      ativo = false;
    };
  }, []);

  return (
    <div>
      {/* Alternância Mapa / Contatos */}
      <div className="inline-flex gap-1 rounded-[8px] border border-[#e0e0e0] bg-[#fafafa] p-1">
        {(["mapa", "contatos"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setSub(s)}
            className={`relative cursor-pointer rounded-[6px] px-4 py-2 text-[13px] font-bold transition-colors ${
              sub === s ? "text-white" : "text-[#1a1a1a]/60 hover:text-[#1a1a1a]"
            }`}
          >
            {sub === s && (
              <motion.span
                layoutId="campus-sub"
                className="absolute inset-0 rounded-[6px] bg-[#1a1a1a]"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <span className="relative z-10">{s === "mapa" ? "Mapa" : "Contatos"}</span>
          </button>
        ))}
      </div>

      <div className="mt-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={sub}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            {sub === "mapa" ? (
              <Mapa locais={locais} loading={loading} />
            ) : (
              <Contatos locais={locais} loading={loading} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ───────────── Mapa + busca + legenda ───────────── */

function Mapa({ locais, loading }: { locais: Local[]; loading: boolean }) {
  const [q, setQ] = useState("");
  const [tipo, setTipo] = useState<"Todos" | LocalTipo>("Todos");
  const [selecionado, setSelecionado] = useState<string | null>(null);

  const filtrados = useMemo(() => {
    const termo = q.trim().toLowerCase();
    return locais.filter(
      (l) =>
        (tipo === "Todos" || l.tipo === tipo) &&
        (termo === "" ||
          l.nome.toLowerCase().includes(termo) ||
          l.descricao.toLowerCase().includes(termo) ||
          l.centro?.sigla.toLowerCase().includes(termo) ||
          l.centro?.nome.toLowerCase().includes(termo) ||
          l.cursosDoCentro.some((c) => c.toLowerCase().includes(termo)) ||
          l.setores.some((s) => s.toLowerCase().includes(termo)) ||
          l.servicos.some((s) => s.toLowerCase().includes(termo))),
    );
  }, [locais, q, tipo]);

  const atual = locais.find((l) => l.slug === selecionado) ?? null;

  return (
    <div>
      {/* Busca */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#1a1a1a]/55" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Onde fica...? Busque por prédio, centro, setor ou serviço (ex.: Secretaria, CCET, RU)"
          className="w-full rounded-[6px] border border-[#d4d4d4] bg-white py-3.5 pl-11 pr-10 text-[14.5px] text-[#1a1a1a] outline-none transition-colors placeholder:text-[#1a1a1a]/40 focus:border-[#6E3AFF]"
        />
        {q && (
          <button
            onClick={() => setQ("")}
            aria-label="Limpar busca"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-[#1a1a1a]/45 transition-colors hover:bg-[#1a1a1a]/[0.06] hover:text-[#1a1a1a]"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {TIPOS.map((t) => (
          <button
            key={t}
            onClick={() => setTipo(t)}
            aria-pressed={tipo === t}
            className={`cursor-pointer rounded-[6px] border px-3 py-1.5 text-[12.5px] font-semibold transition-colors ${
              tipo === t
                ? "border-[#6E3AFF] bg-[#6E3AFF] text-white"
                : "border-[#d4d4d4] bg-white text-[#1a1a1a]/70 hover:border-[#1a1a1a]/50 hover:text-[#1a1a1a]"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Mapa */}
        <div className="lg:col-span-7">
          <div className="lg:sticky lg:top-[210px]">
            <div className="relative flex aspect-[4/3] flex-col items-center justify-center overflow-hidden rounded-[12px] border border-[#e0e0e0] bg-[#fafafa]">
              <div
                aria-hidden
                className="absolute inset-0 opacity-[0.55]"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, #e8e8e8 1px, transparent 1px), linear-gradient(to bottom, #e8e8e8 1px, transparent 1px)",
                  backgroundSize: "32px 32px",
                }}
              />
              <div className="relative flex max-w-sm flex-col items-center px-6 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-[12px] bg-[#6E3AFF]/10 text-[#6E3AFF]">
                  <MapIcon className="h-7 w-7" />
                </span>
                <h3 className="mt-4 text-[18px] font-bold tracking-[-0.02em] text-[#1a1a1a]">
                  Mapa interativo do Campus Montes Claros
                </h3>
                <p className="mt-2 text-[13.5px] leading-[1.55] text-[#1a1a1a]/60">
                  Em desenvolvimento. Você poderá clicar em cada prédio para ver o que funciona
                  nele. Enquanto isso, use a busca acima ou abra o mapa externo.
                </p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${CAMPUS_COORD.lat},${CAMPUS_COORD.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 rounded-[6px] bg-[#1a1a1a] px-5 py-3 text-[12px] font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#6E3AFF]"
                >
                  <Navigation className="h-4 w-4" /> Abrir mapa do campus
                </a>
              </div>
            </div>

            <p className="mt-3 flex items-start gap-2 text-[12.5px] leading-[1.5] text-[#1a1a1a]/55">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              Horários e salas das suas aulas ficam na página do seu curso. Aqui você descobre onde
              fica cada prédio e como chegar.
            </p>
          </div>
        </div>

        {/* Lista ou detalhe */}
        <div className="lg:col-span-5">
          <div>
            <AnimatePresence mode="wait">
              {atual ? (
                <motion.div
                  key={atual.slug}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.2 }}
                  aria-live="polite"
                >
                  <button
                    onClick={() => setSelecionado(null)}
                    className="mb-3 inline-flex cursor-pointer items-center gap-2 text-[12px] font-bold uppercase tracking-[0.14em] text-[#1a1a1a]/60 transition-colors hover:text-[#6E3AFF]"
                  >
                    <ArrowLeft className="h-4 w-4" /> Todos os locais
                  </button>
                  <DetalheLocal local={atual} />
                </motion.div>
              ) : (
                <motion.div
                  key="lista"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="border-b border-[#e5e5e5] pb-3 text-[13px] text-[#1a1a1a]/60">
                    <span className="font-bold text-[#1a1a1a]">{filtrados.length}</span>{" "}
                    {filtrados.length === 1 ? "local encontrado" : "locais encontrados"}
                  </div>

                  {loading ? (
                    <div className="mt-4 space-y-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="h-16 animate-pulse rounded-[10px] bg-[#f0f0f0]" />
                      ))}
                    </div>
                  ) : filtrados.length === 0 ? (
                    <p className="py-10 text-center text-[14px] text-[#1a1a1a]/55">
                      Nenhum local encontrado.
                    </p>
                  ) : (
                    <ul className="mt-4 flex max-h-[560px] flex-col gap-2.5 overflow-y-auto pr-1">
                      {filtrados.map((l) => (
                        <li key={l.slug}>
                          <button
                            onClick={() => setSelecionado(l.slug)}
                            className="w-full cursor-pointer rounded-[10px] border border-[#e5e5e5] bg-white p-4 text-left transition-all hover:border-[#6E3AFF]/50 hover:bg-[#fafafa]"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <span className="text-[15.5px] font-bold tracking-[-0.01em] text-[#1a1a1a]">
                                {l.nome}
                                {l.centro && (
                                  <span className="ml-2 text-[13px] font-semibold text-[#6E3AFF]">
                                    {l.centro.sigla}
                                  </span>
                                )}
                              </span>
                              <span
                                className={`shrink-0 rounded-[4px] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] ${TIPO_STYLE[l.tipo]}`}
                              >
                                {l.tipo}
                              </span>
                            </div>
                            <p className="mt-1 text-[13px] leading-[1.5] text-[#1a1a1a]/60">
                              {l.descricao}
                            </p>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetalheLocal({ local }: { local: Local }) {
  return (
    <div className="overflow-hidden rounded-[12px] border border-[#e5e5e5]">
      <div className="border-b border-[#e5e5e5] bg-[#fafafa] p-5">
        <span
          className={`inline-flex rounded-[4px] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] ${TIPO_STYLE[local.tipo]}`}
        >
          {local.tipo}
        </span>
        <h2 className="mt-2 text-balance text-[21px] font-bold leading-[1.15] tracking-[-0.025em] text-[#1a1a1a]">
          {local.nome}
        </h2>
        {local.centro && (
          <p className="mt-1 text-[13.5px] font-semibold text-[#6E3AFF]">
            {local.centro.sigla} — {local.centro.nome}
          </p>
        )}
        <p className="mt-2 text-[13.5px] leading-[1.55] text-[#1a1a1a]/65">{local.descricao}</p>
      </div>

      <div className="space-y-5 p-5">
        {local.cursosDoCentro.length > 0 && (
          <Bloco icon={GraduationCap} titulo="Cursos deste centro">
            {local.cursosDoCentro.join(" · ")}
            <span className="mt-1 block text-[11.5px] text-[#1a1a1a]/45">
              As aulas podem ocorrer em outros prédios — confira o horário na página do curso.
            </span>
          </Bloco>
        )}
        {local.setores.length > 0 && (
          <Bloco icon={Briefcase} titulo="Setores">
            {local.setores.join(" · ")}
          </Bloco>
        )}
        {local.servicos.length > 0 && (
          <Bloco icon={Sparkles} titulo="Serviços">
            {local.servicos.join(" · ")}
          </Bloco>
        )}
        {local.localizacao && (
          <Bloco icon={MapPin} titulo="Localização">
            {local.localizacao}
          </Bloco>
        )}
        <Bloco icon={Clock} titulo="Horário de funcionamento">
          <Horarios horarios={local.horarios} />
        </Bloco>
        {local.contato.telefone && (
          <Bloco icon={Phone} titulo="Telefone">
            <a
              href={`tel:${local.contato.telefone.replace(/[^\d+]/g, "")}`}
              className="text-[#2563EB] hover:underline"
            >
              {local.contato.telefone}
            </a>
          </Bloco>
        )}
        {local.contato.email && (
          <Bloco icon={Mail} titulo="E-mail">
            <a href={`mailto:${local.contato.email}`} className="text-[#2563EB] hover:underline">
              {local.contato.email}
            </a>
          </Bloco>
        )}

        <div className="rounded-[10px] border border-[#e5e5e5] p-4">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#1a1a1a]/70">
            <Accessibility className="h-4 w-4 text-[#00B894]" />
            Acessibilidade
          </div>
          <ul className="mt-3 space-y-2">
            {(
              [
                ["Rampa de acesso", local.acessibilidade.rampa],
                ["Elevador", local.acessibilidade.elevador],
                ["Banheiro adaptado", local.acessibilidade.banheiroAdaptado],
                ["Piso tátil", local.acessibilidade.pisoTatil],
                ...(local.acessibilidade.vagaEspecial !== undefined
                  ? ([["Vaga especial", local.acessibilidade.vagaEspecial]] as [string, boolean][])
                  : []),
              ] as [string, boolean][]
            ).map(([label, tem]) => (
              <li
                key={label}
                className={`flex items-center gap-2 text-[12.5px] ${
                  tem ? "text-[#1a1a1a]/80" : "text-[#1a1a1a]/40"
                }`}
              >
                {tem ? (
                  <Check className="h-4 w-4 shrink-0 text-[#00B894]" />
                ) : (
                  <Minus className="h-4 w-4 shrink-0 text-[#1a1a1a]/25" />
                )}
                <span>
                  {label}
                  <span className="sr-only">{tem ? " disponível" : " não disponível"}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <a
          href={mapsUrl(local)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full items-center justify-center gap-2 rounded-[6px] bg-[#1a1a1a] px-5 py-3.5 text-[12px] font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#6E3AFF]"
        >
          <Navigation className="h-4 w-4" /> Como chegar
        </a>
      </div>
    </div>
  );
}

/* ───────────── Contatos do campus ───────────── */

function Contatos({ locais, loading }: { locais: Local[]; loading: boolean }) {
  const comContato = locais.filter((l) => l.contato.telefone || l.contato.email);

  return (
    <div>
      <h2 className="text-[24px] font-bold tracking-[-0.025em] text-[#1a1a1a]">
        Contatos — Campus Montes Claros
      </h2>
      <p className="mt-2 max-w-2xl text-[15px] leading-[1.6] text-[#1a1a1a]/65">
        Entre em contato com os principais setores e serviços do campus.
      </p>

      {loading ? (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-40 animate-pulse rounded-[12px] bg-[#f0f0f0]" />
          ))}
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {comContato.map((l) => (
            <div key={l.slug} className="rounded-[12px] border border-[#e5e5e5] bg-white p-5">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-[16.5px] font-bold tracking-[-0.015em] text-[#1a1a1a]">
                  {l.nome}
                </h3>
                <span
                  className={`shrink-0 rounded-[4px] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] ${TIPO_STYLE[l.tipo]}`}
                >
                  {l.tipo}
                </span>
              </div>

              <dl className="mt-3 space-y-1.5 text-[13px] text-[#1a1a1a]/70">
                {l.contato.telefone && (
                  <div className="flex items-start gap-2">
                    <Phone className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#1a1a1a]/40" />
                    <dd>
                      <a
                        href={`tel:${l.contato.telefone.replace(/[^\d+]/g, "")}`}
                        className="text-[#2563EB] hover:underline"
                      >
                        {l.contato.telefone}
                      </a>
                    </dd>
                  </div>
                )}
                {l.contato.email && (
                  <div className="flex items-start gap-2">
                    <Mail className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#1a1a1a]/40" />
                    <dd>
                      <a
                        href={`mailto:${l.contato.email}`}
                        className="break-all text-[#2563EB] hover:underline"
                      >
                        {l.contato.email}
                      </a>
                    </dd>
                  </div>
                )}
                {l.localizacao && (
                  <div className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#1a1a1a]/40" />
                    <dd>{l.localizacao}</dd>
                  </div>
                )}
                <div className="flex items-start gap-2">
                  <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#1a1a1a]/40" />
                  <dd>
                    <Horarios horarios={l.horarios} />
                  </dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ───────────── Demais Unidades ───────────── */

function DemaisUnidades() {
  const [unidades, setUnidades] = useState<Unidade[]>([]);
  const [q, setQ] = useState("");
  const [regiao, setRegiao] = useState("Todas");
  const [curso, setCurso] = useState("Todos");

  useEffect(() => {
    let ativo = true;
    getUnidades().then((d) => ativo && setUnidades(d));
    return () => {
      ativo = false;
    };
  }, []);

  const regioes = ["Todas", ...Array.from(new Set(unidades.map((u) => u.regiao ?? "—")))];
  const cursos = ["Todos", ...Array.from(new Set(unidades.flatMap((u) => u.cursos))).sort()];

  const filtradas = useMemo(() => {
    const termo = q.trim().toLowerCase();
    return unidades.filter(
      (u) =>
        (regiao === "Todas" || u.regiao === regiao) &&
        (curso === "Todos" || u.cursos.includes(curso)) &&
        (termo === "" ||
          u.nome.toLowerCase().includes(termo) ||
          u.cidade.toLowerCase().includes(termo)),
    );
  }, [unidades, q, regiao, curso]);

  return (
    <div>
      <h2 className="text-[24px] font-bold tracking-[-0.025em] text-[#1a1a1a]">
        Outras unidades da Unimontes
      </h2>

      {/* Filtros */}
      <div className="mt-6 grid grid-cols-1 gap-3 rounded-[10px] border border-[#e0e0e0] bg-[#fafafa] p-5 sm:grid-cols-3">
        <label className="block">
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#1a1a1a]/45">
            Buscar unidade
          </span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Digite o nome da unidade"
            className="mt-1.5 w-full rounded-[6px] border border-[#d4d4d4] bg-white px-3 py-2.5 text-[13.5px] text-[#1a1a1a] outline-none transition-colors placeholder:text-[#1a1a1a]/40 focus:border-[#6E3AFF]"
          />
        </label>
        <label className="block">
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#1a1a1a]/45">
            Filtrar por região
          </span>
          <select
            value={regiao}
            onChange={(e) => setRegiao(e.target.value)}
            className="mt-1.5 w-full cursor-pointer rounded-[6px] border border-[#d4d4d4] bg-white px-3 py-2.5 text-[13.5px] font-semibold text-[#1a1a1a] outline-none transition-colors focus:border-[#6E3AFF]"
          >
            {regioes.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#1a1a1a]/45">
            Filtrar por curso
          </span>
          <select
            value={curso}
            onChange={(e) => setCurso(e.target.value)}
            className="mt-1.5 w-full cursor-pointer rounded-[6px] border border-[#d4d4d4] bg-white px-3 py-2.5 text-[13.5px] font-semibold text-[#1a1a1a] outline-none transition-colors focus:border-[#6E3AFF]"
          >
            {cursos.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
      </div>

      {/* Unidades */}
      <div className="mt-6 space-y-4">
        {filtradas.map((u) => (
          <div key={u.slug} className="rounded-[12px] border border-[#e5e5e5] bg-white p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-[19px] font-bold tracking-[-0.02em] text-[#1a1a1a]">
                  {u.nome}
                </h3>
                <p className="text-[13px] text-[#1a1a1a]/55">{u.cidade}</p>
              </div>
              <a
                href={
                  u.mapsUrl ??
                  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `Unimontes ${u.cidade}`,
                  )}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-[6px] bg-[#1a1a1a] px-4 py-2.5 text-[11.5px] font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#6E3AFF]"
              >
                <Navigation className="h-3.5 w-3.5" /> Ver no mapa
              </a>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div>
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#1a1a1a]/60">
                  <GraduationCap className="h-3.5 w-3.5" /> Cursos ofertados
                </div>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {u.cursos.map((c) => (
                    <span
                      key={c}
                      className="rounded-[4px] bg-[#6E3AFF]/10 px-2 py-1 text-[11.5px] font-semibold text-[#6E3AFF]"
                    >
                      {c}
                    </span>
                  ))}
                </div>
                {u.endereco && (
                  <>
                    <div className="mt-5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#1a1a1a]/60">
                      <MapPin className="h-3.5 w-3.5" /> Localização
                    </div>
                    <p className="mt-2 text-[13px] leading-[1.5] text-[#1a1a1a]/70">{u.endereco}</p>
                  </>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#1a1a1a]/60">
                  <Phone className="h-3.5 w-3.5" /> Contato
                </div>
                <dl className="mt-2.5 space-y-1.5 text-[13px] text-[#1a1a1a]/70">
                  {u.contato.telefone && (
                    <dd>
                      <a
                        href={`tel:${u.contato.telefone.replace(/[^\d+]/g, "")}`}
                        className="text-[#2563EB] hover:underline"
                      >
                        {u.contato.telefone}
                      </a>
                    </dd>
                  )}
                  {u.contato.email && (
                    <dd>
                      <a
                        href={`mailto:${u.contato.email}`}
                        className="break-all text-[#2563EB] hover:underline"
                      >
                        {u.contato.email}
                      </a>
                    </dd>
                  )}
                </dl>

                <div className="mt-5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#1a1a1a]/60">
                  <Clock className="h-3.5 w-3.5" /> Horário
                </div>
                <p className="mt-2 text-[13px] leading-[1.5] text-[#1a1a1a]/70">
                  <Horarios horarios={u.horarios} />
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#1a1a1a]/60">
                  <Sparkles className="h-3.5 w-3.5" /> Serviços disponíveis
                </div>
                <ul className="mt-2.5 space-y-1 text-[13px] text-[#1a1a1a]/70">
                  {u.servicos.map((s) => (
                    <li key={s} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#1a1a1a]/30" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}

        {filtradas.length === 0 && (
          <p className="py-16 text-center text-[14px] text-[#1a1a1a]/55">
            Nenhuma unidade encontrada com esses filtros.
          </p>
        )}
      </div>

      {/* Mapa geral das unidades */}
      <div className="mt-8 rounded-[12px] border border-[#e5e5e5] p-6">
        <h3 className="text-[17px] font-bold tracking-[-0.02em] text-[#1a1a1a]">
          Mapa geral das unidades
        </h3>
        <div className="relative mt-4 flex aspect-[21/9] flex-col items-center justify-center overflow-hidden rounded-[10px] border border-[#e0e0e0] bg-[#fafafa]">
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.55]"
            style={{
              backgroundImage:
                "linear-gradient(to right, #e8e8e8 1px, transparent 1px), linear-gradient(to bottom, #e8e8e8 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          <div className="relative flex flex-col items-center px-6 text-center">
            <MapPin className="h-8 w-8 text-[#1a1a1a]/25" />
            <p className="mt-3 max-w-md text-[13.5px] leading-[1.55] text-[#1a1a1a]/60">
              Mapa com todas as unidades da Unimontes no Norte de Minas — em desenvolvimento.
            </p>
          </div>
        </div>
        <a
          href="https://www.google.com/maps/search/?api=1&query=Unimontes"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-[6px] border border-[#1a1a1a] px-5 py-3 text-[12px] font-bold uppercase tracking-[0.14em] text-[#1a1a1a] transition-colors hover:border-[#6E3AFF] hover:bg-[#6E3AFF] hover:text-white"
        >
          <Maximize2 className="h-4 w-4" /> Expandir mapa
        </a>
      </div>
    </div>
  );
}

/* ───────────── Organograma ───────────── */

const ESTRUTURA = [
  "Conselhos Superiores",
  "Reitoria e Vice-Reitoria",
  "Assessorias e órgãos de apoio",
  "Pró-Reitorias",
  "Centros de Ensino",
  "Diretorias",
  "Setores administrativos",
  "Setores acadêmicos",
];

function Organograma() {
  return (
    <div>
      <h2 className="text-[24px] font-bold tracking-[-0.025em] text-[#1a1a1a]">
        Organograma da Unimontes
      </h2>
      <p className="mt-2 max-w-3xl text-[15px] leading-[1.6] text-[#1a1a1a]/65">
        Conheça a estrutura organizacional da Universidade, incluindo conselhos, reitoria,
        pró-reitorias, centros de ensino, diretorias e setores de apoio acadêmico e administrativo.
      </p>

      {/* Estrutura geral */}
      <div className="mt-8 rounded-[12px] border border-[#e5e5e5] p-6">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#1a1a1a]/70">
          Estrutura geral da Universidade
        </h3>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {ESTRUTURA.map((item) => (
            <a
              key={item}
              href="#"
              className="group flex items-center justify-center rounded-[8px] border border-[#e5e5e5] bg-white px-4 py-4 text-center text-[13.5px] font-semibold text-[#1a1a1a] transition-all hover:-translate-y-0.5 hover:border-[#6E3AFF]/50 hover:shadow-[0_8px_22px_rgba(26,26,26,0.08)]"
            >
              {item}
            </a>
          ))}
        </div>
      </div>

      {/* Organograma completo */}
      <div className="mt-6 rounded-[12px] border border-[#e5e5e5] p-6">
        <h3 className="text-[17px] font-bold tracking-[-0.02em] text-[#1a1a1a]">
          Organograma completo
        </h3>
        <p className="mt-1.5 text-[14px] text-[#1a1a1a]/65">
          Consulte a estrutura completa da Universidade em formato oficial.
        </p>

        <div className="relative mt-5 flex aspect-[21/9] flex-col items-center justify-center overflow-hidden rounded-[10px] border border-[#e0e0e0] bg-[#fafafa]">
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.55]"
            style={{
              backgroundImage:
                "linear-gradient(to right, #e8e8e8 1px, transparent 1px), linear-gradient(to bottom, #e8e8e8 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          <div className="relative flex flex-col items-center px-6 text-center">
            <FileText className="h-8 w-8 text-[#1a1a1a]/25" />
            <p className="mt-3 text-[13.5px] text-[#1a1a1a]/60">
              Prévia do organograma oficial da Unimontes
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <a
            href="#"
            className="inline-flex items-center justify-center gap-2 rounded-[6px] bg-[#1a1a1a] px-5 py-3.5 text-[12px] font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#6E3AFF]"
          >
            Ver organograma completo
          </a>
          <a
            href="#"
            className="inline-flex items-center justify-center gap-2 rounded-[6px] border border-[#1a1a1a] px-5 py-3.5 text-[12px] font-bold uppercase tracking-[0.14em] text-[#1a1a1a] transition-colors hover:border-[#6E3AFF] hover:bg-[#6E3AFF] hover:text-white"
          >
            <Download className="h-4 w-4" /> Baixar PDF
          </a>
        </div>
      </div>

      {/* Links relacionados */}
      <div className="mt-8 border-t border-[#e5e5e5] pt-6">
        <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#1a1a1a]/70">
          Links relacionados
        </div>
        <div className="mt-3 flex flex-wrap gap-x-8 gap-y-2.5">
          {[
            { label: "Cursos", to: "/cursos" },
            { label: "Coordenações", to: "/cursos" },
            { label: "Serviços e Documentos", to: "/servicos-documentos" },
            { label: "Assistência Estudantil", to: "/assistencia-estudantil" },
            { label: "Ajuda e Suporte", to: "/contato" },
          ].map((l) => (
            <Link
              key={l.label}
              to={l.to}
              className="text-[13px] font-medium text-[#2563EB] hover:underline"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function Bloco({
  icon: Icon,
  titulo,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#6E3AFF]/10 text-[#6E3AFF]">
        <Icon className="h-3.5 w-3.5" />
      </span>
      <div className="min-w-0">
        <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#1a1a1a]/45">
          {titulo}
        </div>
        <div className="mt-0.5 text-[13.5px] leading-[1.5] text-[#1a1a1a]">{children}</div>
      </div>
    </div>
  );
}
