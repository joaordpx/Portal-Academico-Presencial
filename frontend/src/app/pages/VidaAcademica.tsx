import { GraduationCap } from "lucide-react";
import { PageHeader } from "../components/layout/PageHeader";
import {
  SectionLayout,
  PanelCardGrid,
  PanelRedirect,
  PanelSteps,
  PanelLinks,
} from "../components/layout/SectionLayout";

/* Fontes oficiais (unimontes.br) — o portal encaminha para onde o conteúdo já é mantido */
const UP = "https://unimontes.br/wp-content/uploads";
const WEBGIZ = "http://www.webgiz.unimontes.br/";
const SECRETARIA = "https://unimontes.br/unidades/secretaria-geral/";
const CALENDARIO_2026 = `${UP}/2026/01/r-983-e-anexo.pdf`;
const NORMAS_GRADUACAO = `${UP}/2026/09/NORMAS_regulamentacao_ensino_n984_10-dez-2025.pdf`;
const BIBLIOTECA = "https://unimontes.br/unidades/biblioteca/";
const PERGAMUM = "https://pergamum.unimontes.br/";
const TUTORIAL_BIBLIOTECA_VIRTUAL = `${UP}/2025/03/Tutorial-Biblioteca-Virtual-2025-site.pdf`;
const MANUAL_AUTOATENDIMENTO = `${UP}/2019/09/Manual_autoatendimento.pdf`;

const popular = [
  { label: "Calendário Acadêmico", href: "https://unimontes.br/calendario/" },
  { label: "WebGiz", href: WEBGIZ },
  { label: "Biblioteca (Pergamum)", href: PERGAMUM },
  { label: "Normas de Graduação", href: NORMAS_GRADUACAO },
  { label: "Secretaria Geral", href: SECRETARIA },
];

const tags = [
  "calendário acadêmico",
  "matrícula",
  "WebGiz",
  "declaração",
  "estágio",
  "segunda chamada",
];

