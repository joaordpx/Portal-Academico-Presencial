import { ArrowUpRight, FileText } from "lucide-react";
import { PageHeader } from "../components/layout/PageHeader";
import { SectionLayout, PanelLinks, PanelRelated } from "../components/layout/SectionLayout";

const popular = [
  { label: "WebGiz" },
  { label: "Documentos Acadêmicos" },
  { label: "Requerimentos" },
  { label: "Protocolos e Prazos" },
  { label: "Outros Sistemas Acadêmicos" },
];

const tags = [
  "declaração de matrícula",
  "histórico escolar",
  "segunda chamada",
  "trancamento",
  "recuperar senha",
];

// Alvos dos "Links relacionados" (rotas do portal)
const R = {
  webgiz: "/servicos-documentos",
  documentos: "/servicos-documentos",
  requerimentos: "/servicos-documentos",
  formularios: "/servicos-documentos",
  protocolos: "/servicos-documentos",
  matricula: "/vida-academica",
  recursos: "/vida-academica",
  ajuda: "/contato",
};

const sections = [
  {
    id: "webgiz",
    label: "WebGiz",
    content: (
      <div>
        <PanelLinks
          intro="Acesse serviços acadêmicos relacionados a notas, frequência, histórico escolar, matrícula e recuperação de senha pelo sistema WebGiz."
          links={[
            { label: "Acesso e Recuperar senha" },
            { label: "Notas e Frequência" },
            { label: "Histórico Escolar" },
            { label: "Matrícula" },
          ]}
        />
        <PanelRelated
          links={[
            { label: "Matrícula e Rematrícula", to: R.matricula },
            { label: "Documentos Acadêmicos", to: R.documentos },
            { label: "Ajuda e Suporte", to: R.ajuda },
          ]}
        />
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center gap-2 rounded-[6px] bg-[#1a1a1a] px-5 py-3.5 text-[12px] font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#6E3AFF]"
        >
          Acessar WebGiz <ArrowUpRight className="h-4 w-4" />
        </a>
      </div>
    ),
  },
  {
    id: "documentos",
    label: "Documentos Acadêmicos",
    content: (
      <div>
        <PanelLinks
          intro="Emita e consulte declarações, históricos, certificados e comprovantes acadêmicos."
          links={[
            { label: "Declaração de Matrícula" },
            { label: "Histórico Escolar" },
            { label: "Declaração de Conclusão" },
            { label: "Comprovantes" },
            { label: "Certificados" },
          ]}
        />
        <PanelRelated
          links={[
            { label: "WebGiz", to: R.webgiz },
            { label: "Protocolos e Prazos", to: R.protocolos },
            { label: "Ajuda e Suporte", to: R.ajuda },
          ]}
        />
      </div>
    ),
  },
  {
    id: "requerimentos",
    label: "Requerimentos",
    content: (
      <div>
        <PanelLinks
          intro="Realize solicitações acadêmicas como segunda chamada, aproveitamento de estudos, trancamento e regime especial."
          links={[
            { label: "Segunda Chamada" },
            { label: "Aproveitamento de Estudos" },
            { label: "Trancamento" },
            { label: "Regime Especial" },
            { label: "Solicitação de Documentos" },
          ]}
        />
        <PanelRelated
          links={[
            { label: "Formulários", to: R.formularios },
            { label: "Protocolos e Prazos", to: R.protocolos },
            { label: "Ajuda e Suporte", to: R.ajuda },
          ]}
        />
      </div>
    ),
  },
  {
    id: "formularios",
    label: "Formulários",
    content: (
      <div>
        <PanelLinks
          intro="Acesse formulários oficiais, modelos e anexos necessários para processos acadêmicos."
          links={[{ label: "Formulários Oficiais" }, { label: "Modelos" }, { label: "Anexos" }]}
        />
        <PanelRelated
          links={[
            { label: "Requerimentos", to: R.requerimentos },
            { label: "Protocolos e Prazos", to: R.protocolos },
            { label: "Ajuda e Suporte", to: R.ajuda },
          ]}
        />
      </div>
    ),
  },
  {
    id: "protocolos",
    label: "Protocolos e Prazos",
    content: (
      <div>
        <PanelLinks
          intro="Saiba como protocolar solicitações, acompanhar processos e consultar prazos de análise."
          links={[
            { label: "Como Protocolar" },
            { label: "Acompanhar Solicitação" },
            { label: "Prazos de Análise" },
            { label: "Setor Responsável" },
          ]}
        />
        <PanelRelated
          links={[
            { label: "Requerimentos", to: R.requerimentos },
            { label: "Formulários", to: R.formularios },
            { label: "Ajuda e Suporte", to: R.ajuda },
          ]}
        />
      </div>
    ),
  },
  {
    id: "outros",
    label: "Outros Sistemas Acadêmicos",
    content: (
      <div>
        <PanelLinks
          intro="Acesse os principais sistemas utilizados na rotina acadêmica da Unimontes."
          links={[
            { label: "SIGex", external: true },
            { label: "AVA", external: true },
            { label: "Portal EAD", external: true },
            { label: "E-mail Institucional", external: true },
          ]}
        />
        <PanelRelated
          links={[
            { label: "WebGiz", to: R.webgiz },
            { label: "Recursos Tecnológicos", to: R.recursos },
            { label: "Ajuda e Suporte", to: R.ajuda },
          ]}
        />
      </div>
    ),
  },
];

export function ServicosDocumentos() {
  return (
    <>
      <PageHeader
        eyebrow="Serviços e Documentos"
        title="Documentos e serviços, num só lugar."
        description="Encontre sistemas, documentos acadêmicos, requerimentos, formulários, protocolos e prazos necessários para resolver demandas da sua vida acadêmica."
        icon={FileText}
      />
      <SectionLayout
        popular={popular}
        tags={tags}
        searchPlaceholder="Busque por documentos, requerimentos, WebGiz, histórico, declaração ou certificado"
        sections={sections}
        related={[]}
      />
    </>
  );
}
