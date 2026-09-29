import { Link } from "react-router";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";

export function NotFound() {
  return (
    <section className="flex min-h-[75vh] items-center justify-center bg-white px-6 py-20">
      <div className="max-w-2xl text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-[140px] font-bold leading-none tracking-[-0.05em] text-[#1a1a1a] sm:text-[200px] lg:text-[260px]"
        >
          4<em className="font-light italic text-[#6E3AFF]">0</em>4
        </motion.div>
        <div className="mt-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#1a1a1a]/50">
          Página não encontrada
        </div>
        <h1 className="mt-6 text-balance text-[32px] font-bold tracking-[-0.03em] text-[#1a1a1a] lg:text-[44px]">
          Esse caminho não existe no Portal.
        </h1>
        <p className="mx-auto mt-4 max-w-md text-[16px] leading-[1.6] text-[#1a1a1a]/65">
          O endereço pode ter sido alterado ou removido. Volte ao início para continuar sua jornada
          acadêmica.
        </p>
        <Link
          to="/"
          className="mt-10 inline-flex items-center gap-2 rounded-[4px] bg-[#6E3AFF] px-7 py-4 text-[12px] font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#5829d9]"
        >
          Voltar para o início <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
