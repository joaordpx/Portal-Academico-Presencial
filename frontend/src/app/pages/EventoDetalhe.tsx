import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { motion } from "motion/react";
import {
  ChevronRight,
  Home,
  Calendar,
  Clock,
  MapPin,
  Users,
  ArrowUpRight,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";
import { ImageWithFallback } from "../components/shared/ImageWithFallback";
import { getEvento } from "../../services/eventoService";
import { formatarDataExtenso, formatarPeriodo, diasAte } from "../../utils/data";
import type { Evento, EventoTipo } from "../../types";

const TIPO: Record<EventoTipo, { tag: string; hex: string }> = {
  Acadêmico: { tag: "bg-[#6E3AFF]/12 text-[#6E3AFF]", hex: "#6E3AFF" },
  Cultural: { tag: "bg-[#FF4D2E]/12 text-[#FF4D2E]", hex: "#FF4D2E" },
  Comunitário: { tag: "bg-[#00B894]/14 text-[#0a7d68]", hex: "#00B894" },
};

export function EventoDetalhe() {
  const { slug } = useParams();
  // Guarda o slug junto com os dados: "carregando" passa a ser derivado,
  // evitando setState síncrono dentro do efeito.
  const [carregado, setCarregado] = useState<{ slug: string; evento: Evento | null } | null>(null);

  const slugAtual = slug ?? "";

  useEffect(() => {
    let ativo = true;
    getEvento(slugAtual).then((d) => {
      if (ativo) setCarregado({ slug: slugAtual, evento: d });
    });
    return () => {
      ativo = false;
    };
  }, [slugAtual]);

  const loading = carregado?.slug !== slugAtual;
  const evento = carregado?.evento ?? null;

  if (loading) {
    return (
      <div className="mx-auto max-w-[1400px] px-6 py-24 lg:px-12">
        <div className="h-4 w-40 animate-pulse rounded bg-[#f0f0f0]" />
        <div className="mt-6 h-14 w-2/3 animate-pulse rounded bg-[#f0f0f0]" />
        <div className="mt-10 h-72 w-full animate-pulse rounded bg-[#f0f0f0]" />
      </div>
    );
  }

  if (!evento) {
    return (
      <div className="mx-auto max-w-[1400px] px-6 py-28 text-center lg:px-12">
        <p className="text-[24px] font-bold text-[#1a1a1a]">Evento não encontrado</p>
        <p className="mt-2 text-[15px] text-[#1a1a1a]/60">
          O evento que você procura não existe ou foi removido.
        </p>
        <Link
          to="/eventos"
          className="mt-8 inline-flex items-center gap-2 rounded-[6px] bg-[#1a1a1a] px-5 py-3.5 text-[12px] font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#6E3AFF]"
        >
          <ArrowLeft className="h-4 w-4" /> Ver todos os eventos
        </Link>
      </div>
    );
  }

  const dias = diasAte(evento.data);
  const jaOcorreu = dias < 0;
  const emBreve = dias >= 0 && dias <= 7;

  const infos = [
    {
      icon: Calendar,
      label: "Data",
      value: evento.dataFim
        ? formatarPeriodo(evento.data, evento.dataFim)
        : formatarDataExtenso(evento.data),
    },
    { icon: Clock, label: "Horário", value: evento.horario },
    { icon: MapPin, label: "Local", value: `${evento.local} — ${evento.campus}` },
    ...(evento.organizador
      ? [{ icon: Users, label: "Organização", value: evento.organizador }]
      : []),
  ];

  return (
    <>
      {/* Cabeçalho */}
      <section className="border-b border-[#e5e5e5] bg-white">
        <div className="mx-auto max-w-[1400px] px-6 pb-14 pt-8 lg:px-12 lg:pb-16 lg:pt-10">
          <nav className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1a1a1a]/50">
            <Link to="/" className="flex items-center gap-1.5 hover:text-[#6E3AFF]">
              <Home className="h-3 w-3" /> Início
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/eventos" className="hover:text-[#6E3AFF]">
              Eventos
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="truncate text-[#1a1a1a]">{evento.titulo}</span>
          </nav>

          <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center rounded-[4px] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] ${TIPO[evento.tipo].tag}`}
                >
                  {evento.tipo}
                </span>
                {jaOcorreu ? (
                  <span className="inline-flex items-center rounded-[4px] bg-[#1a1a1a]/[0.07] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#1a1a1a]/55">
                    Encerrado
                  </span>
                ) : emBreve ? (
                  <span className="inline-flex items-center rounded-[4px] bg-[#FF4D2E]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#FF4D2E]">
                    {dias === 0 ? "Acontece hoje" : `Em ${dias} dia${dias > 1 ? "s" : ""}`}
                  </span>
                ) : null}
                {evento.inscricoesAbertas && !jaOcorreu && (
                  <span className="inline-flex items-center rounded-[4px] bg-[#00B894]/14 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#0a7d68]">
                    Inscrições abertas
                  </span>
                )}
              </div>

              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-5 text-balance text-[34px] font-bold leading-[1.05] tracking-[-0.035em] text-[#1a1a1a] lg:text-[52px]"
              >
                {evento.titulo}
              </motion.h1>

              <p className="mt-5 max-w-2xl text-[17px] leading-[1.6] text-[#1a1a1a]/70">
                {evento.descricao}
              </p>
            </div>

            <div className="lg:col-span-5">
              <div className="overflow-hidden rounded-[10px] border border-[#e5e5e5]">
                <ImageWithFallback
                  src={evento.imagem}
                  alt={evento.titulo}
                  className="aspect-[16/10] w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Conteúdo */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1400px] px-6 py-14 lg:px-12 lg:py-16">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Texto do evento */}
            <div className="lg:col-span-7">
              {evento.conteudo && evento.conteudo.length > 0 ? (
                <>
                  <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#6E3AFF]">
                    Sobre o evento
                  </div>
                  <div className="mt-5 max-w-3xl space-y-5 text-[16px] leading-[1.7] text-[#1a1a1a]/75">
                    {evento.conteudo.map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                  </div>
                </>
              ) : (
                /* Cadastro de encaminhamento: sem texto completo no portal */
                <div className="rounded-[10px] border border-[#e5e5e5] bg-[#fafafa] p-6">
                  <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#6E3AFF]">
                    Sobre o evento
                  </div>
                  <p className="mt-3 text-[15px] leading-[1.6] text-[#1a1a1a]/70">
                    {evento.linkOficial
                      ? "As informações completas deste evento estão disponíveis na página oficial do organizador."
                      : `A programação detalhada ainda não foi divulgada. Acompanhe os canais ${
                          evento.organizador
                            ? `d${evento.organizador.startsWith("A") ? "a" : "o"} ${evento.organizador}`
                            : "do organizador"
                        } para mais informações.`}
                  </p>
                  {evento.linkOficial && (
                    <a
                      href={evento.linkOficial}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-flex items-center gap-2 rounded-[6px] bg-[#1a1a1a] px-5 py-3 text-[12px] font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#6E3AFF]"
                    >
                      <ExternalLink className="h-4 w-4" /> Ver página oficial
                    </a>
                  )}
                </div>
              )}

              <Link
                to="/eventos"
                className="mt-12 inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.14em] text-[#1a1a1a] transition-colors hover:text-[#6E3AFF]"
              >
                <ArrowLeft className="h-4 w-4" /> Voltar para eventos
              </Link>
            </div>

            {/* Painel de informações + ação */}
            <aside className="lg:col-span-5">
              <div className="lg:sticky lg:top-40">
                <div className="overflow-hidden rounded-[10px] border border-[#e5e5e5]">
                  <div className="border-b border-[#e5e5e5] bg-[#fafafa] px-5 py-3 text-[11px] font-bold uppercase tracking-[0.16em] text-[#1a1a1a]/60">
                    Informações
                  </div>
                  <ul className="divide-y divide-[#e5e5e5]">
                    {infos.map((info) => {
                      const Icon = info.icon;
                      return (
                        <li key={info.label} className="flex items-start gap-3.5 px-5 py-4">
                          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#6E3AFF]/10 text-[#6E3AFF]">
                            <Icon className="h-4 w-4" />
                          </span>
                          <div className="min-w-0">
                            <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#1a1a1a]/45">
                              {info.label}
                            </div>
                            <div className="mt-0.5 text-[15px] text-[#1a1a1a]">{info.value}</div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {evento.linkOficial && evento.conteudo && !jaOcorreu && (
                  <a
                    href={evento.linkOficial}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-[6px] bg-[#1a1a1a] px-5 py-4 text-[12px] font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#6E3AFF]"
                  >
                    {evento.inscricoesAbertas ? "Inscrever-se no evento" : "Página oficial"}
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                )}

                {evento.origem === "externo" && (
                  <p className="mt-3 text-[12px] leading-[1.5] text-[#1a1a1a]/45">
                    Informações sincronizadas do sistema oficial de eventos da universidade.
                  </p>
                )}
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
