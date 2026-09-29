import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronRight,
  Home,
  CheckCircle2,
  FileText,
  Download,
  BookOpen,
  Mail,
  Phone,
  MapPin,
  Clock,
  User,
} from "lucide-react";
import type { InfoItem } from "../../types";
import { ImageWithFallback } from "../components/shared/ImageWithFallback";
import { Reveal } from "../components/shared/Reveal";
import { getCurso } from "../../services/cursoService";
import type { CursoDetalheView as CursoDetalheType } from "../../types";

const TABS = [
  { id: "sobre", label: "Sobre o Curso" },
  { id: "matriz", label: "Matriz e PPC" },
  { id: "estagio", label: "Estágio e TCC" },
  { id: "documentos", label: "Documentos" },
  { id: "coordenacao", label: "Coordenação" },
  { id: "atletica", label: "Atlética" },
];

export function CursoDetalhe() {
  const { slug } = useParams();
  const [tab, setTab] = useState("sobre");
  // Guarda o slug junto com os dados: assim "carregando" é derivado da
  // comparação com o slug atual, sem precisar de setState dentro do efeito.
  const [carregado, setCarregado] = useState<{
    slug: string;
    curso: CursoDetalheType | null;
  } | null>(null);

  const slugAtual = slug ?? "direito";

  useEffect(() => {
    let ativo = true;
    getCurso(slugAtual).then((data) => {
      if (ativo) setCarregado({ slug: slugAtual, curso: data });
    });
    return () => {
      ativo = false;
    };
  }, [slugAtual]);

  const loading = carregado?.slug !== slugAtual;
  const curso = carregado?.curso ?? null;

  if (loading || !curso) {
    return (
      <div className="mx-auto max-w-[1400px] px-6 py-24 lg:px-12">
        <div className="h-4 w-40 animate-pulse rounded bg-[#f0f0f0]" />
        <div className="mt-6 h-16 w-2/3 animate-pulse rounded bg-[#f0f0f0]" />
        <div className="mt-10 h-64 w-full animate-pulse rounded bg-[#f0f0f0]" />
      </div>
    );
  }

  return (
    <>
      {/* Breadcrumb + header card */}
      <section className="border-b border-[#e5e5e5] bg-white">
        <div className="mx-auto max-w-[1400px] px-6 pb-16 pt-8 lg:px-12 lg:pb-20 lg:pt-10">
          <nav className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1a1a1a]/50">
            <Link to="/" className="flex items-center gap-1.5 hover:text-[#6E3AFF]">
              <Home className="h-3 w-3" /> Início
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/cursos" className="hover:text-[#6E3AFF]">
              Cursos
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-[#1a1a1a]">{curso.nome}</span>
          </nav>

          <div className="mt-9 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-8">
              <div className="flex items-center gap-3 text-[12px] font-bold uppercase tracking-[0.18em] text-[#6E3AFF]">
                <span className="h-px w-10 bg-[#6E3AFF]" />
                {curso.eyebrow}
              </div>
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-7 text-balance text-[38px] font-bold leading-[0.95] tracking-[-0.04em] text-[#1a1a1a] lg:text-[60px]"
              >
                {curso.nome}
              </motion.h1>
              <div className="mt-12 grid max-w-xl grid-cols-3 gap-0 border-y border-[#e5e5e5]">
                {[
                  ["Tipo", curso.tipo],
                  ["Duração", curso.duracaoLabel],
                  ["Grau", curso.grau],
                ].map(([k, v], i) => (
                  <div
                    key={k}
                    className={`py-6 ${i < 2 ? "border-r border-[#e5e5e5] pr-4" : "pl-4"}`}
                  >
                    <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#1a1a1a]/50">
                      {k}
                    </div>
                    <div className="mt-2 text-[22px] font-bold tracking-[-0.02em] text-[#1a1a1a]">
                      {v}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-4">
              <div className="overflow-hidden rounded-[6px] border border-[#e5e5e5]">
                <ImageWithFallback
                  src={curso.imagem}
                  alt={`Curso de ${curso.nome}`}
                  className="aspect-[16/10] w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs — estilo pílula, mais claramente clicáveis */}
      <section className="sticky top-[125px] z-30 border-b border-[#e5e5e5] bg-white/95 backdrop-blur">
        <div className="mx-auto max-w-[1400px] px-6 py-3 lg:px-12">
          <div className="flex gap-1.5 overflow-x-auto">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`relative shrink-0 cursor-pointer whitespace-nowrap rounded-full px-5 py-2.5 text-[12.5px] font-bold uppercase tracking-[0.1em] transition-colors ${
                  tab === t.id
                    ? "text-white"
                    : "text-[#1a1a1a]/55 hover:bg-[#1a1a1a]/[0.05] hover:text-[#1a1a1a]"
                }`}
              >
                {tab === t.id && (
                  <motion.span
                    layoutId="course-tab"
                    className="absolute inset-0 rounded-full bg-[#1a1a1a]"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Panel content */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1400px] px-6 py-16 lg:px-12 lg:py-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
            >
              {tab === "sobre" && <Sobre curso={curso} />}
              {tab === "matriz" && <MatrizPPC curso={curso} />}
              {tab === "estagio" && <EstagioTCC curso={curso} />}
              {tab === "documentos" && <Documentos curso={curso} />}
              {tab === "coordenacao" && <Coordenacao curso={curso} />}
              {tab !== "sobre" &&
                tab !== "matriz" &&
                tab !== "estagio" &&
                tab !== "documentos" &&
                tab !== "coordenacao" && (
                  <Placeholder label={TABS.find((t) => t.id === tab)?.label ?? ""} />
                )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </>
  );
}

/* Cabeçalho de seção horizontal reutilizado dentro do painel */
function SectionTitle({ eyebrow, title }: { eyebrow: string; title?: string }) {
  return (
    <div>
      <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#6E3AFF]">
        {eyebrow}
      </div>
      {title && (
        <h2 className="mt-4 text-balance text-[28px] font-bold leading-[1.1] tracking-[-0.03em] text-[#1a1a1a] lg:text-[38px]">
          {title}
        </h2>
      )}
    </div>
  );
}

function Sobre({ curso }: { curso: CursoDetalheType }) {
  return (
    <div className="space-y-16 lg:space-y-20">
      {/* Descrição — seção horizontal */}
      <section>
        <SectionTitle
          eyebrow="Descrição do curso"
          title={`Forme-se em ${curso.nome} na Unimontes.`}
        />
        <div className="mt-6 max-w-3xl space-y-5 text-[16px] leading-[1.65] text-[#1a1a1a]/70">
          {curso.descricao.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </section>

      {/* Dados do curso — faixa horizontal de indicadores */}
      <section>
        <SectionTitle eyebrow="Dados do curso" />
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {curso.dados.map((d) => (
            <div key={d.rotulo} className="rounded-[8px] border border-[#e5e5e5] p-4">
              <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#1a1a1a]/45">
                {d.rotulo}
              </div>
              <div className="mt-1.5 text-[16px] font-bold tracking-[-0.01em] text-[#1a1a1a]">
                {d.valor}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Perfil do egresso — seção horizontal */}
      <section>
        <SectionTitle eyebrow="Perfil do egresso" />
        <ul className="mt-6 grid grid-cols-1 gap-x-12 gap-y-0 sm:grid-cols-2">
          {curso.perfilEgresso.map((p) => (
            <li key={p} className="flex items-start gap-4 border-b border-[#e5e5e5] py-4">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#6E3AFF]" strokeWidth={2} />
              <span className="text-[15px] leading-[1.55] text-[#1a1a1a]/80">{p}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Mercado de trabalho — seção horizontal */}
      <section>
        <SectionTitle eyebrow="Mercado de trabalho" />
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {curso.mercadoTrabalho.map((m, i) => (
            <Reveal key={m.titulo} delay={(i % 4) * 0.04}>
              <div className="h-full rounded-[8px] border border-[#e5e5e5] p-5">
                <div className="text-[15px] font-bold tracking-[-0.015em] text-[#1a1a1a]">
                  {m.titulo}
                </div>
                <p className="mt-2 text-[13px] leading-[1.55] text-[#1a1a1a]/65">{m.descricao}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}

function DocButton({
  icon: Icon,
  label,
  href = "#",
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href?: string;
}) {
  return (
    <a
      href={href}
      className="group inline-flex items-center gap-2.5 rounded-[6px] border border-[#e5e5e5] px-4 py-2.5 text-[12px] font-bold uppercase tracking-[0.12em] text-[#1a1a1a] transition-colors hover:border-[#6E3AFF] hover:text-[#6E3AFF]"
    >
      <Icon className="h-4 w-4" />
      {label}
    </a>
  );
}

function MatrizPPC({ curso }: { curso: CursoDetalheType }) {
  const blocos = [
    {
      eyebrow: "Currículo",
      title: "Matriz Curricular",
      paragrafos: [
        `A matriz curricular do curso de ${curso.nome} está organizada em ${curso.duracao} períodos semestrais, totalizando 3.700 horas, distribuídas em disciplinas obrigatórias, optativas, atividades complementares, estágio supervisionado e trabalho de conclusão de curso.`,
        "O currículo contempla as áreas de formação fundamental, profissional e prática, garantindo uma formação sólida e completa para o exercício da profissão.",
      ],
      action: { icon: Download, label: "Ver matriz curricular", href: curso.documentos.matrizUrl },
    },
    {
      eyebrow: "Documento oficial",
      title: "PPC — Projeto Pedagógico do Curso",
      paragrafos: [
        "O Projeto Pedagógico do Curso (PPC) é o documento que define a identidade do curso, seus objetivos, metodologia, organização curricular, sistema de avaliação e infraestrutura disponível.",
        `O PPC foi elaborado de acordo com as Diretrizes Curriculares Nacionais dos cursos de graduação em ${curso.nome} e é periodicamente avaliado para garantir a excelência na formação dos estudantes.`,
      ],
      action: { icon: FileText, label: "Ver PPC", href: curso.documentos.ppcUrl },
    },
    {
      eyebrow: "Disciplinas",
      title: "Ementas e Disciplinas",
      paragrafos: [
        "As ementas descrevem o conteúdo programático de cada disciplina oferecida no curso, incluindo objetivos, bibliografia básica e complementar, metodologia e sistema de avaliação.",
        `Consulte as ementas para conhecer em detalhes os temas abordados em cada disciplina do curso de ${curso.nome}.`,
      ],
      action: { icon: BookOpen, label: "Consultar ementas", href: curso.documentos.ementasUrl },
    },
  ];

  return (
    <div className="divide-y divide-[#e5e5e5]">
      {blocos.map((b, i) => (
        <section key={b.title} className={i === 0 ? "pb-14" : "py-14 last:pb-0"}>
          <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#6E3AFF]">
            {b.eyebrow}
          </div>
          <h2 className="mt-4 text-balance text-[26px] font-bold leading-[1.1] tracking-[-0.025em] text-[#1a1a1a] lg:text-[32px]">
            {b.title}
          </h2>
          <div className="mt-5 max-w-3xl space-y-4 text-[16px] leading-[1.65] text-[#1a1a1a]/70">
            {b.paragrafos.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <div className="mt-7">
            <DocButton icon={b.action.icon} label={b.action.label} href={b.action.href} />
          </div>
        </section>
      ))}
    </div>
  );
}

/* Caixa de informações rótulo/valor (ex.: "Informações importantes") */
function InfoBox({ title, items }: { title: string; items: InfoItem[] }) {
  return (
    <div className="mt-8 overflow-hidden rounded-[8px] border border-[#e5e5e5]">
      <div className="border-b border-[#e5e5e5] bg-[#fafafa] px-5 py-3 text-[11px] font-bold uppercase tracking-[0.16em] text-[#1a1a1a]/60">
        {title}
      </div>
      <dl className="divide-y divide-[#e5e5e5]">
        {items.map((it) => (
          <div key={it.rotulo} className="flex flex-col gap-0.5 px-5 py-3 sm:flex-row sm:gap-4">
            <dt className="w-44 shrink-0 text-[13px] font-bold text-[#1a1a1a]">{it.rotulo}</dt>
            <dd className="text-[14px] leading-[1.5] text-[#1a1a1a]/70">{it.valor}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/* Subtítulo interno de uma seção (eyebrow roxo) */
function MiniHead({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-10 text-[10px] font-bold uppercase tracking-[0.22em] text-[#6E3AFF]">
      {children}
    </div>
  );
}

function EstagioTCC({ curso }: { curso: CursoDetalheType }) {
  const { estagio, tcc } = curso;
  return (
    <div className="divide-y divide-[#e5e5e5]">
      {/* ── Estágio ── */}
      <section className="pb-16">
        <SectionTitle eyebrow="Prática profissional" title="Estágio" />
        <p className="mt-6 max-w-3xl text-[16px] leading-[1.65] text-[#1a1a1a]/70">
          {estagio.intro}
        </p>

        <InfoBox title="Informações importantes" items={estagio.informacoes} />

        <p className="mt-6 max-w-3xl text-[16px] leading-[1.65] text-[#1a1a1a]/70">
          {estagio.descricao}
        </p>

        <MiniHead>Documentos necessários</MiniHead>
        <ul className="mt-4 grid grid-cols-1 gap-x-12 gap-y-0 sm:grid-cols-2">
          {estagio.documentosNecessarios.map((d) => (
            <li key={d} className="flex items-start gap-3 border-b border-[#e5e5e5] py-3">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#6E3AFF]" strokeWidth={2} />
              <span className="text-[15px] leading-[1.5] text-[#1a1a1a]/80">{d}</span>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex items-center gap-2.5 text-[14px]">
          <Mail className="h-4 w-4 text-[#1a1a1a]/45" />
          <span className="font-bold text-[#1a1a1a]">Contato:</span>
          <a href={`mailto:${estagio.contatoEmail}`} className="text-[#2563EB] hover:underline">
            {estagio.contatoEmail}
          </a>
        </div>
      </section>

      {/* ── TCC ── */}
      <section className="py-16 last:pb-0">
        <SectionTitle eyebrow="Conclusão de curso" title="TCC — Trabalho de Conclusão de Curso" />
        <p className="mt-6 max-w-3xl text-[16px] leading-[1.65] text-[#1a1a1a]/70">{tcc.intro}</p>

        <InfoBox title="Orientações gerais" items={tcc.orientacoes} />

        <p className="mt-6 max-w-3xl text-[16px] leading-[1.65] text-[#1a1a1a]/70">
          {tcc.descricao}
        </p>

        <MiniHead>Etapas do TCC</MiniHead>
        <ol className="mt-4 space-y-3">
          {tcc.etapas.map((e, i) => (
            <li key={e} className="flex items-center gap-3.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#1a1a1a] text-[12px] font-bold text-[#1a1a1a]">
                {i + 1}
              </span>
              <span className="text-[15px] leading-[1.5] text-[#1a1a1a]/80">{e}</span>
            </li>
          ))}
        </ol>

        <MiniHead>Documentos importantes</MiniHead>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {tcc.documentos.map((d) => (
            <DocButton key={d.label} icon={FileText} label={d.label} href={d.url} />
          ))}
        </div>
      </section>
    </div>
  );
}

function Documentos({ curso }: { curso: CursoDetalheType }) {
  const destaques = curso.arquivos.filter((a) => a.destaque);
  const outros = curso.arquivos.filter((a) => !a.destaque);

  return (
    <div className="space-y-14">
      {/* Documentos em destaque — mais acessados */}
      {destaques.length > 0 && (
        <section>
          <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#6E3AFF]">
            Mais acessados
          </div>
          <h2 className="mt-4 text-balance text-[26px] font-bold leading-[1.1] tracking-[-0.025em] text-[#1a1a1a] lg:text-[32px]">
            Documentos em destaque
          </h2>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {destaques.map((a) => (
              <a
                key={a.label}
                href={a.url ?? "#"}
                className="group flex h-full flex-col rounded-[10px] border border-[#e5e5e5] bg-white p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#6E3AFF]/50 hover:shadow-[0_10px_28px_rgba(110,58,255,0.12)]"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-[8px] bg-[#6E3AFF]/10 text-[#6E3AFF]">
                  <FileText className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-[17px] font-bold tracking-[-0.01em] text-[#1a1a1a]">
                  {a.label}
                </h3>
                {a.desc && (
                  <p className="mt-1.5 flex-1 text-[13px] leading-[1.5] text-[#1a1a1a]/60">
                    {a.desc}
                  </p>
                )}
                <span className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#1a1a1a] transition-colors group-hover:text-[#6E3AFF]">
                  <Download className="h-3.5 w-3.5" /> Baixar
                </span>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Todos os demais arquivos — lista compacta */}
      {outros.length > 0 && (
        <section>
          <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#6E3AFF]">
            Todos os arquivos
          </div>
          <h2 className="mt-4 text-balance text-[26px] font-bold leading-[1.1] tracking-[-0.025em] text-[#1a1a1a] lg:text-[32px]">
            Outros documentos
          </h2>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {outros.map((a) => (
              <a
                key={a.label}
                href={a.url ?? "#"}
                className="group flex items-center justify-between gap-3 rounded-[8px] border border-[#e5e5e5] bg-white px-4 py-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#6E3AFF]/50"
              >
                <span className="flex items-center gap-3">
                  <FileText className="h-4 w-4 shrink-0 text-[#1a1a1a]/40" />
                  <span className="text-[14px] font-semibold leading-[1.35] text-[#1a1a1a]">
                    {a.label}
                  </span>
                </span>
                <Download className="h-4 w-4 shrink-0 text-[#1a1a1a]/30 transition-colors group-hover:text-[#6E3AFF]" />
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Coordenacao({ curso }: { curso: CursoDetalheType }) {
  const c = curso.coordenacao;
  const linhas = [
    { icon: User, label: "Coordenador(a)", value: c.coordenador },
    { icon: Mail, label: "E-mail", value: c.email, href: `mailto:${c.email}` },
    {
      icon: Phone,
      label: "Telefone",
      value: c.telefone,
      href: `tel:${c.telefone.replace(/[^\d+]/g, "")}`,
    },
    { icon: MapPin, label: "Localização", value: c.localizacao },
    { icon: Clock, label: "Horário de atendimento", value: c.horarioAtendimento },
  ];

  return (
    <section>
      <SectionTitle eyebrow="Contato" title="Coordenação do Curso" />
      <p className="mt-6 max-w-3xl text-[16px] leading-[1.65] text-[#1a1a1a]/70">{c.intro}</p>

      <div className="mt-8 max-w-2xl overflow-hidden rounded-[10px] border border-[#e5e5e5]">
        <ul className="divide-y divide-[#e5e5e5]">
          {linhas.map((l) => {
            const Icon = l.icon;
            return (
              <li key={l.label} className="flex items-start gap-4 px-5 py-4">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#6E3AFF]/10 text-[#6E3AFF]">
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#1a1a1a]/45">
                    {l.label}
                  </div>
                  {l.href ? (
                    <a
                      href={l.href}
                      className="mt-0.5 block text-[15px] text-[#2563EB] hover:underline"
                    >
                      {l.value}
                    </a>
                  ) : (
                    <div className="mt-0.5 text-[15px] text-[#1a1a1a]">{l.value}</div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <a
        href={`mailto:${c.email}`}
        className="mt-6 inline-flex items-center gap-2 rounded-[6px] bg-[#1a1a1a] px-5 py-3.5 text-[12px] font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#6E3AFF]"
      >
        <Mail className="h-4 w-4" /> Falar com a coordenação
      </a>
    </section>
  );
}

function Placeholder({ label }: { label: string }) {
  return (
    <div className="border-t border-[#e5e5e5] py-20 text-center">
      <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#1a1a1a]/40">
        Em construção
      </div>
      <h3 className="mt-4 text-balance text-[32px] font-bold tracking-[-0.025em] text-[#1a1a1a]">
        Conteúdo de <em className="font-light italic">{label}</em>
      </h3>
      <p className="mx-auto mt-3 max-w-md text-[15px] text-[#1a1a1a]/60">
        Esta seção será publicada em breve com matriz curricular, ementas, documentos e contatos da
        coordenação.
      </p>
    </div>
  );
}
