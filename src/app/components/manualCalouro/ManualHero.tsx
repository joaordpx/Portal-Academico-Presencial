import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";

export function ManualHero() {
  return (
    <section className="relative overflow-hidden bg-[#FFFDF9]">
      {/* Elementos decorativos do fundo */}
      <div
        className="pointer-events-none absolute -left-32 top-20 h-[360px] w-[360px] rounded-full border-[24px] border-[#FFE3D8]"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute right-[25%] top-[-80px] h-[300px] w-[300px] rounded-full border-[20px] border-[#F2E7FF]"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute -right-16 top-16 h-[150px] w-[150px] rounded-full border-[16px] border-[#FFE9B8]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-[1400px] px-6 py-16 sm:py-20 lg:px-12 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr] lg:gap-20">
          
          {/* =====================================================
              TEXTO
          ====================================================== */}
          <div className="relative z-10 max-w-[620px]">
            
            {/* Pequeno identificador */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#6E3AFF]"
            >
              Manual do Calouro
            </motion.p>

            {/* Título */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="max-w-[600px] text-balance text-[42px] font-bold leading-[1.05] tracking-[-0.04em] text-[#1A1A1A] sm:text-[52px] lg:text-[64px]"
            >
              Seu primeiro passo na Unimontes{" "}
              <span className="text-[#6E3AFF]">começa aqui.</span>
            </motion.h1>

            {/* Descrição */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 max-w-[520px] text-[16px] leading-[1.65] text-[#1A1A1A]/60 sm:text-[17px]"
            >
              Chegou na Unimontes? Descubra os primeiros passos, conheça sua
              universidade e encontre tudo o que você precisa para começar
              sua vida acadêmica.
            </motion.p>

            {/* Botão */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8"
            >
              <a
                href="#comece-aqui"
                className="group inline-flex items-center gap-3 rounded-[6px] bg-[#6E3AFF] px-6 py-3.5 text-[13px] font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#5B2DE0] hover:shadow-[0_10px_25px_rgba(110,58,255,0.2)]"
              >
                Começar minha jornada

                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </a>
            </motion.div>

            {/* Pequena informação abaixo do botão */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-6 flex items-center gap-2 text-[12px] text-[#1A1A1A]/45"
            >
              <span className="h-2 w-2 rounded-full bg-[#6E3AFF]" />
              Tudo o que você precisa para começar.
            </motion.div>
          </div>

          {/* =====================================================
              IMAGEM
          ====================================================== */}
          <div className="relative mx-auto w-full max-w-[560px]">
            
            {/* Círculo decorativo atrás da imagem */}
            <div
              className="absolute -left-16 -top-12 h-[260px] w-[260px] rounded-full border-[22px] border-[#F2E7FF] sm:-left-20 sm:-top-16 sm:h-[320px] sm:w-[320px]"
              aria-hidden="true"
            />

            {/* Segundo círculo */}
            <div
              className="absolute -bottom-14 -right-12 h-[180px] w-[180px] rounded-full border-[18px] border-[#FFE3D8] sm:-bottom-20 sm:-right-16 sm:h-[220px] sm:w-[220px]"
              aria-hidden="true"
            />

            {/* Imagem principal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative z-10 overflow-hidden rounded-[18px] bg-[#F2F2F2] shadow-[0_20px_50px_rgba(26,26,26,0.08)]"
            >
              <img
                src="/images/manual-calouro.jpg"
                alt="Estudante da Unimontes"
                className="aspect-[4/4.5] w-full object-cover"
              />
            </motion.div>

            {/* Sticker / informação flutuante */}
            <motion.div
              initial={{ opacity: 0, y: 10, rotate: -3 }}
              animate={{ opacity: 1, y: 0, rotate: -3 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="absolute -bottom-6 -left-4 z-20 rounded-[10px] bg-white px-4 py-3 shadow-[0_10px_30px_rgba(26,26,26,0.1)] sm:-left-8"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EEE9FF] text-lg">
                  🎓
                </span>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#1A1A1A]/40">
                    Novo por aqui?
                  </p>

                  <p className="mt-0.5 text-[13px] font-bold text-[#1A1A1A]">
                    A gente te ajuda.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}