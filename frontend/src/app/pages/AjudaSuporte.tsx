import { LifeBuoy } from "lucide-react";
import { PageHeader } from "../components/layout/PageHeader";
import { SectionLayout } from "../components/layout/SectionLayout";
import { conteudoAjudaSuporte } from "./conteudo/ajudaSuporte";

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
        popular={conteudoAjudaSuporte.popular}
        tags={conteudoAjudaSuporte.tags}
        searchPlaceholder="Busque por matrícula, documentos, WebGiz, senha, editais ou suporte"
        sections={conteudoAjudaSuporte.secoes}
        related={related}
      />
    </>
  );
}
