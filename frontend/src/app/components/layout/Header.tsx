import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router";
import { motion } from "motion/react";
import { Search, Menu, X } from "lucide-react";
import { SearchDialog } from "../shared/SearchDialog";
import { EVENTO_ABRIR_BUSCA } from "../shared/abrirBusca";
import { useTravarRolagem } from "../shared/useTravarRolagem";
import { preCarregarBusca } from "../../../services/buscaService";

const NAV = [
  { to: "/", label: "Início", end: true },
  { to: "/vida-academica", label: "Vida Acadêmica", end: false },
  { to: "/cursos", label: "Cursos", end: false },
  { to: "/servicos-documentos", label: "Serviços e Documentos", end: false },
  { to: "/editais-oportunidades", label: "Editais e Oportunidades", end: false },
  { to: "/eventos", label: "Eventos", end: false },
  { to: "/assistencia-estudantil", label: "Assistência Estudantil", end: false },
  { to: "/unidades-localizacao", label: "Unidades e Localização", end: false },
];

// No celular o rodapé fica longe: o menu leva também às páginas que só ele lista
const NAV_CELULAR_EXTRA = [
  { to: "/movimento-estudantil-lazer", label: "Movimento Estudantil e Lazer", end: false },
  { to: "/contatos", label: "Catálogo telefônico", end: false },
  { to: "/ajuda-suporte", label: "Ajuda e Suporte", end: false },
];

export function Header() {
  // `chave` remonta a janela quando ela é reaberta com outro termo
  const [busca, setBusca] = useState({ aberta: false, termo: "", chave: 0 });
  // Guarda a página em que o menu foi aberto: ao navegar para outra, ele fecha sozinho
  const { pathname } = useLocation();
  const [menuAbertoEm, setMenuAbertoEm] = useState<string | null>(null);
  const mobileOpen = menuAbertoEm === pathname;
  const fecharMenu = () => setMenuAbertoEm(null);
  const [scrolled, setScrolled] = useState(false);
  useTravarRolagem(mobileOpen);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuAbertoEm(null);
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setBusca((b) => ({ aberta: !b.aberta, termo: "", chave: b.chave + 1 }));
      }
    };
    // Caixas de busca e sugestões das páginas abrem a busca global já com o termo
    const onAbrir = (e: Event) => {
      const termo = (e as CustomEvent<string>).detail ?? "";
      setBusca((b) => ({ aberta: true, termo, chave: b.chave + 1 }));
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener(EVENTO_ABRIR_BUSCA, onAbrir);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(EVENTO_ABRIR_BUSCA, onAbrir);
    };
  }, []);

  const abrirBusca = () => {
    fecharMenu();
    setBusca((b) => ({ aberta: true, termo: "", chave: b.chave + 1 }));
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full bg-white transition-all duration-300 ${
          scrolled || mobileOpen ? "border-b border-[#e5e5e5]" : "border-b border-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-6 px-6 lg:h-20 lg:px-12">
          <NavLink
            to="/"
            aria-label="Unimontes — página inicial"
            className="flex shrink-0 items-center gap-3"
          >
            <img
              src="/figurativa-unimontes.svg"
              alt=""
              aria-hidden="true"
              className="h-[22px] w-auto"
            />
            <span className="flex items-baseline gap-3">
              <span className="text-xl font-bold tracking-[-0.04em] text-[#1a1a1a]">UNIMONTES</span>
              <span className="hidden border-l border-[#1a1a1a]/15 pl-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1a1a1a]/50 xl:inline">
                Portal Acadêmico
              </span>
            </span>
          </NavLink>

          <div className="flex items-center gap-2.5">
            {/* A busca é o caminho mais rápido no celular: fica sempre à vista, não dentro do menu */}
            <motion.button
              onClick={abrirBusca}
              onMouseEnter={preCarregarBusca}
              onFocus={preCarregarBusca}
              onTouchStart={preCarregarBusca}
              whileTap={{ scale: 0.97 }}
              aria-label="Buscar no portal"
              className="flex h-11 min-w-11 items-center justify-center gap-3 rounded-[4px] border border-[#e5e5e5] bg-white px-3 text-[12px] font-medium text-[#1a1a1a]/60 transition-colors hover:border-[#1a1a1a] hover:text-[#1a1a1a] lg:px-3.5"
            >
              <Search className="h-[18px] w-[18px] text-[#1a1a1a] lg:h-4 lg:w-4 lg:text-current" />
              <span className="hidden lg:inline">Buscar no portal</span>
              <kbd className="ml-1 hidden rounded-sm bg-[#f4f4f4] px-1.5 py-0.5 text-[10px] font-semibold text-[#1a1a1a]/50 lg:inline">
                ⌘K
              </kbd>
            </motion.button>

            <button
              onClick={() => (mobileOpen ? fecharMenu() : setMenuAbertoEm(pathname))}
              aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={mobileOpen}
              aria-controls="menu-celular"
              className="flex h-11 w-11 items-center justify-center rounded-[4px] border border-[#e5e5e5] text-[#1a1a1a] lg:hidden"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Secondary nav row — full menu inline on desktop */}
        <nav className="hidden border-t border-[#e5e5e5] bg-white lg:block">
          {/* Tipografia compacta em lg para caber em 1024px sem rolagem; barra oculta como salvaguarda */}
          <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-3.5 overflow-x-auto px-6 py-3 [scrollbar-width:none] lg:px-12 xl:gap-6 [&::-webkit-scrollbar]:hidden">
            {NAV.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `relative whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.02em] transition-colors xl:text-[12px] xl:tracking-[0.08em] ${
                    isActive ? "text-[#1a1a1a]" : "text-[#1a1a1a]/55 hover:text-[#1a1a1a]"
                  }`
                }
              >
                {({ isActive }) => (
                  <span className="relative inline-block py-1">
                    {item.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#6E3AFF]"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </span>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        {mobileOpen && (
          <motion.nav
            id="menu-celular"
            aria-label="Menu principal"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18 }}
            // Limitado à altura da tela: em celulares baixos o menu rola em vez de ficar cortado
            className="max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain bg-white lg:hidden"
          >
            <div className="flex flex-col px-4 pb-6 pt-3">
              {[...NAV, null, ...NAV_CELULAR_EXTRA].map((item) =>
                item ? (
                  <NavLink
                    key={item.label}
                    to={item.to}
                    end={item.end}
                    onClick={fecharMenu}
                    className={({ isActive }) =>
                      `flex min-h-12 items-center rounded-[4px] px-4 text-[15px] font-medium ${
                        isActive
                          ? "bg-[#f4f4f4] text-[#1a1a1a]"
                          : "text-[#1a1a1a]/70 active:bg-[#f4f4f4]"
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ) : (
                  <div key="divisoria" className="mx-4 my-3 border-t border-[#e5e5e5]" />
                ),
              )}
            </div>
          </motion.nav>
        )}
      </header>

      {/* Fundo escurecido do menu: tocar fora fecha */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#1a1a1a]/30 lg:hidden"
          onClick={fecharMenu}
          aria-hidden="true"
        />
      )}

      {busca.aberta && (
        <SearchDialog
          key={busca.chave}
          termoInicial={busca.termo}
          onClose={() => setBusca((b) => ({ ...b, aberta: false }))}
        />
      )}
    </>
  );
}
