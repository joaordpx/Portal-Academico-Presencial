import { Link } from "react-router";
import { motion } from "motion/react";
import { ChevronRight, Home } from "lucide-react";

type Accent = "roxo" | "verde" | "vermelho" | "amarelo";

const ACCENT_HEX: Record<Accent, string> = {
  roxo: "#6E3AFF",
  verde: "#00B894",
  vermelho: "#FF4D2E",
  amarelo: "#FFB800",
};

export function PageHeader({
  eyebrow,
  title,
  description,
  icon: Icon,
  accent = "roxo",
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
  accent?: Accent;
}) {
  const hex = ACCENT_HEX[accent];
  return (
    <section className="border-b border-[#e5e5e5] bg-white">
      <div className="mx-auto max-w-[1400px] px-6 pb-14 pt-8 lg:px-12 lg:pb-24 lg:pt-12">
        <nav className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1a1a1a]/50">
          <Link
            to="/"
            className="flex items-center gap-1.5 transition-colors"
            onMouseEnter={(e) => (e.currentTarget.style.color = hex)}
            onMouseLeave={(e) => (e.currentTarget.style.color = "")}
          >
            <Home className="h-3 w-3" /> Início
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-[#1a1a1a]">{eyebrow}</span>
        </nav>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-3 text-[12px] font-bold uppercase tracking-[0.18em]"
              style={{ color: hex }}
            >
              <span className="h-px w-10" style={{ backgroundColor: hex }} />
              {eyebrow}
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.05 }}
              className="mt-6 text-balance text-[44px] font-bold leading-[0.95] tracking-[-0.04em] text-[#1a1a1a] lg:text-[80px]"
            >
              {title}
            </motion.h1>
          </div>

          <div className="lg:col-span-4 lg:pt-4">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="text-[17px] leading-[1.6] text-[#1a1a1a]/70"
            >
              {description}
            </motion.p>
            {Icon && (
              <div
                className="mt-6 hidden h-12 w-12 items-center justify-center rounded-[4px] border border-[#e5e5e5] sm:flex"
                style={{ color: hex }}
              >
                <Icon className="h-5 w-5" />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
