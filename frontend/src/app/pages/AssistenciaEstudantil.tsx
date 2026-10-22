import { HeartHandshake } from "lucide-react";
import { PageHeader } from "../components/layout/PageHeader";
import { SectionLayout } from "../components/layout/SectionLayout";
import { conteudoAssistenciaEstudantil } from "./conteudo/assistenciaEstudantil";

const related = [
  { label: "Editais e Oportunidades", to: "/editais-oportunidades" },
  { label: "Unidades e Localização", to: "/unidades-localizacao" },
  { label: "Ajuda e Suporte", to: "/ajuda-suporte" },
];

export function AssistenciaEstudantil() {
  return (
    <>
      <PageHeader
        eyebrow="Assistência Estudantil"
        title="Apoio para você seguir estudando."
        description="Encontre informações sobre auxílios, permanência, saúde, acessibilidade, inclusão, restaurante universitário e direitos do estudante."
        icon={HeartHandshake}
      />
      <SectionLayout
        popular={conteudoAssistenciaEstudantil.popular}
        tags={conteudoAssistenciaEstudantil.tags}
        searchPlaceholder="Busque por auxílios, restaurante universitário, saúde, acessibilidade ou atendimento"
        sections={conteudoAssistenciaEstudantil.secoes}
        related={related}
      />
    </>
  );
}
