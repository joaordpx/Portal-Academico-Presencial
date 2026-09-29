import { HeartHandshake } from "lucide-react";
import { PageHeader } from "../components/layout/PageHeader";
import { SectionLayout, PanelLinks, PanelRelated } from "../components/layout/SectionLayout";

const popular = [
  { label: "Auxílios e Permanência" },
  { label: "Restaurante Universitário" },
  { label: "Saúde e Bem-estar" },
  { label: "Acessibilidade e Inclusão" },
  { label: "Direitos do Estudante" },
];

const tags = [
  "PEAES",
  "restaurante universitário",
  "apoio psicológico",
  "NUSI",
  "moradia estudantil",
];

const sections = [
  {
    id: "auxilios",
    label: "Auxílios e Permanência",
    content: (
      <>
        <PanelLinks
          intro="Consulte programas, auxílios, serviços e orientações que apoiam a permanência do estudante na universidade."
          links={[
            { label: "Auxílios", desc: "Alimentação, transporte, moradia e auxílio emergencial." },
            { label: "Permanência", desc: "Acompanhamento socioeducacional durante o curso." },
            {
              label: "PEAES",
              desc: "Programa Estadual de Assistência Estudantil — inscrições por edital.",
            },
            { label: "Moradia Estudantil", desc: "Alojamento institucional e auxílio-moradia." },
          ]}
        />
        <PanelRelated
          links={[
            { label: "Editais e Oportunidades", to: "/editais-oportunidades" },
            { label: "Documentos e Requerimentos", to: "/servicos-documentos" },
            { label: "Ajuda e Suporte", to: "/contato" },
            { label: "Unidades e Localização", to: "/unidades-localizacao" },
          ]}
        />
      </>
    ),
  },
  {
    id: "ru",
    label: "Restaurante Universitário",
    content: (
      <>
        <PanelLinks
          intro="Informações sobre o Restaurante Universitário: horários, cadastro, cardápio e normas de utilização."
          links={[
            {
              label: "Normas e horário de funcionamento",
              desc: "Regras de uso e horários de cada refeição.",
            },
            { label: "Como se cadastrar", desc: "Passo a passo para liberar o acesso ao RU." },
            { label: "Cardápio semanal", desc: "Refeições servidas ao longo da semana." },
            { label: "Localização", desc: "Onde fica o RU em cada campus." },
          ]}
        />
        <PanelRelated
          links={[
            { label: "Auxílios e Permanência", to: "/assistencia-estudantil" },
            { label: "Unidades e Localização", to: "/unidades-localizacao" },
            { label: "Ajuda e Suporte", to: "/contato" },
          ]}
        />
      </>
    ),
  },
  {
    id: "saude",
    label: "Saúde e Bem-estar",
    content: (
      <>
        <PanelLinks
          intro="Acesse serviços de saúde, apoio psicológico, atendimento odontológico e grupos de apoio."
          links={[
            {
              label: "Apoio Psicológico",
              desc: "Atendimento e acolhimento psicológico ao estudante.",
            },
            { label: "Atendimento Odontológico", desc: "Serviços da clínica odontológica." },
            { label: "Posto de Atendimento à Saúde", desc: "Primeiros atendimentos no campus." },
            { label: "Grupos de Apoio", desc: "Rodas de conversa e grupos temáticos." },
          ]}
        />
        <PanelRelated
          links={[
            { label: "Acessibilidade e Inclusão", to: "/assistencia-estudantil" },
            { label: "Unidades e Localização", to: "/unidades-localizacao" },
            { label: "Ajuda e Suporte", to: "/contato" },
          ]}
        />
      </>
    ),
  },
  {
    id: "acessibilidade",
    label: "Acessibilidade e Inclusão",
    content: (
      <>
        <PanelLinks
          intro="Conheça o NUSI, recursos de acessibilidade, orientações e suporte para necessidades educacionais específicas."
          links={[
            { label: "NUSI", desc: "Núcleo de Sociedade Inclusiva — apoio e acompanhamento." },
            {
              label: "Necessidades Educacionais Específicas",
              desc: "Atendimento especializado e adaptações.",
            },
            {
              label: "Recursos de Acessibilidade",
              desc: "Materiais, tecnologias e apoio técnico.",
            },
            { label: "Orientações", desc: "Como solicitar apoio e acompanhamento." },
          ]}
        />
        <PanelRelated
          links={[
            { label: "Saúde e Bem-estar", to: "/assistencia-estudantil" },
            { label: "Direitos do Estudante", to: "/assistencia-estudantil" },
            { label: "Ajuda e Suporte", to: "/contato" },
          ]}
        />
      </>
    ),
  },
  {
    id: "direitos",
    label: "Direitos do Estudante",
    content: (
      <>
        <PanelLinks
          intro="Conheça seus direitos, normas, orientações, canais de atendimento e perguntas frequentes."
          links={[
            { label: "Normas", desc: "Regulamentos que asseguram os direitos do estudante." },
            { label: "Orientações", desc: "Como proceder em situações comuns." },
            { label: "Canais de Atendimento", desc: "Onde buscar apoio institucional." },
            { label: "Perguntas Frequentes", desc: "Respostas às dúvidas mais comuns." },
          ]}
        />
        <PanelRelated
          links={[
            { label: "Auxílios e Permanência", to: "/assistencia-estudantil" },
            { label: "Acessibilidade e Inclusão", to: "/assistencia-estudantil" },
            { label: "Ajuda e Suporte", to: "/contato" },
          ]}
        />
      </>
    ),
  },
];

const related = [
  { label: "Editais e Oportunidades", to: "/editais-oportunidades" },
  { label: "Unidades e Localização", to: "/unidades-localizacao" },
  { label: "Ajuda e Suporte", to: "/contato" },
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
        popular={popular}
        tags={tags}
        searchPlaceholder="Busque por auxílios, restaurante universitário, saúde, acessibilidade ou atendimento"
        sections={sections}
        related={related}
      />
    </>
  );
}
