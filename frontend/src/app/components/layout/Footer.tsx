import {
  Instagram,
  Facebook,
  Youtube,
  Linkedin,
  ArrowUpRight,
  Phone,
  Clock,
  Shield,
} from "lucide-react";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 2.1.55 4.15 1.6 5.96L2 22l4.25-1.11a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m0 1.67c2.2 0 4.27.86 5.82 2.42a8.2 8.2 0 0 1 2.41 5.82c0 4.54-3.7 8.23-8.24 8.23a8.2 8.2 0 0 1-4.2-1.15l-.3-.18-2.52.66.67-2.46-.2-.31a8.2 8.2 0 0 1-1.26-4.4c0-4.54 3.7-8.23 8.25-8.23m4.71 10.79c-.06-.1-.23-.17-.5-.3-.26-.13-1.55-.76-1.79-.85-.24-.09-.42-.13-.6.13-.17.26-.68.85-.83 1.03-.15.17-.3.19-.57.06-.26-.13-1.1-.41-2.1-1.3-.78-.69-1.3-1.55-1.45-1.81-.15-.26-.02-.4.11-.53.12-.12.26-.3.4-.46.13-.15.17-.26.26-.44.09-.17.04-.33-.02-.46-.06-.13-.6-1.44-.82-1.97-.22-.53-.44-.46-.6-.46-.15-.01-.33-.01-.5-.01a.98.98 0 0 0-.7.33c-.24.26-.92.9-.92 2.2 0 1.3.94 2.55 1.07 2.73.13.17 1.85 2.82 4.48 3.96.63.27 1.11.43 1.49.55.63.2 1.2.17 1.65.1.5-.07 1.55-.63 1.77-1.24.22-.61.22-1.13.15-1.24" />
    </svg>
  );
}

