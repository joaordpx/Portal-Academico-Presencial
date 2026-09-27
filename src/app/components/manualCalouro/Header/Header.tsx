import React, { useEffect, useRef, useState } from 'react';
import styles from './Header.module.css';

interface HeaderProps {
  onNavigate?: (route: string) => void;
  logoSrc?: string;
  logoAlt?: string;
}

const navItems = [
  {
    route: 'portal-academico',
    label: 'Portal acadêmico',
  },
  {
    route: 'sobre-unimontes',
    label: 'Sobre a Unimontes',
  },
  {
    route: 'mapa-unimontes',
    label: 'Mapa da Unimontes',
  },
  {
    route: 'ajuda',
    label: 'Ajuda',
  },
];

export const Header: React.FC<HeaderProps> = ({
  onNavigate,
  logoSrc = '/figurativa-unimontes.svg',
  logoAlt = 'Logotipo da Unimontes',
}) => {
  const headerRef = useRef<HTMLElement>(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [activeRoute, setActiveRoute] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);

  /**
   * Atualiza a variável global com a altura do header.
   * Isso ajuda outras seções, como a Hero Section.
   */
  useEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        document.documentElement.style.setProperty(
          '--header-height',
          `${headerRef.current.offsetHeight}px`
        );
      }
    };

    updateHeaderHeight();

    window.addEventListener('resize', updateHeaderHeight);

    document.fonts?.ready.then(updateHeaderHeight);

    return () => {
      window.removeEventListener('resize', updateHeaderHeight);
    };
  }, []);

  /**
   * Detecta quando o usuário começa a rolar a página.
   */
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  /**
   * Fecha o menu mobile quando a tela volta para desktop.
   */
  useEffect(() => {
    const closeOnResize = () => {
      if (window.innerWidth > 768) {
        setMenuOpen(false);
      }
    };

    window.addEventListener('resize', closeOnResize);

    return () => {
      window.removeEventListener('resize', closeOnResize);
    };
  }, []);

  /**
   * Evita que a página continue rolando
   * enquanto o menu mobile está aberto.
   */
  useEffect(() => {
    if (menuOpen && window.innerWidth <= 768) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  /**
   * Função de navegação.
   */
  const handleNavigation = (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>,
    route: string
  ) => {
    e.preventDefault();

    setActiveRoute(route);
    setMenuOpen(false);

    if (onNavigate) {
      onNavigate(route);
      return;
    }

    console.log(`Navegando para: ${route}`);
  };

  return (
    <>
      <header
        ref={headerRef}
        className={`${styles.headerContainer} ${
          isScrolled ? styles.isScrolled : ''
        }`}
      >
        <div className={styles.headerContent}>
          {/* ==============================
              LOGO
          ============================== */}

          <a
            href="#home"
            className={styles.logoBrand}
            onClick={(e) => handleNavigation(e, 'home')}
            aria-label="Ir para a página inicial"
          >
            <div className={styles.logoWrapper}>
              <img
                src={logoSrc}
                alt={logoAlt}
                className={styles.logoImg}
              />
            </div>

            <div className={styles.logoText}>
              <span className={styles.title}>
                Universidade Estadual de
              </span>

              <span className={styles.subtitle}>
                Montes Claros
              </span>
            </div>
          </a>

          {/* ==============================
              MENU DESKTOP
          ============================== */}

          <nav
            className={styles.navMenu}
            aria-label="Navegação principal"
          >
            {navItems.map((item) => {
              const isActive = activeRoute === item.route;

              return (
                <button
                  key={item.route}
                  type="button"
                  className={`${styles.navButton} ${
                    isActive ? styles.navButtonActive : ''
                  }`}
                  onClick={(e) =>
                    handleNavigation(e, item.route)
                  }
                  aria-current={
                    isActive ? 'page' : undefined
                  }
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* ==============================
              BOTÃO HAMBÚRGUER
          ============================== */}

          <button
            type="button"
            className={`${styles.menuToggle} ${
              menuOpen ? styles.menuToggleOpen : ''
            }`}
            onClick={() =>
              setMenuOpen((prev) => !prev)
            }
            aria-label={
              menuOpen
                ? 'Fechar menu de navegação'
                : 'Abrir menu de navegação'
            }
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
          >
            <span className={styles.burgerLine} />
            <span className={styles.burgerLine} />
            <span className={styles.burgerLine} />
          </button>
        </div>
      </header>

      {/* ==============================
          OVERLAY MOBILE
      ============================== */}

      <div
        className={`${styles.mobileOverlay} ${
          menuOpen
            ? styles.mobileOverlayVisible
            : ''
        }`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      {/* ==============================
          MENU MOBILE
      ============================== */}

      <nav
        id="mobile-navigation"
        className={`${styles.mobileMenu} ${
          menuOpen ? styles.mobileMenuOpen : ''
        }`}
        aria-label="Menu de navegação mobile"
      >
        <div className={styles.mobileMenuHeader}>
          <span>MENU</span>

          <button
            type="button"
            className={styles.mobileCloseButton}
            onClick={() => setMenuOpen(false)}
            aria-label="Fechar menu"
          >
            ×
          </button>
        </div>

        <div className={styles.mobileNavItems}>
          {navItems.map((item, index) => {
            const isActive = activeRoute === item.route;

            return (
              <button
                key={item.route}
                type="button"
                className={`${styles.mobileNavButton} ${
                  isActive
                    ? styles.mobileNavButtonActive
                    : ''
                }`}
                onClick={(e) =>
                  handleNavigation(e, item.route)
                }
                style={{
                  transitionDelay: menuOpen
                    ? `${index * 60}ms`
                    : '0ms',
                }}
              >
                <span className={styles.mobileNavNumber}>
                  0{index + 1}
                </span>

                <span className={styles.mobileNavLabel}>
                  {item.label}
                </span>

                <span className={styles.mobileNavArrow}>
                  →
                </span>
              </button>
            );
          })}
        </div>

        <div className={styles.mobileMenuFooter}>
          <span className={styles.footerDot} />

          <p>
            <span>Manual do Calouro</span>
            <strong>Unimontes</strong>
          </p>
        </div>
      </nav>
    </>
  );
};

export default Header;