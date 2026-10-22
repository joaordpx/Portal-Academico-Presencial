import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import {
  Search,
  Monitor,
  GraduationCap,
  FileText,
  HeartHandshake,
  ClipboardList,
  CalendarHeart,
  CalendarDays,
  MapPin,
  Megaphone,
  Phone,
  IdCard,
  BookOpen,
  Building2,
  ScrollText,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import {
  ITENS_FIXOS,
  ROTULO_TIPO,
  buscar,
  criarSessaoBusca,
  getIndiceBusca,
  type IndiceBusca,
  type ItemBusca,
  type TipoBusca,
} from "../../../services/buscaService";

const ICONE_PAGINA: Record<string, typeof Search> = {
  graduacao: GraduationCap,
  livro: BookOpen,
  documento: FileText,
  prancheta: ClipboardList,
  calendario: CalendarHeart,
  apoio: HeartHandshake,
  megafone: Megaphone,
  mapa: MapPin,
  telefone: Phone,
  monitor: Monitor,
  carteirinha: IdCard,
};

const ICONE_TIPO: Record<TipoBusca, typeof Search> = {
  pagina: FileText,
  atalho: Monitor,
  curso: BookOpen,
  local: Building2,
  edital: ScrollText,
  evento: CalendarDays,
};

const iconeDe = (item: ItemBusca) =>
  (item.icone && ICONE_PAGINA[item.icone]) || ICONE_TIPO[item.tipo];

/** Sem digitar nada, a busca sugere as seções e atalhos do portal */
const SUGESTOES = ITENS_FIXOS;

export function SearchDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const [indice, setIndice] = useState<IndiceBusca | null>(null);
  // Uma sessão por montagem: decide quando uma busca entra nas estatísticas
  const [sessao] = useState(() => criarSessaoBusca());

  // Índice montado na primeira abertura (e de novo se algo tinha falhado)
  useEffect(() => {
    if (!open) return;
    let ativo = true;
    getIndiceBusca().then((ix) => ativo && setIndice(ix));
    return () => {
      ativo = false;
    };
  }, [open]);

  const termo = q.trim();

  // Grupos na ordem do resultado mais relevante; a navegação segue a ordem exibida
  const grupos = useMemo(() => {
    const resultados = termo
      ? buscar(indice ?? { itens: ITENS_FIXOS, falhas: 0 }, termo)
      : SUGESTOES;
    const mapa = new Map<TipoBusca, ItemBusca[]>();
    for (const r of resultados) mapa.set(r.tipo, [...(mapa.get(r.tipo) ?? []), r]);
    return Array.from(mapa, ([tipo, itens]) => ({ tipo, itens }));
  }, [indice, termo]);
  const exibidos = useMemo(() => grupos.flatMap((g) => g.itens), [grupos]);

  useEffect(() => {
    if (open) sessao.digitou(termo, exibidos.length);
  }, [open, termo, exibidos.length, sessao]);

  // Digitar reinicia a seleção (no próprio manipulador, sem efeito em cascata)
  function alterarBusca(valor: string) {
    setQ(valor);
    setActive(0);
  }

  const fechar = useCallback(() => {
    sessao.encerrou();
    setQ("");
    setActive(0);
    onOpenChange(false);
  }, [onOpenChange, sessao]);

  const abrir = useCallback(
    (item: ItemBusca) => {
      if (termo) sessao.clicou(termo, exibidos.length, item.tipo, exibidos.indexOf(item) + 1);
      if (item.to) navigate(item.to);
      else if (item.url) window.open(item.url, "_blank", "noopener,noreferrer");
      setQ("");
      setActive(0);
      onOpenChange(false);
    },
    [termo, exibidos, navigate, onOpenChange, sessao],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") fechar();
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((a) => Math.min(exibidos.length - 1, a + 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((a) => Math.max(0, a - 1));
      }
      if (e.key === "Enter") {
        const item = exibidos[active];
        if (item) abrir(item);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, exibidos, active, abrir, fechar]);

  const carregando = termo !== "" && indice === null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[10vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-[#1a1a1a]/40 backdrop-blur-[2px]"
            onClick={fechar}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Buscar no portal"
            initial={{ opacity: 0, y: -12, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.99 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full max-w-2xl overflow-hidden rounded-[4px] border border-[#1a1a1a]/15 bg-white"
          >
            <div className="flex items-center gap-3 border-b border-[#e5e5e5] px-5">
              <Search className="h-4 w-4 text-[#1a1a1a]/50" />
              <input
                autoFocus
                value={q}
                onChange={(e) => alterarBusca(e.target.value)}
                placeholder="Busque cursos, prédios, editais, eventos ou serviços..."
                aria-label="Termo de busca"
                className="h-16 w-full bg-transparent text-[15px] text-[#1a1a1a] placeholder:text-[#1a1a1a]/40 focus:outline-none"
              />
              <kbd className="hidden rounded-[3px] border border-[#e5e5e5] bg-[#fafafa] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#1a1a1a]/50 sm:inline">
                Esc
              </kbd>
            </div>

            <div className="max-h-[55vh] overflow-y-auto p-2" aria-live="polite">
              {exibidos.length === 0 ? (
                <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-[4px] border border-[#e5e5e5] text-[#6E3AFF]">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div className="mt-4 text-[15px] font-bold text-[#1a1a1a]">
                    {carregando ? "Buscando..." : `Nada encontrado para "${termo}"`}
                  </div>
                  {!carregando && (
                    <div className="mt-1 text-[13px] text-[#1a1a1a]/60">
                      Tente outra palavra, como "matrícula", "RU" ou o nome do seu curso.
                    </div>
                  )}
                </div>
              ) : (
                grupos.map((g) => (
                  <div key={g.tipo} className="mb-2">
                    <div className="px-3 pb-1 pt-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#1a1a1a]/40">
                      {termo
                        ? ROTULO_TIPO[g.tipo]
                        : g.tipo === "pagina"
                          ? "Seções"
                          : ROTULO_TIPO[g.tipo]}
                    </div>
                    {g.itens.map((item) => {
                      const Icon = iconeDe(item);
                      const idx = exibidos.indexOf(item);
                      const isActive = idx === active;
                      return (
                        <motion.button
                          key={item.id}
                          onMouseEnter={() => setActive(idx)}
                          onClick={() => abrir(item)}
                          whileTap={{ scale: 0.99 }}
                          className={`group flex w-full items-center gap-3 rounded-[4px] px-3 py-3 text-left transition-colors ${
                            isActive ? "bg-[#6E3AFF] text-white" : "hover:bg-[#fafafa]"
                          }`}
                        >
                          <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[4px] border transition-colors ${
                              isActive
                                ? "border-white/30 bg-white/10 text-white"
                                : "border-[#e5e5e5] text-[#1a1a1a]"
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div
                              className={`truncate text-[14px] font-semibold ${isActive ? "text-white" : "text-[#1a1a1a]"}`}
                            >
                              {item.titulo}
                            </div>
                            <div
                              className={`truncate text-[12px] ${isActive ? "text-white/70" : "text-[#1a1a1a]/55"}`}
                            >
                              {item.detalhe}
                            </div>
                          </div>
                          <div
                            className={`flex shrink-0 items-center gap-1 text-[10px] font-bold uppercase tracking-[0.14em] transition-opacity ${
                              isActive ? "text-white opacity-100" : "opacity-0"
                            }`}
                          >
                            {item.to ? (
                              "Abrir ↵"
                            ) : (
                              <>
                                Site oficial <ArrowUpRight className="h-3 w-3" />
                              </>
                            )}
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            <div className="flex items-center justify-between border-t border-[#e5e5e5] bg-[#fafafa] px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#1a1a1a]/50">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="rounded-[3px] border border-[#e5e5e5] bg-white px-1.5 py-0.5 font-bold">
                    ↑
                  </kbd>
                  <kbd className="rounded-[3px] border border-[#e5e5e5] bg-white px-1.5 py-0.5 font-bold">
                    ↓
                  </kbd>
                  navegar
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="rounded-[3px] border border-[#e5e5e5] bg-white px-1.5 py-0.5 font-bold">
                    ↵
                  </kbd>
                  abrir
                </span>
              </div>
              <div>
                {indice && indice.falhas > 0
                  ? "Parte do conteúdo não carregou"
                  : indice === null
                    ? "Carregando cursos e eventos..."
                    : "Unimontes"}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
