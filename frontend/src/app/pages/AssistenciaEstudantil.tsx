import { HeartHandshake } from "lucide-react";
import { PageHeader } from "../components/layout/PageHeader";
import {
  SectionLayout,
  PanelInfo,
  PanelLinks,
  PanelNote,
  PanelRelated,
} from "../components/layout/SectionLayout";

/* Fontes oficiais (unimontes.br) */
const PEAES_INSCRICAO = "https://peaes.unimontes.br/";
const PEAES_EDITAL =
  "https://unimontes.br/wp-content/uploads/2026/07/2026-EDITAL-05-PEAES-AGOSTO-2026.pdf";
const PEAES_PAGINA =
  "https://unimontes.br/edital/programa-de-assistencia-estudantil-peaes-05-2026/";
const NAE = "https://unimontes.br/pro-reitoria-de-extensao/nae/";
const RU = "https://unimontes.br/restaurante-universitario/";

const popular = [
  { label: "Sistema do PEAES", href: PEAES_INSCRICAO },
  { label: "Restaurante Universitário", href: RU },
  { label: "Assistência Estudantil (NAE)", href: NAE },
  { label: "Centro Esportivo (CEU)", href: "https://unimontes.br/pro-reitoria-de-extensao/ceu/" },
];

const tags = [
  "PEAES",
  "restaurante universitário",
  "auxílio moradia",
  "NUSI",
  "auxílio transporte",
];

