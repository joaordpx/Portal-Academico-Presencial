import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import { motion } from "motion/react";
import { Search, Menu, X } from "lucide-react";
import { SearchDialog } from "../shared/SearchDialog";

const NAV = [
  { to: "/", label: "Início", end: true },
  { to: "/vida-academica", label: "Vida Acadêmica", end: false },
  { to: "/cursos", label: "Cursos", end: false },
  { to: "/servicos-documentos", label: "Serviços e Documentos", end: false },
  { to: "/editais-oportunidades", label: "Editais e Oportunidades", end: false },
  { to: "/eventos", label: "Eventos", end: false },
  { to: "/assistencia-estudantil", label: "Assistência Estudantil", end: false },
  { to: "/movimento-estudantil-lazer", label: "Movimento Estudantil e Lazer", end: false },
  { to: "/unidades-localizacao", label: "Unidades e Localização", end: false },
];

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full bg-white transition-all duration-300 ${
          scrolled ? "border-b border-[#e5e5e5]" : "border-b border-transparent"
        }`}
      >
        <div className="mx-auto flex h-20 max-w-[1400px] items-center justify-between gap-6 px-6 lg:px-12">
          <NavLink to="/" className="flex items-baseline gap-3 shrink-0">
            <span className="text-xl font-bold tracking-[-0.04em] text-[#1a1a1a]">UNIMONTES</span>
            <span className="hidden border-l border-[#1a1a1a]/15 pl-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1a1a1a]/50 xl:inline">
              Portal Acadêmico
            </span>
          </NavLink>

          <div className="flex items-center gap-2.5">
            <motion.button
              onClick={() => setSearchOpen(true)}
              whileTap={{ scale: 0.97 }}
              className="hidden items-center gap-3 rounded-[4px] border border-[#e5e5e5] bg-white px-3.5 py-2.5 text-[12px] font-medium text-[#1a1a1a]/60 transition-colors hover:border-[#1a1a1a] hover:text-[#1a1a1a] sm:flex"
            >
              <Search className="h-4 w-4" />
              <span className="hidden lg:inline">Buscar no portal</span>
              <kbd className="ml-1 rounded-sm bg-[#f4f4f4] px-1.5 py-0.5 text-[10px] font-semibold text-[#1a1a1a]/50">
                ⌘K
              </kbd>
            </motion.button>

            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="flex h-11 w-11 items-center justify-center rounded-[4px] border border-[#e5e5e5] text-[#1a1a1a] lg:hidden"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Secondary nav row — full menu inline on desktop */}
        <nav className="hidden border-t border-[#e5e5e5] bg-white lg:block">
          <div className="mx-auto flex max-w-[1400px] items-center gap-7 overflow-x-auto px-6 py-3 lg:px-12">
            {NAV.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `relative whitespace-nowrap text-[12px] font-semibold uppercase tracking-[0.1em] transition-colors ${
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
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-[#e5e5e5] bg-white lg:hidden"
          >
            <div className="flex flex-col p-4">
              {NAV.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.to}
                  end={item.end}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `rounded-[4px] px-4 py-3 text-[14px] font-medium ${
                      isActive
                        ? "bg-[#f4f4f4] text-[#1a1a1a]"
                        : "text-[#1a1a1a]/70 hover:bg-[#fafafa]"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <button
                onClick={() => {
                  setMobileOpen(false);
                  setSearchOpen(true);
                }}
                className="mt-2 flex items-center justify-center gap-2 rounded-[4px] border border-[#e5e5e5] px-4 py-3 text-sm font-semibold text-[#1a1a1a]"
              >
                <Search className="h-4 w-4" /> Buscar
              </button>
            </div>
          </motion.div>
        )}
      </header>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
