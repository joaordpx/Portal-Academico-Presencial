import { Megaphone, Instagram } from "lucide-react";
import { PageHeader } from "../components/layout/PageHeader";
import {
  SectionLayout,
  PanelLinks,
  PanelRelated,
  PanelNote,
} from "../components/layout/SectionLayout";

const popular = [
  { label: "DCE" },
  { label: "Centros Acadêmicos" },
  { label: "Esporte e Lazer" },
  { label: "Reserva de Espaços" },
];

const tags = ["DCE", "centro acadêmico", "esporte", "reserva de quadra", "centro esportivo"];

const sections = [
  {
    id: "dce",
    label: "DCE",
    content: (
      <>
        <PanelLinks
          intro="Consulte informações sobre o Diretório Central dos Estudantes, canais oficiais de contato e formas de participação estudantil."
          links={[
            {
              label: "Sobre o DCE",
              desc: "O que é o Diretório Central dos Estudantes e como atua.",
            },
            { label: "Contatos e canais oficiais", desc: "Onde falar com a gestão do DCE." },
            { label: "Formas de participação", desc: "Como participar das ações e da gestão." },
          ]}
        />
        <PanelRelated
          links={[
            { label: "Centros Acadêmicos", to: "/movimento-estudantil-lazer" },
            { label: "Esporte e Lazer", to: "/movimento-estudantil-lazer" },
            { label: "Assistência Estudantil", to: "/assistencia-estudantil" },
            { label: "Ajuda e Suporte", to: "/contato" },
          ]}
        />
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center gap-2 rounded-[6px] bg-[#1a1a1a] px-5 py-3.5 text-[12px] font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#6E3AFF]"
        >
          <Instagram className="h-4 w-4" /> Redes sociais do DCE
        </a>
      </>
    ),
  },
  {
    id: "centros-academicos",
    label: "Centros Acadêmicos",
    content: (
      <>
        <PanelLinks
          intro="Conheça os Centros Acadêmicos dos cursos, contatos e formas de participação estudantil."
          links={[
            {
              label: "Centros Acadêmicos dos cursos",
              desc: "Lista dos CAs por curso e centro de ensino.",
            },
            { label: "Contatos", desc: "Canais de contato de cada Centro Acadêmico." },
            { label: "Formas de participação", desc: "Como se envolver com o CA do seu curso." },
          ]}
        />
        <PanelRelated
          links={[
            { label: "DCE", to: "/movimento-estudantil-lazer" },
            { label: "Cursos", to: "/cursos" },
            { label: "Ajuda e Suporte", to: "/contato" },
          ]}
        />
      </>
    ),
  },
  {
    id: "esporte-lazer",
    label: "Esporte e Lazer",
    content: (
      <>
        <PanelLinks
          intro="Acesse informações sobre atividades esportivas, atléticas, lazer, programação e centro esportivo."
          links={[
            {
              label: "Atividades esportivas",
              desc: "Modalidades e treinos abertos aos estudantes.",
            },
            { label: "Lazer e programação", desc: "Agenda de atividades de convivência e lazer." },
            { label: "Centro esportivo", desc: "Estrutura esportiva e horários de uso." },
            { label: "Atléticas", desc: "Associações atléticas dos cursos." },
          ]}
        />
        <PanelRelated
          links={[
            { label: "Reserva de Espaços", to: "/movimento-estudantil-lazer" },
            { label: "Cursos", to: "/cursos" },
            { label: "Ajuda e Suporte", to: "/contato" },
          ]}
        />
      </>
    ),
  },
  {
    id: "reserva-espacos",
    label: "Reserva de Espaços",
    content: (
      <>
        <PanelNote>
          <strong className="font-bold">Importante:</strong> a disponibilidade de espaços está
          sujeita à validação institucional e à disponibilidade do calendário.
        </PanelNote>
        <PanelLinks
          intro="Solicite reserva de quadras, piscina, auditórios e outros espaços da universidade."
          links={[
            { label: "Reserva de quadras", desc: "Quadras poliesportivas do campus." },
            { label: "Piscina", desc: "Uso da piscina e horários disponíveis." },
            { label: "Auditórios", desc: "Auditórios para eventos e atividades acadêmicas." },
            { label: "Outros espaços", desc: "Salas, laboratórios e áreas de convivência." },
          ]}
        />
        <PanelRelated
          links={[
            { label: "Esporte e Lazer", to: "/movimento-estudantil-lazer" },
            { label: "Unidades e Localização", to: "/unidades-localizacao" },
            { label: "Ajuda e Suporte", to: "/contato" },
          ]}
        />
      </>
    ),
  },
];

const related = [
  { label: "Eventos", to: "/eventos" },
  { label: "Assistência Estudantil", to: "/assistencia-estudantil" },
  { label: "Unidades e Localização", to: "/unidades-localizacao" },
];

export function MovimentoEstudantil() {
  return (
    <>
      <PageHeader
        eyebrow="Movimento Estudantil e Lazer"
        title="Representação, esporte e vida no campus."
        description="Encontre informações sobre representação estudantil, Centros Acadêmicos, esporte, lazer e reserva de espaços."
        icon={Megaphone}
      />
      <SectionLayout
        popular={popular}
        tags={tags}
        searchPlaceholder="Busque por DCE, Centros Acadêmicos, esporte, lazer ou reserva de espaços"
        sections={sections}
        related={related}
      />
    </>
  );
}
