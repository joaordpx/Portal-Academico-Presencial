import { useCallback, useEffect, useState } from "react";
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
  MapPin,
  Megaphone,
  Phone,
  IdCard,
  BookOpen,
  Sparkles,
} from "lucide-react";

type Item = {
  label: string;
  hint: string;
  to: string;
  icon: typeof Search;
  group: string;
  keywords?: string;
};

const ITEMS: Item[] = [
  {
    label: "Vida Acadêmica",
    hint: "Calendário · Matrícula · Biblioteca",
    to: "/vida-academica",
    icon: GraduationCap,
    group: "Seções",
    keywords: "calendario matricula biblioteca tutoriais",
  },
  {
    label: "Cursos",
    hint: "Graduação · Centros · Turnos",
    to: "/cursos",
    icon: BookOpen,
    group: "Seções",
  },
  {
    label: "Serviços e Documentos",
    hint: "WebGiz · Declarações · Requerimentos",
    to: "/servicos-documentos",
    icon: FileText,
    group: "Seções",
    keywords: "webgiz declaracao historico requerimento",
  },
  {
    label: "Editais e Oportunidades",
    hint: "Editais · Estágios · Bolsas",
    to: "/editais-oportunidades",
    icon: ClipboardList,
    group: "Seções",
  },
  {
    label: "Eventos",
    hint: "Cultural · Acadêmico · Comunitário",
    to: "/eventos",
    icon: CalendarHeart,
    group: "Seções",
  },
  {
    label: "Assistência Estudantil",
    hint: "Auxílios · RU · Saúde",
    to: "/assistencia-estudantil",
    icon: HeartHandshake,
    group: "Seções",
  },
  {
    label: "Movimento Estudantil e Lazer",
    hint: "DCE · Atléticas · Reservas",
    to: "/movimento-estudantil-lazer",
    icon: Megaphone,
    group: "Seções",
  },
  {
    label: "Unidades e Localização",
    hint: "Mapa · Blocos · Setores",
    to: "/unidades-localizacao",
    icon: MapPin,
    group: "Seções",
  },
  {
    label: "WebGiz",
    hint: "Acessar o sistema acadêmico",
    to: "/servicos-documentos",
    icon: Monitor,
    group: "Ações rápidas",
  },
  {
    label: "Carteirinha estudantil",
    hint: "Como emitir",
    to: "/servicos-documentos",
    icon: IdCard,
    group: "Ações rápidas",
  },
  {
    label: "Contato",
    hint: "Fale com a Unimontes",
    to: "/contato",
    icon: Phone,
    group: "Ações rápidas",
  },
];

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

  const filtered = ITEMS.filter((i) => {
    const t = (i.label + " " + i.hint + " " + (i.keywords ?? "")).toLowerCase();
    return t.includes(q.toLowerCase());
  });

  // Digitar reinicia a seleção; fechar limpa a busca. Feito nos próprios
  // manipuladores para evitar renders em cascata a partir de efeitos.
  function alterarBusca(valor: string) {
    setQ(valor);
    setActive(0);
  }

  const fechar = useCallback(() => {
    setQ("");
    setActive(0);
    onOpenChange(false);
  }, [onOpenChange]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") fechar();
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((a) => Math.min(filtered.length - 1, a + 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((a) => Math.max(0, a - 1));
      }
      if (e.key === "Enter") {
        const item = filtered[active];
        if (item) {
          navigate(item.to);
          fechar();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, filtered, active, navigate, fechar]);

  const groups = Array.from(new Set(filtered.map((f) => f.group)));

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
                placeholder="Busque por serviços, lugares ou processos..."
                className="h-16 w-full bg-transparent text-[15px] text-[#1a1a1a] placeholder:text-[#1a1a1a]/40 focus:outline-none"
              />
              <kbd className="hidden rounded-[3px] border border-[#e5e5e5] bg-[#fafafa] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#1a1a1a]/50 sm:inline">
                Esc
              </kbd>
            </div>

            <div className="max-h-[55vh] overflow-y-auto p-2">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-[4px] border border-[#e5e5e5] text-[#6E3AFF]">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div className="mt-4 text-[15px] font-bold text-[#1a1a1a]">Nenhum resultado</div>
                  <div className="mt-1 text-[13px] text-[#1a1a1a]/60">
                    Tente "WebGiz", "RU" ou "Carteirinha".
                  </div>
                </div>
              ) : (
                groups.map((g) => (
                  <div key={g} className="mb-2">
                    <div className="px-3 pb-1 pt-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#1a1a1a]/40">
                      {g}
                    </div>
                    {filtered
                      .filter((f) => f.group === g)
                      .map((item) => {
                        const Icon = item.icon;
                        const idx = filtered.indexOf(item);
                        const isActive = idx === active;
                        return (
                          <motion.button
                            key={item.label}
                            onMouseEnter={() => setActive(idx)}
                            onClick={() => {
                              navigate(item.to);
                              fechar();
                            }}
                            whileTap={{ scale: 0.99 }}
                            className={`group flex w-full items-center gap-3 rounded-[4px] px-3 py-3 text-left transition-colors ${
                              isActive ? "bg-[#6E3AFF] text-white" : "hover:bg-[#fafafa]"
                            }`}
                          >
                            <div
                              className={`flex h-9 w-9 items-center justify-center rounded-[4px] border transition-colors ${
                                isActive
                                  ? "border-white/30 bg-white/10 text-white"
                                  : "border-[#e5e5e5] text-[#1a1a1a]"
                              }`}
                            >
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="flex-1">
                              <div
                                className={`text-[14px] font-semibold ${isActive ? "text-white" : "text-[#1a1a1a]"}`}
                              >
                                {item.label}
                              </div>
                              <div
                                className={`text-[12px] ${isActive ? "text-white/70" : "text-[#1a1a1a]/55"}`}
                              >
                                {item.hint}
                              </div>
                            </div>
                            <div
                              className={`text-[10px] font-bold uppercase tracking-[0.14em] transition-opacity ${
                                isActive ? "text-white opacity-100" : "opacity-0"
                              }`}
                            >
                              Abrir ↵
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
              <div>Unimontes</div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
