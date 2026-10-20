import { useState } from "react";
import { LifeBuoy, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "../components/layout/PageHeader";
import {
  SectionLayout,
  PanelAccordion,
  PanelRelated,
  PanelNote,
} from "../components/layout/SectionLayout";

const popular = [
  { label: "FAQ" },
  { label: "Problemas de Acesso" },
  { label: "Glossário de Siglas" },
  { label: "Fale com a Unimontes" },
  { label: "Como Usar o Portal" },
];

const tags = ["recuperar senha", "declaração de matrícula", "edital", "WebGiz", "Wi-Fi", "PPC"];

/* ───────────── Formulário de contato ───────────── */

function FormularioContato() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ nome: "", email: "", assunto: "", mensagem: "" });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome || !form.email || !form.mensagem) {
      toast.error("Preencha os campos obrigatórios.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    toast.success("Mensagem enviada", { description: "Retornaremos em até 5 dias úteis." });
    setForm({ nome: "", email: "", assunto: "", mensagem: "" });
  };

  const campo =
    "w-full rounded-[6px] border border-[#d4d4d4] bg-white px-4 py-3 text-[14px] text-[#1a1a1a] outline-none transition-colors placeholder:text-[#1a1a1a]/40 focus:border-[#6E3AFF]";

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#1a1a1a]/50">
            Nome *
          </span>
          <input
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
            placeholder="Seu nome completo"
            className={`mt-1.5 ${campo}`}
          />
        </label>
        <label className="block">
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#1a1a1a]/50">
            E-mail *
          </span>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="seu@email.com"
            className={`mt-1.5 ${campo}`}
          />
        </label>
      </div>

      <label className="block">
        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#1a1a1a]/50">
          Assunto
        </span>
        <input
          value={form.assunto}
          onChange={(e) => setForm({ ...form, assunto: e.target.value })}
          placeholder="Sobre o que você quer falar?"
          className={`mt-1.5 ${campo}`}
        />
      </label>

      <label className="block">
        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#1a1a1a]/50">
          Mensagem *
        </span>
        <textarea
          value={form.mensagem}
          onChange={(e) => setForm({ ...form, mensagem: e.target.value })}
          rows={5}
          placeholder="Descreva sua dúvida ou solicitação"
          className={`mt-1.5 resize-y ${campo}`}
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex cursor-pointer items-center gap-2 rounded-[6px] bg-[#1a1a1a] px-6 py-3.5 text-[12px] font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#6E3AFF] disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Enviando...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" /> Enviar mensagem
          </>
        )}
      </button>
    </form>
  );
}

/* ───────────── Glossário de siglas ───────────── */

const SIGLAS = [
  { sigla: "AACC", significado: "Atividades Acadêmico-Científico-Culturais" },
  { sigla: "AIEX", significado: "Atividades de Interação Ensino-Extensão" },
  { sigla: "CCBS", significado: "Centro de Ciências Biológicas e da Saúde" },
  { sigla: "CCET", significado: "Centro de Ciências Exatas e Tecnológicas" },
  { sigla: "CCH", significado: "Centro de Ciências Humanas" },
  { sigla: "CCSA", significado: "Centro de Ciências Sociais Aplicadas" },
  { sigla: "CEPEx", significado: "Conselho de Ensino, Pesquisa e Extensão" },
  { sigla: "CONSU", significado: "Conselho Universitário" },
  { sigla: "DCE", significado: "Diretório Central dos Estudantes" },
  { sigla: "NUSI", significado: "Núcleo de Sociedade Inclusiva" },
  { sigla: "PEAES", significado: "Programa Estadual de Assistência Estudantil" },
  { sigla: "PIBIC", significado: "Programa Institucional de Bolsas de Iniciação Científica" },
  { sigla: "PPC", significado: "Projeto Pedagógico do Curso" },
  { sigla: "RU", significado: "Restaurante Universitário" },
  { sigla: "SIGEx", significado: "Sistema de Gestão da Extensão" },
  { sigla: "TCC", significado: "Trabalho de Conclusão de Curso" },
  { sigla: "WebGiz", significado: "Sistema acadêmico de notas, frequência e matrícula" },
];

