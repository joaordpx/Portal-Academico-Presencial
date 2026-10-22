import { FileText } from "lucide-react";
import { PageHeader } from "../components/layout/PageHeader";
import { SectionLayout } from "../components/layout/SectionLayout";
import { conteudoServicosDocumentos } from "./conteudo/servicosDocumentos";

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
        popular={conteudoServicosDocumentos.popular}
        tags={conteudoServicosDocumentos.tags}
        searchPlaceholder="Busque por documentos, requerimentos, WebGiz, histórico, declaração ou certificado"
        sections={conteudoServicosDocumentos.secoes}
        related={[]}
      />
    </>
  );
}