const sections = [
  {
    id: "calouro",
    label: "Sou Calouro",
    content: (
      <PanelCardGrid
        intro="Encontre as principais orientações para iniciar sua vida acadêmica na Unimontes — primeiros acessos, sistemas e dúvidas frequentes do calouro."
        cards={[
          {
            title: "Acesso ao WebGiz",
            desc: "Notas, frequência e renovação de matrícula. Login: número de matrícula; senha inicial: data de nascimento com 8 dígitos.",
            href: WEBGIZ,
          },
          {
            title: "Calendário Acadêmico 2026",
            desc: "Datas do ano letivo aprovadas pela Resolução CEPEx nº 983/2025.",
            href: CALENDARIO_2026,
          },
          {
            title: "Mapa do Campus",
            desc: "Prédios, centros de ensino, Secretaria Geral, Biblioteca e Restaurante Universitário.",
            href: "/unidades-localizacao",
          },
          {
            title: "Dúvidas Frequentes",
            desc: "Respostas para as principais dúvidas dos novos estudantes.",
            href: "/ajuda-suporte",
          },
        ]}
      />
    ),
  },
  {
    id: "calendario",
    label: "Calendário Acadêmico",
    content: (
      <PanelRedirect
        intro="Consulte datas importantes, prazos acadêmicos e eventos no calendário oficial da Unimontes."
        title="Calendário Acadêmico da Unimontes"
        note="O Calendário Letivo 2026 foi aprovado pela Resolução CEPEx nº 983/2025 e é mantido no site oficial da universidade. Ao clicar, você vai para a página oficial, sempre com a versão mais recente."
        href="https://unimontes.br/calendario/"
      />
    ),
  },
  {
    id: "matricula",
    label: "Matrícula e Renovação de Matrícula",
    content: (
      <PanelSteps
        intro="Orientações, prazos e documentos necessários para a matrícula inicial e a renovação de matrícula."
        tracks={[
          {
            id: "inicial",
            label: "Matrícula Inicial (1º período)",
            note: "A primeira matrícula segue o edital de convocação do processo seletivo e é efetivada pela Secretaria Geral — Prédio 2 (CCH), térreo, no Campus Darcy Ribeiro.",
            steps: [
              {
                title: "Acompanhe o edital de convocação",
                desc: "Após o resultado do processo seletivo, fique atento ao edital de matrícula, que informa datas, locais, horários e a documentação exigida.",
              },
              {
                title: "Reúna a documentação exigida",
                desc: "Separe os documentos solicitados no edital (documento de identidade, CPF, certificado e histórico do ensino médio, entre outros).",
              },
              {
                title: "Efetive a matrícula",
                desc: "Entregue a documentação no local e no período indicados no edital. Dúvidas: Secretaria Geral, (38) 3229-8040 ou secretaria.recepcao@unimontes.br.",
              },
              {
                title: "Receba seu número de matrícula",
                desc: "Com a matrícula efetivada, o número de matrícula dá acesso ao WebGiz e aos demais sistemas.",
              },
            ],
          },
          {
            id: "renovacao",
            label: "Renovação de Matrícula",
            note: "A renovação é obrigatória a cada semestre e feita pelo próprio estudante no WebGiz, dentro do prazo do calendário acadêmico. Quem não renova no prazo é considerado desistente do curso.",
            steps: [
              {
                title: "Acesse o WebGiz",
                desc: "Em webgiz.unimontes.br, entre com o número de matrícula completo. A senha é a data de nascimento com 8 dígitos (ex.: 28041983); se esquecer, use “esqueci a senha”.",
                imageLabel: "Imagem ilustrativa — tela de login do WebGiz",
              },
              {
                title: "Abra o período de renovação",
                desc: "No menu do sistema, acesse a renovação de matrícula, disponível apenas no prazo definido no calendário acadêmico.",
                imageLabel: "Imagem ilustrativa — menu de renovação de matrícula",
              },
              {
                title: "Selecione as disciplinas",
                desc: "Escolha as disciplinas do semestre, respeitando pré-requisitos e evitando choques de horário.",
                imageLabel: "Imagem ilustrativa — seleção de disciplinas",
              },
              {
                title: "Confirme e salve o comprovante",
                desc: "Revise as disciplinas, confirme a solicitação e guarde o comprovante. Matrícula trancada não renova pelo sistema: peça por e-mail ao responsável pelo seu curso na Secretaria Geral.",
                imageLabel: "Imagem ilustrativa — comprovante de renovação",
              },
            ],
          },
        ]}
      />
    ),
  },
  {
    id: "biblioteca",
    label: "Biblioteca",
    content: (
      <PanelLinks
        accent="amarelo"
        intro="Acervo, renovação on-line e bases digitais do Sistema de Bibliotecas da Unimontes — Biblioteca Central Professor Antônio Jorge (Prédio 4) e bibliotecas setoriais nos campi."
        links={[
          {
            label: "Acervo e renovação (Pergamum)",
            desc: "Consulte o acervo, renove empréstimos (até 3 vezes) e reserve obras on-line.",
            href: PERGAMUM,
            external: true,
          },
          {
            label: "Biblioteca Virtual Pearson",
            desc: "Tutorial de cadastro e acesso ao acervo digital de livros.",
            href: TUTORIAL_BIBLIOTECA_VIRTUAL,
            external: true,
          },
          {
            label: "Repositório Institucional",
            desc: "Produção técnica e científica da Unimontes em acesso aberto.",
            href: "https://repositorio.unimontes.br/",
            external: true,
          },
          {
            label: "Periódicos CAPES",
            desc: "Artigos, teses e bases de dados — acesso remoto pela Rede CAFe.",
            href: "https://www.periodicos.capes.gov.br/",
            external: true,
          },
          {
            label: "Manual de autoatendimento",
            desc: "Como registrar seus empréstimos nos terminais da Biblioteca Central.",
            href: MANUAL_AUTOATENDIMENTO,
            external: true,
          },
          {
            label: "Empréstimo entre bibliotecas",
            desc: "Solicite livros que não estão no acervo da biblioteca onde você está inscrito.",
            href: `${UP}/2019/09/Emprstimo_Entre_bibliotecas.pdf`,
            external: true,
          },
          {
            label: "Regulamento do Sistema de Bibliotecas",
            desc: "Regras de uso, prazos e penalidades.",
            href: `${UP}/2018/10/regulamento_do_sistema_de_bibliotecas_universitarias.pdf`,
            external: true,
          },
          {
            label: "Bibliotecas, horários e contatos",
            desc: "Biblioteca Central: seg. a sex., 7h30 às 22h30 · (38) 3229-8212. Setoriais em 11 campi.",
            href: BIBLIOTECA,
            external: true,
          },
        ]}
      />
    ),
  },
  {
    id: "extracurriculares",
    label: "Atividades Extracurriculares",
    content: (
      <PanelLinks
        intro="Informações sobre atividades complementares, iniciação científica, extensão, estágio e monitoria."
        links={[
          {
            label: "AACC",
            desc: "Atividades Acadêmico-Científico-Culturais — horas complementares previstas no PPC do curso.",
          },
          { label: "AIEX", desc: "Atividades de Interação Ensino-Extensão." },
          {
            label: "Iniciação Científica",
            desc: "Programas e bolsas de iniciação científica da Pró-Reitoria de Pesquisa.",
            href: "https://unimontes.br/coordenadoria-de-iniciacao-cientifica/",
            external: true,
          },
          {
            label: "Extensão",
            desc: "Projetos, bolsas e editais da Pró-Reitoria de Extensão (PREx).",
            href: "https://unimontes.br/pro-reitoria-de-extensao/",
            external: true,
          },
          {
            label: "Estágio",
            desc: "Balcão de Estágio da CAE — estágio não obrigatório e convênios com empresas.",
            href: "https://unimontes.br/pro-reitoria-de-extensao/coordenadorias-da-pro-reitoria-de-extensao/",
            external: true,
          },
          {
            label: "Monitoria",
            desc: "Normas gerais para regulamentação da monitoria.",
            href: `${UP}/2022/04/Normas-Gerais-para-Regulamentacao-da-Monitoria..pdf`,
            external: true,
          },
        ]}
      />
    ),
  },
  {
    id: "tecnologicos",
    label: "Recursos Tecnológicos",
    content: (
      <PanelLinks
        intro="Sistemas, plataformas e infraestrutura tecnológica disponíveis ao estudante."
        links={[
          {
            label: "WebGiz",
            desc: "Notas, frequência, comprovante e renovação de matrícula.",
            href: WEBGIZ,
            external: true,
          },
          {
            label: "Wi-Fi Unimontes",
            desc: "Rede sem fio gratuita para acadêmicos, servidores e colaboradores — suporte pela DTI.",
            href: "https://unimontes.br/dti/",
            external: true,
          },
          {
            label: "Suporte de TI (DTI)",
            desc: "Prédio 5, 2º andar, sala 206 · (38) 3229-8125 · das 7h às 18h.",
            href: "https://unimontes.br/dti/",
            external: true,
          },
          { label: "Laboratórios", desc: "Laboratórios de informática dos centros e dos campi." },
        ]}
      />
    ),
  },
  {
    id: "normas",
    label: "Normas Acadêmicas",
    content: (
      <PanelLinks
        intro="Resoluções e normas que regem a vida acadêmica na universidade."
        links={[
          {
            label: "Normas para Regulamentação do Ensino",
            desc: "Normas dos cursos de graduação, atualizadas em dezembro de 2025: avaliação, frequência, trancamento, aproveitamento e mais.",
            href: NORMAS_GRADUACAO,
            external: true,
          },
          {
            label: "Regimento Geral da Unimontes",
            desc: "Estrutura, órgãos e funcionamento da universidade.",
            href: `${UP}/2018/10/regimentogeral.pdf`,
            external: true,
          },
          {
            label: "Abono de faltas e tratamento excepcional",
            desc: "O abono vale só para os casos do art. 93 das Normas; atestados de mais de 4 dias pedem tratamento excepcional.",
            href: SECRETARIA,
            external: true,
          },
          {
            label: "Cancelamento de disciplina",
            desc: "Por e-mail ao responsável pelo curso na Secretaria Geral, com o título “CANCELAMENTO DE DISCIPLINA”.",
            href: SECRETARIA,
            external: true,
          },
          {
            label: "Resoluções do CEPEx",
            desc: "Decisões do Conselho de Ensino, Pesquisa e Extensão.",
            href: "https://unimontes.br/resolucoes_cepex/",
            external: true,
          },
        ]}
      />
    ),
  },
  {
    id: "tutoriais",
    label: "Tutoriais",
    content: (
      <PanelLinks
        intro="Passo a passo para os principais serviços e sistemas da universidade."
        links={[
          {
            label: "Acessar o WebGiz",
            desc: "Login, senha e o que fazer se não conseguir entrar.",
            href: SECRETARIA,
            external: true,
          },
          {
            label: "Biblioteca Virtual",
            desc: "Cadastro e acesso ao acervo digital da Pearson.",
            href: TUTORIAL_BIBLIOTECA_VIRTUAL,
            external: true,
          },
          {
            label: "Autoatendimento da biblioteca",
            desc: "Empréstimo nos terminais da Biblioteca Central.",
            href: MANUAL_AUTOATENDIMENTO,
            external: true,
          },
          {
            label: "Solicitar declaração",
            desc: "Digital por e-mail ao responsável pelo curso ou impressa pela recepção da Secretaria Geral.",
            href: SECRETARIA,
            external: true,
          },
          {
            label: "Alterar dados cadastrais e nome social",
            desc: "Por e-mail ao responsável pelo curso na Secretaria Geral.",
            href: SECRETARIA,
            external: true,
          },
        ]}
      />
    ),
  },
];

const related = [
  { label: "Calendário Acadêmico", to: "/vida-academica" },
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
        popular={popular}
        tags={tags}
        searchPlaceholder="Busque por matrícula, calendário, biblioteca, normas, tutoriais ou suporte"
        sections={sections}
        related={related}
      />
    </>
  );
}
