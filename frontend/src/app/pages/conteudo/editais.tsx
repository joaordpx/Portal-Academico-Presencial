import { PanelLinks } from "../../components/layout/SectionLayout";
import type { Section } from "../../components/layout/SectionLayout";
import type { PaginaConteudo } from "./tipos";

const CAE =
  "https://unimontes.br/pro-reitoria-de-extensao/coordenadorias-da-pro-reitoria-de-extensao/";

/** Seções de Editais e Oportunidades além da lista de editais (que vem da API) */
const secoes: Section[] = [
  {
    id: "estagios",
    label: "Estágios",
    content: (
      <PanelLinks
        accent="roxo"
        intro="O estágio não obrigatório é intermediado pelo Balcão de Estágio da Coordenadoria de Apoio ao Estudante (CAE), que mantém convênios com empresas de Montes Claros e região. O estágio obrigatório segue o PPC de cada curso."
        links={[
          {
            label: "Balcão de Estágio (CAE)",
            desc: "Como funciona o estágio não obrigatório e quem pode participar.",
            href: CAE,
            external: true,
          },
          {
            label: "Formulário de inscrição",
            desc: "Cadastro do acadêmico no Balcão de Estágio.",
            href: "https://docs.google.com/forms/d/1PZyxheBzT3siTWNJm5fRrd0cWtiUa-M0Fm6RJ3KHjsU/viewform",
            external: true,
          },
          {
            label: "Modelo de termo aditivo",
            desc: "Prorrogação ou alteração do estágio.",
            href: "https://unimontes.br/wp-content/uploads/2023/01/Modelo-Termo-Aditivo.doc",
            external: true,
          },
          {
            label: "Modelo de termo de rescisão",
            desc: "Encerramento antecipado do estágio.",
            href: "https://unimontes.br/wp-content/uploads/2023/01/Modelo-de-Termo-de-Rescisao.docx",
            external: true,
          },
          {
            label: "Contato da CAE",
            desc: "Em frente à Secretaria Geral (Prédio 2) · 7h às 21h · (38) 3229-8163 · cae@unimontes.br",
            href: "mailto:cae@unimontes.br",
          },
        ]}
      />
    ),
  },
  {
    id: "bolsas",
    label: "Bolsas e Monitoria",
    content: (
      <PanelLinks
        accent="roxo"
        intro="Acompanhe oportunidades de apoio acadêmico e participação em programas."
        links={[
          {
            label: "Monitoria",
            desc: "Normas gerais para regulamentação da monitoria.",
            href: "https://unimontes.br/wp-content/uploads/2022/04/Normas-Gerais-para-Regulamentacao-da-Monitoria..pdf",
            external: true,
          },
          {
            label: "Iniciação Científica",
            desc: "Coordenadoria de Iniciação Científica da Pró-Reitoria de Pesquisa.",
            href: "https://unimontes.br/coordenadoria-de-iniciacao-cientifica/",
            external: true,
          },
          {
            label: "Extensão",
            desc: "Bolsas e editais da Pró-Reitoria de Extensão (PREx).",
            href: "https://unimontes.br/pro-reitoria-de-extensao/",
            external: true,
          },
          {
            label: "Assistência Estudantil (PEAES)",
            desc: "Auxílios moradia, alimentação, transporte, creche e inclusão.",
            href: "/assistencia-estudantil#auxilios",
          },
        ]}
      />
    ),
  },
  {
    id: "pesquisa",
    label: "Pesquisa e Extensão",
    content: (
      <PanelLinks
        accent="roxo"
        intro="Programas e projetos ligados à produção acadêmica e à atuação extensionista."
        links={[
          {
            label: "Pró-Reitoria de Pesquisa",
            desc: "Programas, comitês de ética e laboratórios multiusuários.",
            href: "https://unimontes.br/pro-reitoria-de-pesquisa/",
            external: true,
          },
          {
            label: "SiGex",
            desc: "Sistema de Gestão da Extensão — cadastro de projetos e eventos.",
            href: "https://sigex.unimontes.br/",
            external: true,
          },
          {
            label: "Portal de Periódicos",
            desc: "Revistas científicas editadas pela Unimontes.",
            href: "https://www.periodicos.unimontes.br/",
            external: true,
          },
          {
            label: "Todos os editais no site oficial",
            desc: "Lista completa, ordenada pela data de modificação.",
            href: "https://unimontes.br/editais/",
            external: true,
          },
        ]}
      />
    ),
  },
];

export const conteudoEditais: PaginaConteudo = {
  caminho: "/editais-oportunidades",
  titulo: "Editais e Oportunidades",
  secoes,
};
