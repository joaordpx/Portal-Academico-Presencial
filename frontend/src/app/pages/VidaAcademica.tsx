import { GraduationCap } from "lucide-react";
import { PageHeader } from "../components/layout/PageHeader";
import {
  SectionLayout,
  PanelCardGrid,
  PanelRedirect,
  PanelSteps,
  PanelLinks,
} from "../components/layout/SectionLayout";

const popular = [
  { label: "Calendário Acadêmico" },
  { label: "Matrícula e Rematrícula" },
  { label: "Biblioteca" },
  { label: "Recursos Tecnológicos" },
  { label: "Tutoriais" },
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
        intro="Encontre as principais orientações para iniciar sua vida acadêmica na UNIMONTES — primeiros acessos, sistemas e dúvidas frequentes do calouro."
        cards={[
          {
            title: "Manual do Calouro",
            desc: "Roteiro completo para os primeiros passos na universidade.",
          },
          {
            title: "Acesso aos Sistemas",
            desc: "WebGiz, Moodle, e-mail institucional e biblioteca digital.",
          },
          {
            title: "Mapa do Campus",
            desc: "Localize blocos, salas, laboratórios e setores administrativos.",
          },
          {
            title: "Dúvidas Frequentes",
            desc: "Respostas para as principais dúvidas dos novos estudantes.",
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
        note="O calendário é atualizado a cada semestre diretamente no site oficial da universidade. Ao clicar, você será redirecionado para a página oficial, sempre com a versão mais recente."
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
            note: "A primeira matrícula, do 1º período, é realizada presencialmente pela Secretaria Geral da Unimontes. Os candidatos aprovados devem seguir as instruções do edital de convocação.",
            steps: [
              {
                title: "Acompanhe o edital de convocação",
                desc: "Após o resultado do processo seletivo, fique atento ao edital de matrícula, que informa datas, locais, horários e a documentação exigida.",
              },
              {
                title: "Reúna a documentação exigida",
                desc: "Separe os documentos solicitados no edital (documento de identidade, CPF, certificado e histórico do ensino médio, comprovante de residência, fotografia, entre outros).",
              },
              {
                title: "Compareça à Secretaria Geral",
                desc: "Dirija-se presencialmente à Secretaria Geral no período indicado para entregar a documentação e efetivar a matrícula.",
              },
              {
                title: "Receba seu número de matrícula",
                desc: "Após a conferência dos documentos, a matrícula é efetivada e você recebe o número de matrícula, que dá acesso ao WebGiz e aos demais sistemas.",
              },
            ],
          },
          {
            id: "renovacao",
            label: "Renovação de Matrícula",
            note: "A renovação (rematrícula) é obrigatória a cada semestre e feita pelo próprio estudante, de forma online, pelo sistema WebGiz, dentro do prazo do calendário acadêmico.",
            steps: [
              {
                title: "Acesse o WebGiz",
                desc: "Entre no sistema WebGiz com o seu número de matrícula e senha.",
                imageLabel: "Imagem ilustrativa — tela de login do WebGiz",
              },
              {
                title: "Abra o período de renovação",
                desc: "No menu do sistema, acesse a opção de renovação de matrícula, disponível apenas durante o prazo definido no calendário acadêmico.",
                imageLabel: "Imagem ilustrativa — menu de renovação de matrícula",
              },
              {
                title: "Selecione as disciplinas",
                desc: "Escolha as disciplinas do semestre, respeitando pré-requisitos e evitando choques de horário.",
                imageLabel: "Imagem ilustrativa — seleção de disciplinas",
              },
              {
                title: "Confirme e salve o comprovante",
                desc: "Revise as disciplinas selecionadas, confirme a solicitação e salve ou imprima o comprovante de renovação de matrícula.",
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
        intro="Acesse o acervo, renove empréstimos e consulte as normas da biblioteca."
        links={[
          {
            label: "Catálogo de livros",
            desc: "Consulte o acervo físico e reserve exemplares.",
            external: true,
          },
          {
            label: "Empréstimos e renovação",
            desc: "Acompanhe e renove seus empréstimos online.",
            external: true,
          },
          { label: "Normas da biblioteca", desc: "Regras de uso, prazos e penalidades." },
          { label: "Contatos", desc: "Telefones, e-mail e horários de atendimento." },
          {
            label: "Biblioteca virtual",
            desc: "Acervo digital de livros e periódicos.",
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
            desc: "Atividades Acadêmico-Científico-Culturais — horas complementares.",
          },
          { label: "AIEX", desc: "Atividades de Interação Ensino-Extensão." },
          { label: "Iniciação Científica", desc: "PIBIC, PIBITI e bolsas de pesquisa por edital." },
          { label: "Extensão", desc: "Projetos de extensão junto à comunidade." },
          { label: "Estágio", desc: "Estágio obrigatório e não obrigatório — normas e vagas." },
          { label: "Monitoria", desc: "Auxílio acadêmico em disciplinas, com bolsa." },
          { label: "Cursos Gratuitos", desc: "Cursos e capacitações abertos aos estudantes." },
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
            label: "E-mail institucional",
            desc: "Conta institucional do estudante e como acessá-la.",
          },
          { label: "Wi-Fi", desc: "Rede sem fio do campus — como se conectar." },
          { label: "Laboratórios", desc: "Laboratórios de informática e horários de uso." },
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
          { label: "Direitos e deveres", desc: "Direitos, deveres e conduta do estudante." },
          {
            label: "Avaliação e frequência",
            desc: "Critérios de aprovação, notas e frequência mínima.",
          },
          { label: "Trancamento", desc: "Como solicitar trancamento total ou parcial." },
          { label: "Segunda chamada", desc: "Solicitação de prova em segunda chamada." },
          { label: "Aproveitamento de estudos", desc: "Dispensa de disciplinas já cursadas." },
        ]}
      />
    ),
  },
  {
    id: "tutoriais",
    label: "Tutoriais",
    content: (
      <PanelLinks
        intro="Passo a passo para os principais serviços e sistemas do portal."
        links={[
          {
            label: "Uso de sistemas",
            desc: "Como acessar e navegar pelos sistemas da universidade.",
          },
          { label: "Matrícula", desc: "Passo a passo da matrícula e renovação." },
          { label: "Documentos", desc: "Como emitir declarações, histórico e demais documentos." },
          { label: "Busca", desc: "Como localizar informações e serviços no portal." },
          { label: "Requerimento", desc: "Como abrir e acompanhar requerimentos." },
          {
            label: "Processos acadêmicos",
            desc: "Orientações sobre processos e trâmites acadêmicos.",
          },
        ]}
      />
    ),
  },
];

const related = [
  { label: "Calendário Acadêmico", to: "/vida-academica" },
  { label: "Matrícula e Rematrícula", to: "/servicos-documentos" },
  { label: "Ajuda e Suporte", to: "/contato" },
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
