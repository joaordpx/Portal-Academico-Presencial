import { GraduationCap } from "lucide-react";
import { PageHeader } from "../components/layout/PageHeader";
import { SectionLayout } from "../components/layout/SectionLayout";
import { conteudoVidaAcademica } from "./conteudo/vidaAcademica";

const related = [
  { label: "Calendário Acadêmico", to: "/vida-academica#calendario" },
  { label: "Serviços e Documentos", to: "/servicos-documentos" },
  { label: "Ajuda e Suporte", to: "/ajuda-suporte" },
];

export function VidaAcademica() {
  return (
    <>
      <PageHeader
        eyebrow="Vida Acadêmica"
        title="Acompanhe sua jornada acadêmica."
        description="Encontre calendários, normas, recursos tecnológicos e serviços essenciais para o seu dia a dia na universidade."
        icon={GraduationCap}
      />
      <SectionLayout
        popular={conteudoVidaAcademica.popular}
        tags={conteudoVidaAcademica.tags}
        searchPlaceholder="Busque por matrícula, calendário, biblioteca, normas, tutoriais ou suporte"
        sections={conteudoVidaAcademica.secoes}
        related={related}
      />
    </>
  );
}