const sections = [
  {
    id: "auxilios",
    label: "Auxílios e Permanência",
    content: (
      <>
        <PanelInfo
          intro="O Programa Estadual de Assistência Estudantil (PEAES) concede auxílios a estudantes em situação de vulnerabilidade socioeconômica, matriculados e frequentes em cursos presenciais de graduação, pós-graduação e técnicos. Valores do edital PEAES 05/2026:"
          itens={[
            { rotulo: "Moradia", valor: "R$ 312,50/mês", detalhe: "Em até 6 parcelas." },
            {
              rotulo: "Alimentação",
              valor: "R$ 150,00/mês",
              detalhe:
                "Em até 5 parcelas, para quem estuda em campi fora de Montes Claros e Janaúba.",
            },
            {
              rotulo: "Transporte",
              valor: "R$ 187,50/mês",
              detalhe: "Em até 5 parcelas, para quem mora a mais de 4 km da unidade de ensino.",
            },
            {
              rotulo: "Creche",
              valor: "R$ 250,00/mês",
              detalhe:
                "Em até 5 parcelas, para estudantes com filhos de até 5 anos, 11 meses e 29 dias.",
            },
            {
              rotulo: "Apoio didático e pedagógico",
              valor: "R$ 250,00",
              detalhe: "Parcela única por semestre.",
            },
            {
              rotulo: "Inclusão da pessoa com deficiência",
              valor: "R$ 250,00/mês",
              detalhe:
                "Em até 5 parcelas, para estudantes com deficiência, transtornos globais do desenvolvimento ou altas habilidades/superdotação.",
            },
            { rotulo: "Inclusão digital", valor: "R$ 250,00/mês", detalhe: "Em até 6 parcelas." },
          ]}
        />
        <PanelNote>
          As inscrições do edital 05/2026 foram encerradas em 10 de agosto. Novos editais do PEAES
          são publicados ao longo do ano — acompanhe em Editais e Oportunidades.
        </PanelNote>
        <PanelLinks
          links={[
            {
              label: "Sistema do PEAES",
              desc: "Inscrições nos editais e acompanhamento — acesso com CPF e senha.",
              href: PEAES_INSCRICAO,
              external: true,
            },
            {
              label: "Edital PEAES 05/2026",
              desc: "Regras, documentos exigidos e cronograma (PDF).",
              href: PEAES_EDITAL,
              external: true,
            },
            {
              label: "Resultados e anexos",
              desc: "Resultado final, lista de espera e previsão de pagamentos.",
              href: PEAES_PAGINA,
              external: true,
            },
            {
              label: "Núcleo de Assistência Estudantil (NAE)",
              desc: "Setor da Pró-Reitoria de Extensão responsável pelos auxílios de permanência.",
              href: NAE,
              external: true,
            },
          ]}
        />
        <PanelRelated
          links={[
            { label: "Editais e Oportunidades", to: "/editais-oportunidades" },
            { label: "Documentos e Requerimentos", to: "/servicos-documentos" },
            { label: "Ajuda e Suporte", to: "/ajuda-suporte" },
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
        <PanelInfo
          intro="O Restaurante Universitário serve refeições balanceadas com preço subsidiado pelo Governo do Estado — em média 1.900 refeições por dia para estudantes, professores e servidores."
          itens={[
            { rotulo: "Acadêmicos", valor: "R$ 2,50", detalhe: "Por refeição." },
            {
              rotulo: "Servidores, professores e colaboradores",
              valor: "R$ 15,00",
              detalhe: "Por refeição (inclui FADENOR e MGS).",
            },
            { rotulo: "Almoço", valor: "10h30 às 13h30" },
            { rotulo: "Jantar", valor: "17h30 às 20h" },
            {
              rotulo: "Onde fica",
              valor: "Prédio 10",
              detalhe: "Entrada norte do Campus Darcy Ribeiro, em Montes Claros.",
            },
            {
              rotulo: "Cadastro",
              valor: "Documento com foto",
              detalhe:
                "Original, mais o comprovante com o número de matrícula (impresso ou digital).",
            },
          ]}
        />
        <PanelLinks
          links={[
            {
              label: "Página oficial do RU",
              desc: "Informações e avisos do Restaurante Universitário.",
              href: RU,
              external: true,
            },
            {
              label: "Ver no mapa do campus",
              desc: "Localização do Prédio 10 e dos demais prédios.",
              href: "/unidades-localizacao",
            },
          ]}
        />
        <PanelRelated
          links={[
            { label: "Auxílios e Permanência", to: "/assistencia-estudantil" },
            { label: "Unidades e Localização", to: "/unidades-localizacao" },
            { label: "Ajuda e Suporte", to: "/ajuda-suporte" },
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
          intro="Atendimento psicológico gratuito para estudantes, apoio psicopedagógico, clínicas odontológicas e o hospital universitário."
          links={[
            {
              label: "Programa Acolher — atendimento psicológico",
              desc: "Gratuito para estudantes de graduação de todos os campi, on-line, em até 10 sessões. Cadastre-se no SIGAP ou escreva para programa.acolher@unimontes.br.",
              href: "https://sigap.unimontes.br/registrar/aluno",
              external: true,
            },
            {
              label: "PAPPO — apoio psicológico, psicopedagógico e orientacional",
              desc: "Apoio à adaptação e à permanência do acadêmico. Departamento de Educação: (38) 3229-8235 · depto.educacao@unimontes.br.",
              href: "https://unimontes.br/projetos-e-servicos/programa-de-apoio-psicologico-psicopedagogico-e-orientacional/",
              external: true,
            },
            {
              label: "Clínicas Odontológicas",
              desc: "Atendimento gratuito à comunidade nas clínicas do curso de Odontologia, com agendamento conforme as vagas de cada disciplina.",
              href: "https://unimontes.br/clinicas-odontologicas-da-unimontes-abrem-agenda-para-atendimento-gratuito-da-comunidade/",
              external: true,
            },
            {
              label: "Hospital Universitário Clemente de Faria",
              desc: "Hospital-escola da Unimontes — Av. Cula Mangabeira, 562, Santo Expedito.",
              href: "https://unimontes.br/unidades/hospital-universitario/",
              external: true,
            },
          ]}
        />
        <PanelRelated
          links={[
            { label: "Acessibilidade e Inclusão", to: "/assistencia-estudantil" },
            { label: "Unidades e Localização", to: "/unidades-localizacao" },
            { label: "Ajuda e Suporte", to: "/ajuda-suporte" },
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
            {
              label: "NUSI",
              desc: "Núcleo de Sociedade Inclusiva, vinculado ao Departamento de Educação — apoio e acompanhamento. Fica no Prédio 2 (CCH).",
              href: "https://unimontes.br/nucleo-de-sociedade-inclusiva-nusi/",
              external: true,
            },
            {
              label: "Auxílio de inclusão (PEAES)",
              desc: "R$ 250,00/mês para estudantes com deficiência, TGD ou altas habilidades/superdotação.",
              href: PEAES_EDITAL,
              external: true,
            },
            {
              label: "Biblioteca acessível",
              desc: "A Biblioteca Central tem plataforma elevatória e livros em braille.",
              href: "https://unimontes.br/unidades/biblioteca/",
              external: true,
            },
          ]}
        />
        <PanelRelated
          links={[
            { label: "Saúde e Bem-estar", to: "/assistencia-estudantil" },
            { label: "Direitos do Estudante", to: "/assistencia-estudantil" },
            { label: "Ajuda e Suporte", to: "/ajuda-suporte" },
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
            {
              label: "Normas de Graduação",
              desc: "Regulamento do ensino nos cursos de graduação (dez/2025).",
              href: "https://unimontes.br/wp-content/uploads/2026/09/NORMAS_regulamentacao_ensino_n984_10-dez-2025.pdf",
              external: true,
            },
            {
              label: "SAVA — acolhimento a vítimas de assédio",
              desc: "Acolhe vítimas de assédio, violência de gênero e discriminação no âmbito da universidade e faz os encaminhamentos acadêmicos e assistenciais.",
              href: "https://unimontes.br/unimontes-cria-servico-de-acolhimento-de-vitimas-de-denuncias-de-assedio-e-preconceito-sava-foi-instituido-por-meio-de-portaria/",
              external: true,
            },
            {
              label: "Nome social",
              desc: "Solicitação por e-mail ao responsável pelo seu curso na Secretaria Geral.",
              href: "https://unimontes.br/unidades/secretaria-geral/",
              external: true,
            },
            {
              label: "Ouvidoria",
              desc: "Ouvidoria-Geral do Estado — Disque-Ouvidoria 162.",
              href: "https://ouvidoriageral.mg.gov.br/",
              external: true,
            },
            {
              label: "Fale com a Unimontes",
              desc: "Elogios, sugestões, reclamações e denúncias · (38) 3229-8229 · falecom@unimontes.br",
              href: "https://unimontes.br/falecom/",
              external: true,
            },
          ]}
        />
        <PanelRelated
          links={[
            { label: "Auxílios e Permanência", to: "/assistencia-estudantil" },
            { label: "Acessibilidade e Inclusão", to: "/assistencia-estudantil" },
            { label: "Ajuda e Suporte", to: "/ajuda-suporte" },
          ]}
        />
      </>
    ),
  },
];

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
        popular={popular}
        tags={tags}
        searchPlaceholder="Busque por auxílios, restaurante universitário, saúde, acessibilidade ou atendimento"
        sections={sections}
        related={related}
      />
    </>
  );
}