function Glossario() {
  const [q, setQ] = useState("");
  const filtradas = SIGLAS.filter(
    (s) =>
      s.sigla.toLowerCase().includes(q.toLowerCase()) ||
      s.significado.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div>
      <p className="max-w-2xl text-[17px] leading-[1.6] text-[#1a1a1a]/70">
        Entenda as siglas mais usadas no dia a dia da universidade.
      </p>

      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Buscar sigla ou significado..."
        className="mt-6 w-full rounded-[6px] border border-[#d4d4d4] bg-white px-4 py-3 text-[14px] text-[#1a1a1a] outline-none transition-colors placeholder:text-[#1a1a1a]/40 focus:border-[#6E3AFF]"
      />

      {filtradas.length === 0 ? (
        <p className="py-12 text-center text-[14px] text-[#1a1a1a]/55">
          Nenhuma sigla encontrada para "{q}".
        </p>
      ) : (
        <dl className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {filtradas.map((s) => (
            <div
              key={s.sigla}
              className="rounded-[8px] border border-[#e5e5e5] bg-white px-5 py-4 transition-colors hover:border-[#6E3AFF]/40"
            >
              <dt className="text-[15px] font-bold tracking-[-0.01em] text-[#6E3AFF]">{s.sigla}</dt>
              <dd className="mt-1 text-[13.5px] leading-[1.5] text-[#1a1a1a]/70">
                {s.significado}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}

/* ───────────── Seções ───────────── */

const sections = [
  {
    id: "como-usar",
    label: "Como Usar o Portal",
    content: (
      <>
        <PanelAccordion
          intro="Entenda como navegar pelo portal e encontrar o que você precisa mais rápido."
          itens={[
            {
              titulo: "Como encontrar informações do meu curso",
              conteudo:
                "Acesse a seção Cursos, use a busca ou os filtros por centro, turno e área do conhecimento. Na página do curso você encontra matriz curricular, PPC, ementas, estágio, TCC, documentos e contato da coordenação.",
            },
            {
              titulo: "Como usar a busca do portal",
              conteudo:
                "A busca no topo da página procura por páginas, serviços e documentos. Digite o que você precisa em linguagem natural — por exemplo, “declaração de matrícula” ou “onde fica a secretaria”.",
            },
            {
              titulo: "O que encontro em cada seção",
              conteudo:
                "Vida Acadêmica reúne calendário, matrícula, biblioteca e normas. Serviços e Documentos concentra sistemas e requerimentos. Editais e Oportunidades lista bolsas e estágios. Unidades e Localização ajuda a se localizar no campus.",
            },
            {
              titulo: "Recursos de acessibilidade",
              conteudo:
                "O portal oferece alto contraste, ajuste de fonte e leitura assistida na barra superior. As páginas também são navegáveis por teclado e compatíveis com leitores de tela.",
            },
          ]}
        />
        <PanelRelated
          links={[
            { label: "FAQ", to: "/ajuda-suporte" },
            { label: "Glossário de Siglas", to: "/ajuda-suporte" },
            { label: "Fale com a Unimontes", to: "/ajuda-suporte" },
          ]}
        />
      </>
    ),
  },
  {
    id: "faq",
    label: "FAQ",
    content: (
      <>
        <PanelAccordion
          intro="Respostas para as dúvidas mais frequentes dos estudantes."
          itens={[
            {
              titulo: "Como faço minha renovação de matrícula?",
              conteudo:
                "A renovação é feita pelo WebGiz, dentro do prazo do calendário acadêmico. O passo a passo completo está em Vida Acadêmica › Matrícula e Renovação de Matrícula.",
            },
            {
              titulo: "Como emito minha declaração de matrícula?",
              conteudo:
                "A emissão é feita online pelo WebGiz. Se precisar de um documento assinado, procure a Secretaria Geral.",
            },
            {
              titulo: "Onde vejo o calendário acadêmico?",
              conteudo:
                "O calendário oficial fica no site da universidade e é atualizado a cada semestre. O acesso direto está em Vida Acadêmica › Calendário Acadêmico.",
            },
            {
              titulo: "Como solicito segunda chamada de prova?",
              conteudo:
                "A solicitação é feita por requerimento, com justificativa e documentação comprobatória, dentro do prazo previsto nas normas acadêmicas.",
            },
            {
              titulo: "Como consulto minhas notas e frequência?",
              conteudo:
                "Notas e frequência ficam disponíveis no WebGiz, na área do estudante, por disciplina e período letivo.",
            },
            {
              titulo: "Quem procuro para dúvidas sobre o meu curso?",
              conteudo:
                "A coordenação do curso. O contato está na página do seu curso, na aba Coordenação.",
            },
          ]}
        />
        <PanelRelated
          links={[
            { label: "Problemas de Acesso", to: "/ajuda-suporte" },
            { label: "Serviços e Documentos", to: "/servicos-documentos" },
            { label: "Fale com a Unimontes", to: "/ajuda-suporte" },
          ]}
        />
      </>
    ),
  },
  {
    id: "problemas-acesso",
    label: "Problemas de Acesso",
    content: (
      <>
        <PanelAccordion
          intro="Soluções para as dificuldades mais comuns de acesso aos sistemas da universidade."
          itens={[
            {
              titulo: "Esqueci minha senha do WebGiz",
              conteudo:
                "Use a opção de recuperação de senha na tela de login do WebGiz. Se o e-mail cadastrado estiver desatualizado, procure a Secretaria Geral para atualizá-lo.",
            },
            {
              titulo: "Não consigo acessar meu e-mail institucional",
              conteudo:
                "Confirme se está usando o endereço institucional completo. Persistindo o problema, entre em contato com o suporte técnico.",
            },
            {
              titulo: "Não consigo conectar no Wi-Fi do campus",
              conteudo:
                "Verifique se está selecionando a rede oficial da universidade e usando suas credenciais institucionais. Em caso de falha, procure o suporte técnico.",
            },
            {
              titulo: "O portal não carrega ou está lento",
              conteudo:
                "Tente atualizar a página, limpar o cache do navegador ou acessar por outro dispositivo. Se o problema continuar, relate pelo formulário de contato.",
            },
            {
              titulo: "Minha matrícula não aparece no sistema",
              conteudo:
                "Isso pode ocorrer se a matrícula ainda não foi efetivada. Verifique sua situação com a Secretaria Geral.",
            },
          ]}
        />
        <PanelRelated
          links={[
            { label: "Recursos Tecnológicos", to: "/vida-academica" },
            { label: "FAQ", to: "/ajuda-suporte" },
            { label: "Fale com a Unimontes", to: "/ajuda-suporte" },
          ]}
        />
      </>
    ),
  },
  {
    id: "glossario",
    label: "Glossário de Siglas",
    content: (
      <>
        <Glossario />
        <PanelRelated
          links={[
            { label: "Como Usar o Portal", to: "/ajuda-suporte" },
            { label: "FAQ", to: "/ajuda-suporte" },
            { label: "Cursos", to: "/cursos" },
          ]}
        />
      </>
    ),
  },
  {
    id: "fale-conosco",
    label: "Fale com a Unimontes",
    content: (
      <>
        <PanelAccordion
          intro="Entre em contato por formulário, telefone ou e-mail, e consulte os setores responsáveis e os prazos de resposta."
          itens={[
            { titulo: "Formulário de contato", conteudo: <FormularioContato /> },
            {
              titulo: "Telefones",
              conteudo: (
                <ul className="space-y-1.5">
                  <li>Telefone principal: (38) 3229-8000</li>
                  <li>Secretaria Geral: (38) 3229-8000</li>
                  <li>Biblioteca Central: (38) 3229-8300</li>
                  <li>Restaurante Universitário: (38) 3229-8400</li>
                </ul>
              ),
            },
            {
              titulo: "E-mails",
              conteudo: (
                <ul className="space-y-1.5">
                  <li>Geral: contato@unimontes.br</li>
                  <li>Secretaria Geral: secretaria@unimontes.br</li>
                  <li>Biblioteca: biblioteca@unimontes.br</li>
                  <li>NUSI: nusi@unimontes.br</li>
                </ul>
              ),
            },
            {
              titulo: "Setores responsáveis",
              conteudo:
                "Documentos e matrícula: Secretaria Geral. Dúvidas do curso: coordenação do curso. Auxílios e permanência: Assistência Estudantil. Acessibilidade: NUSI. Problemas técnicos: suporte de tecnologia da informação.",
            },
            {
              titulo: "Prazos de resposta",
              conteudo:
                "Mensagens enviadas pelo formulário são respondidas em até 5 dias úteis. Requerimentos protocolados seguem o prazo previsto para cada tipo de solicitação.",
            },
          ]}
        />

        <PanelNote>
          <strong className="font-bold">Informações importantes:</strong> telefone principal (38)
          3229-8000 · e-mail geral contato@unimontes.br · atendimento de segunda a sexta, 08h às 18h
          · prazo de resposta de até 5 dias úteis.
        </PanelNote>

        <PanelRelated
          links={[
            { label: "FAQ", to: "/ajuda-suporte" },
            { label: "Problemas de Acesso", to: "/ajuda-suporte" },
            { label: "Unidades e Localização", to: "/unidades-localizacao" },
          ]}
        />
      </>
    ),
  },
];

const related = [
  { label: "Serviços e Documentos", to: "/servicos-documentos" },
  { label: "Vida Acadêmica", to: "/vida-academica" },
  { label: "Unidades e Localização", to: "/unidades-localizacao" },
];

export function AjudaSuporte() {
  return (
    <>
      <PageHeader
        eyebrow="Ajuda e Suporte"
        title="Precisa de ajuda? Comece por aqui."
        description="Encontre tutoriais, respostas para dúvidas frequentes, soluções para problemas de acesso, glossário de siglas e canais de atendimento."
        icon={LifeBuoy}
      />
      <SectionLayout
        popular={popular}
        tags={tags}
        searchPlaceholder="Busque por matrícula, documentos, WebGiz, senha, editais ou suporte"
        sections={sections}
        related={related}
      />
    </>
  );
}
