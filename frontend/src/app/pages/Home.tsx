import { useEffect, useState } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import {
  ArrowUpRight,
  CalendarDays,
  UtensilsCrossed,
  ScrollText,
  FileSignature,
  GraduationCap,
  BriefcaseBusiness,
  BookMarked,
  HeartPulse,
  LifeBuoy,
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  HelpCircle,
  Compass,
} from "lucide-react";
import { Reveal } from "../components/shared/Reveal";
import { ImageWithFallback } from "../components/shared/ImageWithFallback";
import campusPredio1 from "../../assets/campus-predio-1.jpg";

// Importando Tipos e Serviços
import { Comunicado, Oportunidade, Noticia, DestaqueHero } from "../../types";
import {
  getComunicados,
  getOportunidades,
  getNoticias,
  getDestaqueHero,
} from "../../services/homeService";

export function Home() {
  const [comunicados, setComunicados] = useState<Comunicado[]>([]);
  const [oportunidades, setOportunidades] = useState<Oportunidade[]>([]);
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);
  const [destaque, setDestaque] = useState<DestaqueHero | null>(null);

  useEffect(() => {
    async function carregarDados() {
      try {
        const [comunicadosData, opData, noticiasData, destaqueData] = await Promise.all([
          getComunicados(),
          getOportunidades(),
          getNoticias(),
          getDestaqueHero(),
        ]);

        setComunicados(comunicadosData);
        setOportunidades(opData);
        setNoticias(noticiasData);
        setDestaque(destaqueData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, []);

  return (
    <>
      {/* Passando a variável de destaque para o componente */}
      <HeroIntro destaque={destaque} />
      <AtalhosRapidos />

      {loading ? (
        <div className="flex h-64 items-center justify-center text-[#1a1a1a]/50">
          Carregando informações do portal...
        </div>
      ) : (
        <>
          <Comunicados data={comunicados} />
          <PrazosOportunidades data={oportunidades} />
          <EstudeNaUnimontes />
          <Noticias data={noticias} />
        </>
      )}
    </>
  );
}

/* ──────────────────────────────────────────────────────────────
   HERO E ATALHOS (Estáticos)
   ────────────────────────────────────────────────────────────── */
function HeroIntro({ destaque }: { destaque: DestaqueHero | null }) {
  return (
    <section className="relative overflow-hidden bg-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[600px] opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 80% 0%, rgba(110,58,255,0.10) 0%, transparent 55%), radial-gradient(ellipse at 0% 30%, rgba(255,184,0,0.08) 0%, transparent 50%)",
        }}
      />
      <div className="relative mx-auto max-w-[1400px] px-6 pt-12 pb-20 lg:px-12 lg:pt-20 lg:pb-28">
        <div className="flex items-center justify-between border-b border-[#e5e5e5] pb-6">
          <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#1a1a1a]/50">
            Edição N°01 · Período 2026/2
          </div>
          <div className="hidden text-[11px] font-semibold uppercase tracking-[0.22em] text-[#1a1a1a]/50 sm:block">
            Universidade Estadual de Montes Claros
          </div>
        </div>

        <div className="grid grid-cols-1 items-end gap-12 pt-10 lg:grid-cols-12 lg:gap-16 lg:pt-16">
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 text-[12px] font-bold uppercase tracking-[0.18em] text-[#6E3AFF]"
            >
              <span className="h-px w-10 bg-[#6E3AFF]" />
              Portal Acadêmico
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05 }}
              className="mt-6 text-balance text-[44px] font-bold leading-[0.92] tracking-[-0.045em] text-[#1a1a1a] sm:text-[64px] lg:text-[96px] xl:text-[112px]"
            >
              Sua vida acadêmica, <span className="font-light italic">reunida</span> num só lugar.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-10 max-w-xl text-[17px] leading-[1.6] text-[#1a1a1a]/70"
            >
              Acesse rapidamente informações, serviços e oportunidades — de editais e calendário a
              documentos, estágios e suporte — no portal oficial da Unimontes.
            </motion.p>
          </div>

          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div
                aria-hidden
                className="absolute -right-3 -top-3 hidden h-full w-full rounded-[4px] bg-[#FFB800] lg:block"
              />

              {/* DIV DE IMAGEM INSERIDA AQUI NO LOCAL CORRETO */}
              <div className="relative overflow-hidden rounded-[4px] border border-[#1a1a1a]">
                <ImageWithFallback
                  src={campusPredio1}
                  alt="Prédio 1 — Campus Universitário da Unimontes"
                  className="aspect-[4/5] w-full object-cover"
                />

                {/* AQUI ESTÁ A MÁGICA: Só renderiza se estiver ativo e usa a cor/texto do backend */}
                {destaque?.ativo && (
                  <div
                    className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white"
                    style={{ backgroundColor: destaque.corFundo }}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    {destaque.texto}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-16 grid grid-cols-1 gap-0 border-y border-[#e5e5e5] md:grid-cols-2 lg:mt-24"
        >
          {[
            {
              no: "01",
              tag: "Calouros",
              title: "Sou calouro",
              desc: "Inicie sua jornada acadêmica com um roteiro simples — do primeiro acesso ao mapa do campus.",
              cta: "Acessar manual",
              to: "/vida-academica",
              accent: "#6E3AFF",
              img: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900",
            },
            {
              no: "02",
              tag: "Guias rápidos",
              title: "Tutoriais",
              desc: "Passo a passo para simplificar matrícula, requerimentos, WebGiz e outros sistemas.",
              cta: "Acessar tutoriais",
              to: "/servicos-documentos",
              accent: "#00B894",
              img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900",
            },
          ].map((c, i) => (
            <Link
              key={c.no}
              to={c.to}
              className={`group grid grid-cols-1 items-stretch transition-colors hover:bg-[#fafafa] sm:grid-cols-[1fr_180px] ${
                i === 0 ? "border-b border-[#e5e5e5] md:border-b-0 md:border-r" : ""
              }`}
            >
              <div className="flex flex-col justify-between gap-6 p-8 lg:p-10">
                <div
                  className="text-[11px] font-bold uppercase tracking-[0.18em]"
                  style={{ color: c.accent }}
                >
                  {c.no} / {c.tag}
                </div>
                <div>
                  <div className="text-balance text-[28px] font-bold leading-[1.0] tracking-[-0.03em] text-[#1a1a1a] lg:text-[36px]">
                    {c.title}
                  </div>
                  <p className="mt-3 max-w-md text-[15px] leading-[1.55] text-[#1a1a1a]/65">
                    {c.desc}
                  </p>
                  <div
                    className="mt-6 inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.14em]"
                    style={{ color: c.accent }}
                  >
                    {c.cta}
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>
              </div>
              <div className="relative h-full min-h-[160px] overflow-hidden bg-[#f4f4f4]">
                <ImageWithFallback
                  src={c.img}
                  alt={c.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
              </div>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function AtalhosRapidos() {
  const items = [
    { icon: LayoutDashboard, label: "WebGiz", to: "/servicos-documentos" },
    { icon: CalendarDays, label: "Calendário Acadêmico", to: "/vida-academica" },
    { icon: UtensilsCrossed, label: "Restaurante Universitário", to: "/assistencia-estudantil" },
    { icon: ScrollText, label: "Editais", to: "/editais-oportunidades" },
    { icon: FileSignature, label: "Documentos & Requerimentos", to: "/servicos-documentos" },
    { icon: GraduationCap, label: "Cursos", to: "/cursos" },
    { icon: BriefcaseBusiness, label: "Estágios", to: "/editais-oportunidades" },
    { icon: BookMarked, label: "Biblioteca", to: "/vida-academica" },
    { icon: HeartPulse, label: "Assistência Estudantil", to: "/assistencia-estudantil" },
    { icon: LifeBuoy, label: "Ajuda & Suporte", to: "/ajuda-suporte" },
  ];
  return (
    <section className="bg-white py-24 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <Reveal>
          <div className="flex items-end justify-between border-b border-[#e5e5e5] pb-8">
            <div>
              <div className="flex items-center gap-3 text-[12px] font-bold uppercase tracking-[0.18em] text-[#6E3AFF]">
                <span className="h-px w-10 bg-[#6E3AFF]" />
                Atalhos rápidos
              </div>
              <h2 className="mt-6 text-balance text-[40px] font-bold leading-[0.95] tracking-[-0.04em] text-[#1a1a1a] lg:text-[64px]">
                O que mais se <em className="font-light italic">acessa.</em>
              </h2>
            </div>
            <span className="hidden text-[11px] font-bold uppercase tracking-[0.18em] text-[#1a1a1a]/40 sm:block">
              10 atalhos
            </span>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 gap-0 border-l border-[#e5e5e5] sm:grid-cols-3 lg:grid-cols-5">
          {items.map((it, i) => {
            const Icon = it.icon;
            const n = String(i + 1).padStart(2, "0");
            return (
              <Reveal key={it.label} delay={(i % 5) * 0.04}>
                <motion.div whileHover={{ y: -2 }} className="h-full">
                  <Link
                    to={it.to}
                    className="group flex h-full min-h-[180px] w-full cursor-pointer flex-col justify-between border-b border-r border-[#e5e5e5] bg-white p-6 text-left transition-colors hover:bg-[#fafafa]"
                  >
                    <div className="flex items-start justify-between">
                      <Icon
                        className="h-6 w-6 text-[#1a1a1a] transition-colors group-hover:text-[#6E3AFF]"
                        strokeWidth={1.5}
                      />
                      <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#1a1a1a]/35">
                        {n}
                      </span>
                    </div>
                    <div>
                      <div className="text-[15px] font-bold leading-[1.2] tracking-[-0.015em] text-[#1a1a1a]">
                        {it.label}
                      </div>
                      <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#1a1a1a]/40 transition-colors group-hover:text-[#6E3AFF]">
                        Abrir <ArrowUpRight className="h-3 w-3" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function EstudeNaUnimontes() {
  const items = [
    {
      icon: GraduationCap,
      title: "Como ingressar",
      desc: "SISU, vestibular e demais formas de entrada.",
    },
    { icon: BookOpen, title: "Cursos ofertados", desc: "Mais de 47 graduações e diversas pós." },
    {
      icon: ClipboardList,
      title: "Editais de ingresso",
      desc: "Calendários, vagas e processos seletivos.",
    },
    {
      icon: HelpCircle,
      title: "Dúvidas frequentes",
      desc: "Tire as principais dúvidas de novos estudantes.",
    },
  ];
  return (
    <section className="bg-[#1a1a1a] py-24 text-white lg:py-32">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <div className="flex items-center gap-3 text-[12px] font-bold uppercase tracking-[0.18em] text-[#FFB800]">
                <span className="h-px w-10 bg-[#FFB800]" />
                Estude na Unimontes
              </div>
              <h2 className="mt-6 text-balance text-[40px] font-bold leading-[0.95] tracking-[-0.04em] lg:text-[64px]">
                Faça parte da nossa <em className="font-light italic">comunidade.</em>
              </h2>
              <p className="mt-6 max-w-md text-[16px] leading-[1.6] text-white/65">
                Tudo o que você precisa saber para ingressar — vestibular, SISU, cursos, prazos e
                dúvidas mais comuns dos futuros calouros.
              </p>
              <div className="mt-10 overflow-hidden rounded-[4px] border border-white/15">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900"
                  alt="Formandos celebrando"
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>
            </div>
          </Reveal>
          <div className="lg:col-span-7">
            <ol className="divide-y divide-white/10 border-y border-white/10">
              {items.map((it, i) => {
                const Icon = it.icon;
                const n = String(i + 1).padStart(2, "0");
                return (
                  <motion.li
                    key={it.title}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className="group grid grid-cols-12 items-start gap-6 py-10 transition-colors hover:bg-white/[0.03]"
                  >
                    <div className="col-span-2 text-[40px] font-bold leading-none tracking-[-0.04em] text-white/15 transition-colors group-hover:text-[#FFB800] lg:text-[56px]">
                      {n}
                    </div>
                    <div className="col-span-9">
                      <div className="flex items-center gap-3">
                        <Icon className="h-4 w-4 text-[#FFB800]" />
                        <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/50">
                          Tópico {n}
                        </span>
                      </div>
                      <h3 className="mt-4 text-balance text-[26px] font-bold leading-[1.05] tracking-[-0.025em] text-white lg:text-[32px]">
                        {it.title}
                      </h3>
                      <p className="mt-3 text-[16px] leading-[1.6] text-white/65">{it.desc}</p>
                    </div>
                    <ArrowUpRight className="col-span-1 mt-2 h-5 w-5 text-white/30 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#FFB800]" />
                  </motion.li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────
   SEÇÕES DINÂMICAS (Recebem dados via Props)
   ────────────────────────────────────────────────────────────── */

function Comunicados({ data }: { data: Comunicado[] }) {
  if (data.length === 0) return null;

  return (
    <section className="bg-[#fafafa] py-24 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-6 border-b border-[#1a1a1a] pb-8 sm:flex-row sm:items-end">
            <div>
              <div className="flex items-center gap-3 text-[12px] font-bold uppercase tracking-[0.18em] text-[#FF4D2E]">
                <span className="h-px w-10 bg-[#FF4D2E]" />
                Comunicados importantes
              </div>
              <h2 className="mt-6 text-balance text-[40px] font-bold leading-[0.95] tracking-[-0.04em] text-[#1a1a1a] lg:text-[56px]">
                Avisos da reitoria.
              </h2>
            </div>
            <a
              href="#"
              className="group inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.14em] text-[#1a1a1a] hover:text-[#FF4D2E]"
            >
              Ver todos os comunicados
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </Reveal>

        <div className="divide-y divide-[#e5e5e5]">
          {data.map((c, i) => (
            <Reveal key={c.id} delay={i * 0.06}>
              <motion.article
                whileHover={{ x: 4 }}
                className="group grid grid-cols-12 items-start gap-6 py-10"
              >
                <div className="col-span-12 lg:col-span-2">
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white"
                    style={{ backgroundColor: c.tagColor }}
                  >
                    <span className="h-1 w-1 rounded-full bg-white" />
                    {c.tag}
                  </span>
                </div>
                <div className="col-span-12 lg:col-span-7">
                  <h3 className="text-balance text-[26px] font-bold leading-[1.05] tracking-[-0.025em] text-[#1a1a1a] lg:text-[34px]">
                    {c.title}
                  </h3>
                  <p className="mt-3 max-w-2xl text-[15px] leading-[1.6] text-[#1a1a1a]/65">
                    {c.desc}
                  </p>
                  <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#1a1a1a]/50">
                    <span>Público · {c.publico}</span>
                    <span>Campus · {c.campus}</span>
                    <span>Data · {c.data}</span>
                  </div>
                </div>
                <div className="col-span-12 flex items-start justify-end lg:col-span-3">
                  <a
                    href="#"
                    className="inline-flex items-center gap-2 border-b border-[#1a1a1a] pb-1 text-[12px] font-bold uppercase tracking-[0.14em] text-[#1a1a1a] transition-colors group-hover:border-[#FF4D2E] group-hover:text-[#FF4D2E]"
                  >
                    Ler comunicado <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </motion.article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function PrazosOportunidades({ data }: { data: Oportunidade[] }) {
  if (data.length === 0) return null;

  return (
    <section className="bg-white py-24 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-6 border-b border-[#e5e5e5] pb-8 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 text-[12px] font-bold uppercase tracking-[0.18em] text-[#00B894]">
                <span className="h-px w-10 bg-[#00B894]" />
                Prazos & oportunidades
              </div>
              <h2 className="mt-6 text-balance text-[40px] font-bold leading-[0.95] tracking-[-0.04em] text-[#1a1a1a] lg:text-[64px]">
                Inscrições <em className="font-light italic">abertas</em> agora.
              </h2>
            </div>
            <a
              href="#"
              className="group inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.14em] text-[#1a1a1a] hover:text-[#00B894]"
            >
              Ver mais oportunidades
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-0 sm:grid-cols-2 lg:grid-cols-4">
          {data.map((it, i) => (
            <Reveal key={it.id} delay={i * 0.06}>
              <motion.div
                whileHover={{ y: -2 }}
                className="group flex h-full flex-col justify-between border-b border-r border-[#e5e5e5] bg-white p-7 transition-colors hover:bg-[#fafafa] sm:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(4n)]:border-r-0"
              >
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#00B894] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white">
                    <span className="h-1 w-1 rounded-full bg-white" /> Aberto
                  </span>
                  <h3 className="mt-6 text-balance text-[22px] font-bold leading-[1.1] tracking-[-0.02em] text-[#1a1a1a]">
                    {it.title}
                  </h3>
                </div>
                <div className="mt-8">
                  <dl className="space-y-2.5 border-t border-[#e5e5e5] pt-5 text-[12px]">
                    {[
                      ["Tipo", it.tipo],
                      ["Prazo", it.prazo],
                      ["Público", it.publico],
                      ["Campus", it.campus],
                    ].map(([k, v]) => (
                      <div key={k} className="flex items-baseline justify-between gap-3">
                        <dt className="font-bold uppercase tracking-[0.14em] text-[#1a1a1a]/40">
                          {k}
                        </dt>
                        <dd className="text-right font-semibold text-[#1a1a1a]">{v}</dd>
                      </div>
                    ))}
                  </dl>
                  <a
                    href="#"
                    className="mt-6 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[#00B894]"
                  >
                    Ver detalhes{" "}
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Noticias({ data }: { data: Noticia[] }) {
  if (data.length === 0) return null;

  return (
    <section className="bg-white py-24 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-6 border-b border-[#e5e5e5] pb-8 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 text-[12px] font-bold uppercase tracking-[0.18em] text-[#6E3AFF]">
                <span className="h-px w-10 bg-[#6E3AFF]" />
                Notícias & destaques
              </div>
              <h2 className="mt-6 text-balance text-[40px] font-bold leading-[0.95] tracking-[-0.04em] text-[#1a1a1a] lg:text-[64px]">
                O que está <em className="font-light italic">acontecendo.</em>
              </h2>
            </div>
            <a
              href="#"
              className="group inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.14em] text-[#1a1a1a] hover:text-[#6E3AFF]"
            >
              Ver mais notícias{" "}
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-8">
          {data.map((n, i) => (
            <Reveal key={n.id} delay={i * 0.08}>
              <motion.article whileHover={{ y: -3 }} className="group flex h-full flex-col">
                <div className="overflow-hidden rounded-[4px]" style={{ backgroundColor: n.bg }}>
                  <ImageWithFallback
                    src={n.img}
                    alt={n.title}
                    className="aspect-[5/4] w-full object-cover mix-blend-multiply transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <span
                    className="text-[11px] font-bold uppercase tracking-[0.18em]"
                    style={{ color: n.catColor }}
                  >
                    {n.cat}
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1a1a1a]/40">
                    {n.date}
                  </span>
                </div>
                <h3 className="mt-3 text-balance text-[24px] font-bold leading-[1.1] tracking-[-0.025em] text-[#1a1a1a]">
                  {n.title}
                </h3>
                <p className="mt-3 flex-1 text-[15px] leading-[1.55] text-[#1a1a1a]/65">{n.desc}</p>
                <a
                  href="#"
                  className="mt-5 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[#1a1a1a] transition-colors group-hover:text-[#6E3AFF]"
                >
                  Ler notícia{" "}
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </motion.article>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-24 flex flex-col items-start justify-between gap-6 rounded-[4px] border border-[#1a1a1a] bg-[#1a1a1a] p-10 text-white sm:flex-row sm:items-center">
            <div className="flex items-center gap-5">
              <Compass className="h-10 w-10 text-[#FFB800]" strokeWidth={1.5} />
              <div>
                <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#FFB800]">
                  Não encontrou o que buscava?
                </div>
                <div className="mt-2 text-[24px] font-bold tracking-[-0.025em] lg:text-[28px]">
                  Fale com a UNIMONTES
                </div>
              </div>
            </div>
            <Link
              to="/contato"
              className="inline-flex items-center gap-2 rounded-[4px] bg-white px-6 py-3.5 text-[12px] font-bold uppercase tracking-[0.14em] text-[#1a1a1a] transition-colors hover:bg-[#FFB800]"
            >
              Abrir contato <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
