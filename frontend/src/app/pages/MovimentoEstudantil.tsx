import { Megaphone } from "lucide-react";
import { PageHeader } from "../components/layout/PageHeader";
import {
  SectionLayout,
  PanelInfo,
  PanelLinks,
  PanelRelated,
  PanelNote,
} from "../components/layout/SectionLayout";

/* Fontes oficiais (unimontes.br) */
const CEU = "https://unimontes.br/pro-reitoria-de-extensao/ceu/";
const NAE = "https://unimontes.br/pro-reitoria-de-extensao/nae/";
const JOGOS_ATLETICAS =
  "https://unimontes.br/edital/bolsas-extensao-organizacao-jogos-atleticas-10-2026/";

const popular = [
  { label: "Centro Esportivo (CEU)", href: CEU },
  { label: "Jogos das Atléticas", href: JOGOS_ATLETICAS },
  { label: "Esporte, Cultura e Lazer (NAE)", href: NAE },
];

const tags = ["DCE", "centro acadêmico", "esporte", "piscina", "centro esportivo"];

const sections = [
  {
    id: "dce",
    label: "DCE",
    content: (
      <>
        <PanelLinks
          intro="O Diretório Central dos Estudantes (DCE) representa os acadêmicos da Unimontes. Fica no campus-sede, entre os prédios 1 e 2, perto da CAE e em frente à Secretaria Geral."
          links={[
            {
              label: "Notícias do DCE",
              desc: "Ações, debates e conferências promovidas pelo DCE com a universidade.",
              href: "https://unimontes.br/?s=DCE",
              external: true,
            },
            {
              label: "Representação estudantil no SAVA",
              desc: "O DCE integra o sistema de acolhimento a vítimas de assédio e discriminação da universidade.",
              href: "https://unimontes.br/unimontes-cria-servico-de-acolhimento-de-vitimas-de-denuncias-de-assedio-e-preconceito-sava-foi-instituido-por-meio-de-portaria/",
              external: true,
            },
            {
              label: "Esporte, Cultura e Lazer (NAE)",
              desc: "Setor que elabora, com as representações estudantis, editais de fomento a atividades culturais e esportivas.",
              href: NAE,
              external: true,
            },
          ]}
        />
        <PanelRelated
          links={[
            { label: "Centros Acadêmicos", to: "/movimento-estudantil-lazer" },
            { label: "Esporte e Lazer", to: "/movimento-estudantil-lazer" },
            { label: "Assistência Estudantil", to: "/assistencia-estudantil" },
            { label: "Ajuda e Suporte", to: "/ajuda-suporte" },
          ]}
        />
      </>
    ),
  },
  {
    id: "centros-academicos",
    label: "Centros Acadêmicos",
    content: (
      <>
        <PanelLinks
          intro="Cada curso tem seu Centro Acadêmico. Para encontrar o CA do seu curso, fale com a coordenação — os contatos estão na página de cada curso."
          links={[
            {
              label: "Coordenações dos cursos",
              desc: "E-mail, telefone e localização da coordenação de cada um dos 41 cursos.",
              href: "/cursos",
            },
          ]}
        />
        <PanelRelated
          links={[
            { label: "DCE", to: "/movimento-estudantil-lazer" },
            { label: "Cursos", to: "/cursos" },
            { label: "Ajuda e Suporte", to: "/ajuda-suporte" },
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
        <PanelInfo
          intro="O Centro Esportivo Universitário Reitor João Valle Maurício (CEU) recebe as aulas de Educação Física, a comunidade acadêmica e a comunidade em geral, com projetos de futebol, natação, hidroginástica e tênis."
          itens={[
            { rotulo: "Quadras poliesportivas", valor: "3" },
            { rotulo: "Pista de atletismo", valor: "1" },
            { rotulo: "Quadras de tênis", valor: "2" },
            { rotulo: "Campos de futebol", valor: "2", detalhe: "Um campo e um society." },
            { rotulo: "Piscina olímpica", valor: "1" },
            { rotulo: "Academia", valor: "1" },
          ]}
        />
        <PanelLinks
          links={[
            {
              label: "Centro Esportivo (CEU)",
              desc: "(38) 3229-8054 · ceu@unimontes.br · das 7h às 19h.",
              href: CEU,
              external: true,
            },
            {
              label: "Projetos e serviços do CEU",
              desc: "Escola de Futebol Unimontes, natação, hidroginástica e tênis.",
              href: "https://unimontes.br/projetos-e-servicos/ceu/",
              external: true,
            },
            {
              label: "Jogos das Associações Atléticas",
              desc: "Edital PREx 10/2026 de bolsas para a organização dos jogos.",
              href: JOGOS_ATLETICAS,
              external: true,
            },
            {
              label: "Unicopa",
              desc: "Edital de bolsas de extensão para a organização da Unicopa.",
              href: "https://unimontes.br/edital/bolsas-de-extensao-unicopa/",
              external: true,
            },
          ]}
        />
        <PanelRelated
          links={[
            { label: "Reserva de Espaços", to: "/movimento-estudantil-lazer" },
            { label: "Eventos", to: "/eventos" },
            { label: "Ajuda e Suporte", to: "/ajuda-suporte" },
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
          <strong className="font-bold">Quadras, pista e piscina:</strong> o uso é combinado com a
          coordenação do CEU — (38) 3229-8054 · ceu@unimontes.br, das 7h às 19h. Para auditórios e
          salas, procure o setor responsável pelo prédio.
        </PanelNote>
        <PanelLinks
          links={[
            {
              label: "Centro Esportivo (CEU)",
              desc: "Quadras poliesportivas e de tênis, pista de atletismo, campos e piscina olímpica.",
              href: CEU,
              external: true,
            },
            {
              label: "Contatos dos prédios e setores",
              desc: "Direções dos centros de ensino e demais setores do campus.",
              href: "/unidades-localizacao",
            },
          ]}
        />
        <PanelRelated
          links={[
            { label: "Esporte e Lazer", to: "/movimento-estudantil-lazer" },
            { label: "Unidades e Localização", to: "/unidades-localizacao" },
            { label: "Ajuda e Suporte", to: "/ajuda-suporte" },
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
