import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import {
  ArrowUpRight,
  BookOpen,
  Building2,
  CalendarDays,
  CircleHelp,
  FileText,
  Link2,
  MapPin,
  ScrollText,
  Search,
  Sparkles,
  Tag,
} from "lucide-react";
import {
  ROTULO_TIPO,
  buscar,
  criarSessaoBusca,
  getIndiceBusca,
  type IndiceBusca,
  type ItemBusca,
  type TipoBusca,
} from "../../../services/buscaService";

const ICONE_TIPO: Record<TipoBusca, typeof Search> = {
  link: Link2,
  secao: FileText,
  pergunta: CircleHelp,
  sigla: Tag,
  curso: BookOpen,
  local: Building2,
  campus: MapPin,
  edital: ScrollText,
  evento: CalendarDays,
};

const EXEMPLOS = ["calendário", "matrícula", "RU", "estágio", "o nome do seu curso"];

/**
 * Janela da busca global. É montada só enquanto está aberta: cada abertura
 * começa do zero (ou com `termoInicial`, vindo das caixas de busca das páginas).
 */
export function SearchDialog({
  termoInicial = "",
  onClose,
}: {
  termoInicial?: string;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const [q, setQ] = useState(termoInicial);
  const [active, setActive] = useState(0);
  const [indice, setIndice] = useState<IndiceBusca | null>(null);
  // Decide quando uma busca entra nas estatísticas (ver criarSessaoBusca)
  const [sessao] = useState(() => criarSessaoBusca());

  useEffect(() => {
    let ativo = true;
    getIndiceBusca().then((ix) => ativo && setIndice(ix));
    return () => {
      ativo = false;
    };
  }, []);

  const termo = q.trim();
  const resultados = useMemo(() => (termo && indice ? buscar(indice, termo) : []), [indice, termo]);

  // Grupos na ordem do resultado mais relevante; a navegação segue a ordem exibida
  const grupos = useMemo(() => {
    const mapa = new Map<TipoBusca, ItemBusca[]>();
    for (const r of resultados) mapa.set(r.tipo, [...(mapa.get(r.tipo) ?? []), r]);
    return Array.from(mapa, ([tipo, itens]) => ({ tipo, itens }));
  }, [resultados]);
  const exibidos = useMemo(() => grupos.flatMap((g) => g.itens), [grupos]);

  useEffect(() => {
    if (indice) sessao.digitou(termo, exibidos.length);
  }, [indice, termo, exibidos.length, sessao]);

  function alterarBusca(valor: string) {
    setQ(valor);
    setActive(0);
  }

  const fechar = useCallback(() => {
    sessao.encerrou();
    onClose();
  }, [onClose, sessao]);

  const abrir = useCallback(
    (item: ItemBusca) => {
      if (termo) sessao.clicou(termo, exibidos.length, item.tipo, exibidos.indexOf(item) + 1);
      onClose();
      if (item.to) navigate(item.to);
      else if (item.url) window.open(item.url, "_blank", "noopener,noreferrer");
    },
    [termo, exibidos, navigate, onClose, sessao],
  );

  useEffect(() => {
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
  }, [exibidos, active, abrir, fechar]);

  const carregando = indice === null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[10vh]">
      {/* Fundo escurecido sem desfoque: o blur em tela cheia pesa em computadores mais simples */}
      <div className="absolute inset-0 bg-[#1a1a1a]/50" onClick={fechar} aria-hidden="true" />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Buscar no portal"
        className="relative z-10 w-full max-w-2xl overflow-hidden rounded-[4px] border border-[#1a1a1a]/15 bg-white shadow-2xl animate-in fade-in-0 slide-in-from-top-2 duration-150 motion-reduce:animate-none"
      >
        <div className="flex items-center gap-3 border-b border-[#e5e5e5] px-5">
          <Search className="h-4 w-4 shrink-0 text-[#1a1a1a]/50" />
          <input
            autoFocus
            value={q}
            onChange={(e) => alterarBusca(e.target.value)}
            placeholder="O que você procura?"
            aria-label="Termo de busca"
            className="h-16 w-full bg-transparent text-[15px] text-[#1a1a1a] placeholder:text-[#1a1a1a]/40 focus:outline-none"
          />
          <kbd className="hidden rounded-[3px] border border-[#e5e5e5] bg-[#fafafa] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#1a1a1a]/50 sm:inline">
            Esc
          </kbd>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2" aria-live="polite">
          {!termo ? (
            <div className="px-4 py-8 text-[13.5px] leading-[1.6] text-[#1a1a1a]/60">
              Busque cursos, prédios, editais, eventos, documentos e informações do portal. Por
              exemplo:{" "}
              {EXEMPLOS.map((e, i) => (
                <span key={e}>
                  <span className="font-semibold text-[#1a1a1a]/80">{e}</span>
                  {i < EXEMPLOS.length - 1 ? ", " : "."}
                </span>
              ))}
            </div>
          ) : exibidos.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-[4px] border border-[#e5e5e5] text-[#6E3AFF]">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="mt-4 text-[15px] font-bold text-[#1a1a1a]">
                {carregando ? "Buscando..." : `Nada encontrado para "${termo}"`}
              </div>
              {!carregando && (
                <div className="mt-1 text-[13px] text-[#1a1a1a]/60">
                  Tente outra palavra ou um termo mais curto.
                </div>
              )}
            </div>
          ) : (
            grupos.map((g) => (
              <div key={g.tipo} className="mb-2">
                <div className="px-3 pb-1 pt-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#1a1a1a]/40">
                  {ROTULO_TIPO[g.tipo]}
                </div>
                {g.itens.map((item) => {
                  const Icon = ICONE_TIPO[item.tipo];
                  const idx = exibidos.indexOf(item);
                  const isActive = idx === active;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onMouseEnter={() => setActive(idx)}
                      onClick={() => abrir(item)}
                      className={`flex w-full items-center gap-3 rounded-[4px] px-3 py-3 text-left ${
                        isActive ? "bg-[#6E3AFF] text-white" : "hover:bg-[#fafafa]"
                      }`}
                    >
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[4px] border ${
                          isActive
                            ? "border-white/30 bg-white/10 text-white"
                            : "border-[#e5e5e5] text-[#1a1a1a]"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span
                          className={`block truncate text-[14px] font-semibold ${isActive ? "text-white" : "text-[#1a1a1a]"}`}
                        >
                          {item.titulo}
                        </span>
                        <span
                          className={`block truncate text-[12px] ${isActive ? "text-white/75" : "text-[#1a1a1a]/55"}`}
                        >
                          {item.detalhe}
                        </span>
                      </span>
                      <span
                        className={`flex shrink-0 items-center gap-1 text-[10px] font-bold uppercase tracking-[0.14em] ${
                          isActive ? "text-white" : "invisible"
                        }`}
                      >
                        {item.to ? (
                          "Abrir ↵"
                        ) : (
                          <>
                            Site oficial <ArrowUpRight className="h-3 w-3" />
                          </>
                        )}
                      </span>
                    </button>
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
            {carregando
              ? "Carregando..."
              : indice.falhas > 0
                ? "Parte do conteúdo não carregou"
                : "Unimontes"}
          </div>
        </div>
      </div>
    </div>
  );
}