const sitemap = [
  {
    title: "Estude na Unimontes",
    links: ["Como ingressar", "Cursos Ofertados", "Editais de Ingresso", "Cursos gratuitos"],
  },
  {
    title: "Sou Calouro",
    links: ["Manual do Calouro", "Primeiros Passos", "Acesso aos Sistemas", "Mapa do Campus"],
  },
  {
    title: "Vida Acadêmica",
    links: [
      "Calendário Acadêmico",
      "Matrícula e Rematrícula",
      "Biblioteca",
      "Atividades Extracurriculares",
      "Recursos Tecnológicos",
      "Normas Acadêmicas",
      "Tutoriais",
    ],
  },
  {
    title: "Cursos",
    links: ["Centros de Ensino", "Catálogo de cursos", "Coordenações"],
  },
  {
    title: "Serviços e Documentos",
    links: [
      "Documentos acadêmicos",
      "Requerimentos",
      "Formulários",
      "Protocolos e Prazos",
      "Sistemas Acadêmicos",
    ],
  },
  {
    title: "Editais e Oportunidades",
    links: [
      "Editais",
      "Estágios",
      "Bolsas e Monitorias",
      "Eventos e Cursos",
      "Pesquisa e Extensão",
    ],
  },
  {
    title: "Assistência Estudantil",
    links: ["Auxílios", "Saúde e Bem-estar", "Acessibilidade e Inclusão", "Direitos do Estudante"],
  },
  {
    title: "Movimento Estudantil e Lazer",
    links: [
      "DCE",
      "Centros Acadêmicos",
      "Atléticas",
      "Eventos",
      "Esporte e Lazer",
      "Reserva de Espaços",
    ],
  },
  {
    title: "Unidades e Localização",
    links: ["Campus Montes Claros", "Demais Unidades"],
  },
  {
    title: "Ajuda e Suporte",
    links: [
      "Como usar o portal",
      "Perguntas Frequentes (FAQ)",
      "Problemas de Acesso",
      "Glossário de Siglas",
      "Fale com a UNIMONTES",
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-white text-[#1a1a1a]">
      {/* ─── OUVIDORIA ─── */}
      <section className="border-y border-[#e5e5e5] bg-[#f2f2f2]">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-6 py-12 lg:grid-cols-12 lg:items-center lg:gap-12 lg:px-12 lg:py-14">
          <div className="lg:col-span-4">
            <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#6E3AFF]">
              Ouvidoria
            </div>
            <div className="mt-2.5 text-[20px] font-bold leading-[1.2] tracking-[-0.02em] text-[#1a1a1a]">
              Ouvidoria-Geral do Estado de Minas Gerais
            </div>
            <p className="mt-3 max-w-sm text-[14px] leading-[1.55] text-[#1a1a1a]/55">
              Canal para registrar sugestões, elogios, reclamações e denúncias.
            </p>
          </div>

          <div className="lg:col-span-5">
            <ul className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
              {[
                { icon: Clock, k: "Atendimento", v: "Seg–sex · 08h às 17h" },
                { icon: WhatsAppIcon, k: "WhatsApp", v: "(31) 3915-0500" },
                { icon: Phone, k: "Disque-Ouvidoria", v: "162" },
                { icon: Shield, k: "Disque-Saúde", v: "136" },
              ].map((c) => {
                const Icon = c.icon;
                return (
                  <li key={c.k} className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#e5e5e5] bg-white text-[#1a1a1a]/70">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#1a1a1a]/45">
                        {c.k}
                      </div>
                      <div className="mt-0.5 text-[14px] font-semibold text-[#1a1a1a]">{c.v}</div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="lg:col-span-3 lg:text-right">
            <a
              href="#"
              className="group inline-flex items-center gap-2 rounded-[6px] bg-[#1a1a1a] px-5 py-3.5 text-[11px] font-bold uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#6E3AFF]"
            >
              Acessar site da Ouvidoria
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>
      </section>

      {/* ─── MAPA DO SITE (sem título, é o próprio rodapé) ─── */}
      <div className="mx-auto max-w-[1400px] px-6 pt-16 lg:px-12 lg:pt-20">
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 pb-16 sm:grid-cols-2 lg:grid-cols-5">
          {sitemap.map((col) => (
            <div key={col.title}>
              <div className="mb-4 text-[15px] font-bold tracking-[-0.01em] text-[#1a1a1a]">
                {col.title}
              </div>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-[13px] leading-[1.5] text-[#2563EB] transition-colors hover:text-[#1d4ed8] hover:underline"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ─── RODAPÉ INFERIOR ─── */}
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="grid grid-cols-1 gap-8 border-t border-[#e5e5e5] py-10 text-[13px] text-[#1a1a1a]/60 lg:grid-cols-4">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#1a1a1a]/40">
              Endereço
            </div>
            <div className="mt-2">
              Av. Prof. Rui Braga, s/n
              <br />
              Vila Mauricéia · Montes Claros/MG
            </div>
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#1a1a1a]/40">
              Contato
            </div>
            <div className="mt-2">
              (38) 3229-8000
              <br />
              secretaria@unimontes.br
            </div>
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#1a1a1a]/40">
              Atendimento
            </div>
            <div className="mt-2">
              Segunda a sexta
              <br />
              8h às 18h
            </div>
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#1a1a1a]/40">
              Redes
            </div>
            <div className="mt-3 flex gap-2">
              {[Instagram, Facebook, Youtube, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-[4px] border border-[#e5e5e5] text-[#1a1a1a] transition-colors hover:border-[#6E3AFF] hover:bg-[#6E3AFF] hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-3 border-t border-[#e5e5e5] py-8 text-[11px] uppercase tracking-[0.16em] text-[#1a1a1a]/40 sm:flex-row sm:items-center">
          <div className="font-bold text-[#1a1a1a]">UNIMONTES · Portal Acadêmico</div>
          <div>© 2026 — Universidade Estadual de Montes Claros</div>
          <div className="flex gap-5">
            <a href="#" className="hover:text-[#6E3AFF]">
              Privacidade
            </a>
            <a href="#" className="hover:text-[#6E3AFF]">
              Termos
            </a>
            <a href="#" className="hover:text-[#6E3AFF]">
              Acessibilidade
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
