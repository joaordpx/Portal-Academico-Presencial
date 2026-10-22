import { ArrowUpRight } from "lucide-react";
import { PanelLinks, PanelNote, PanelRelated } from "../../components/layout/SectionLayout";
import type { Section } from "../../components/layout/SectionLayout";
import type { PaginaConteudo } from "./tipos";

/* Fontes oficiais (unimontes.br) — procedimentos publicados pela Secretaria Geral */
const WEBGIZ = "http://www.webgiz.unimontes.br/";
const SECRETARIA = "https://unimontes.br/unidades/secretaria-geral/";

const popular = [
  { label: "WebGiz", href: WEBGIZ },
  { label: "Secretaria Geral", href: SECRETARIA },
  { label: "Calendário Acadêmico", href: "https://unimontes.br/calendario/" },
  { label: "SiGex", href: "https://sigex.unimontes.br/" },
];

const tags = [
  "declaração de matrícula",
  "histórico escolar",
  "cancelamento de disciplina",
  "diploma",
  "recuperar senha",
];

// Alvos dos "Links relacionados" (rotas do portal)
const R = {
  webgiz: "/servicos-documentos#webgiz",
  documentos: "/servicos-documentos#documentos",
  requerimentos: "/servicos-documentos#requerimentos",
  formularios: "/servicos-documentos#formularios",
  protocolos: "/servicos-documentos#protocolos",
  matricula: "/vida-academica#matricula",
  recursos: "/vida-academica#tecnologicos",
  ajuda: "/ajuda-suporte",
};

const secoes: Section[] = [
  {
    id: "webgiz",
    label: "WebGiz",
    content: (
      <div>
        <PanelLinks
          intro="No WebGiz você acompanha notas, frequência, disciplinas matriculadas, comprovante de matrícula e coeficiente de rendimento — e renova a matrícula a cada semestre."
          links={[
            {
              label: "Acessar o WebGiz",
              desc: "Login: número de matrícula completo. Senha: data de nascimento com 8 dígitos (ex.: 28041983).",
              href: WEBGIZ,
              external: true,
            },
            {
              label: "Esqueci a senha",
              desc: "Use “esqueci a senha” na tela de login. Sem acesso? Escreva ao responsável pelo seu curso na Secretaria Geral.",
              href: SECRETARIA,
              external: true,
            },
            {
              label: "Renovação de matrícula",
              desc: "Semestral, pelo WebGiz, no prazo do calendário. Sem renovação, o estudante é considerado desistente.",
              href: SECRETARIA,
              external: true,
            },
            {
              label: "Dados cadastrais errados",
              desc: "Envie e-mail ao responsável pelo seu curso com o título “ALTERAÇÃO DE DADOS CADASTRAIS”.",
              href: SECRETARIA,
              external: true,
            },
          ]}
        />
        <PanelRelated
          links={[
            { label: "Matrícula e Rematrícula", to: R.matricula },
            { label: "Documentos Acadêmicos", to: R.documentos },
            { label: "Ajuda e Suporte", to: R.ajuda },
          ]}
        />
        <a
          href={WEBGIZ}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center gap-2 rounded-[6px] bg-[#1a1a1a] px-5 py-3.5 text-[12px] font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#6E3AFF]"
        >
          Acessar WebGiz <ArrowUpRight className="h-4 w-4" />
        </a>
      </div>
    ),
  },
  {
    id: "documentos",
    buscaPor: ["declaração de matrícula", "comprovante"],
    label: "Documentos Acadêmicos",
    content: (
      <div>
        <PanelLinks
          intro="Declarações, diploma e demais documentos são emitidos pela Secretaria Geral. A maior parte dos pedidos é feita por e-mail, sem precisar ir ao campus."
          links={[
            {
              label: "Declaração digital",
              desc: "E-mail ao responsável pelo seu curso, título “DECLARAÇÃO”, com nome, matrícula, curso e campus.",
              href: SECRETARIA,
              external: true,
            },
            {
              label: "Declaração impressa",
              desc: "Peça a secretaria.recepcao@unimontes.br e retire na recepção da Secretaria Geral ou na secretaria do seu campus.",
              href: "mailto:secretaria.recepcao@unimontes.br",
            },
            {
              label: "Declaração de matrícula e frequência",
              desc: "Leva mais tempo: depende de parecer da coordenação do curso.",
              href: SECRETARIA,
              external: true,
            },
            {
              label: "Diploma",
              desc: "Para quem concluiu a partir de 2019, a emissão é automática. Prazo de expedição: 60 dias.",
              href: SECRETARIA,
              external: true,
            },
            {
              label: "Nada consta da biblioteca",
              desc: "Exigido antes da colação de grau — peça a biblioteca.central@unimontes.br.",
              href: "mailto:biblioteca.central@unimontes.br",
            },
          ]}
        />
        <PanelRelated
          links={[
            { label: "WebGiz", to: R.webgiz },
            { label: "Protocolos e Prazos", to: R.protocolos },
            { label: "Ajuda e Suporte", to: R.ajuda },
          ]}
        />
      </div>
    ),
  },
  {
    id: "requerimentos",
    label: "Requerimentos",
    content: (
      <div>
        <PanelLinks
          intro="Solicitações acadêmicas mais comuns e como fazer cada uma, conforme as orientações da Secretaria Geral."
          links={[
            {
              label: "Cancelamento de disciplina",
              desc: "E-mail ao responsável pelo curso, título “CANCELAMENTO DE DISCIPLINA”, informando a disciplina.",
              href: SECRETARIA,
              external: true,
            },
            {
              label: "Tratamento excepcional",
              desc: "Para afastamentos com atestado de mais de 4 dias.",
              href: SECRETARIA,
              external: true,
            },
            {
              label: "Abono de faltas",
              desc: "Só nos casos do art. 93 das Normas: manobras militares, congresso científico ou competição oficial.",
              href: SECRETARIA,
              external: true,
            },
            {
              label: "Nome social",
              desc: "E-mail ao responsável pelo curso, título “NOME SOCIAL”, com nome de registro, curso e campus.",
              href: SECRETARIA,
              external: true,
            },
            {
              label: "Desistência do curso",
              desc: "E-mail a secretaria.recepcao@unimontes.br, título “DESISTÊNCIA DE CURSO”, com documento e requerimento.",
              href: SECRETARIA,
              external: true,
            },
          ]}
        />
        <PanelRelated
          links={[
            { label: "Formulários", to: R.formularios },
            { label: "Protocolos e Prazos", to: R.protocolos },
            { label: "Ajuda e Suporte", to: R.ajuda },
          ]}
        />
      </div>
    ),
  },
  {
    id: "formularios",
    label: "Formulários",
    content: (
      <div>
        <PanelLinks
          intro="Formulários e modelos oficiais usados nos processos acadêmicos."
          links={[
            {
              label: "Requerimento de desistência do curso",
              desc: "Anexe ao e-mail enviado à recepção da Secretaria Geral.",
              href: "https://drive.google.com/file/d/1vvH7NFcDBCtyT1beMLrnWNscS8FpeJSw/view?usp=drive_link",
              external: true,
            },
            {
              label: "Requerimento de diploma",
              desc: "Para quem concluiu o curso antes de 2019.",
              href: "https://drive.google.com/file/d/1AkqyMBXcwxI2CJbgovWAz-rMExJVXy_i/view?usp=drive_link",
              external: true,
            },
            {
              label: "Documentos e normas do Ensino",
              desc: "Normas de graduação, regimento, PDI e formulários de monitoria.",
              href: "https://unimontes.br/pro-reitoria-de-ensino/documentos-e-normas-2/",
              external: true,
            },
            {
              label: "Modelos de termo de estágio",
              desc: "Termo aditivo e termo de rescisão (CAE).",
              href: "https://unimontes.br/pro-reitoria-de-extensao/coordenadorias-da-pro-reitoria-de-extensao/",
              external: true,
            },
          ]}
        />
        <PanelRelated
          links={[
            { label: "Requerimentos", to: R.requerimentos },
            { label: "Protocolos e Prazos", to: R.protocolos },
            { label: "Ajuda e Suporte", to: R.ajuda },
          ]}
        />
      </div>
    ),
  },
  {
    id: "protocolos",
    label: "Protocolos e Prazos",
    content: (
      <div>
        <PanelLinks
          intro="Como se identificar, acompanhar uma solicitação e conhecer os prazos da Secretaria Geral."
          links={[
            {
              label: "Como se identificar",
              desc: "Em todo e-mail: nome completo, número de matrícula, curso e campus/cidade.",
              href: SECRETARIA,
              external: true,
            },
            {
              label: "Acompanhar solicitação",
              desc: "Com o número de protocolo, aguarde dois dias e consulte o andamento com o responsável pelo seu curso.",
              href: SECRETARIA,
              external: true,
            },
            {
              label: "Prazo do diploma",
              desc: "60 dias, prorrogáveis por igual período (Portaria MEC nº 1.095/2018).",
              href: SECRETARIA,
              external: true,
            },
            {
              label: "Secretaria Geral",
              desc: "Prédio 2 (CCH), térreo · (38) 3229-8040 · secretaria.recepcao@unimontes.br",
              href: "/unidades-localizacao",
            },
          ]}
        />
        <PanelNote>
          Os e-mails institucionais valem para instruir processos na Unimontes: muitas solicitações
          não precisam ser protocoladas se forem feitas pelo canal oficial do seu curso.
        </PanelNote>
        <PanelRelated
          links={[
            { label: "Requerimentos", to: R.requerimentos },
            { label: "Formulários", to: R.formularios },
            { label: "Ajuda e Suporte", to: R.ajuda },
          ]}
        />
      </div>
    ),
  },
  {
    id: "outros",
    label: "Outros Sistemas Acadêmicos",
    content: (
      <div>
        <PanelLinks
          intro="Outros sistemas e portais usados na rotina acadêmica da Unimontes."
          links={[
            {
              label: "SiGex",
              desc: "Sistema de Gestão da Extensão: projetos, eventos e certificados.",
              href: "https://sigex.unimontes.br/",
              external: true,
            },
            {
              label: "Educação a Distância (CEAD)",
              desc: "Portal do Centro de Educação a Distância.",
              href: "https://www.cead.unimontes.br/",
              external: true,
            },
            {
              label: "Portal da Pós-Graduação",
              desc: "Programas de mestrado, doutorado e especialização.",
              href: "https://www.posgraduacao.unimontes.br/",
              external: true,
            },
            {
              label: "Wi-Fi e suporte (DTI)",
              desc: "Rede Wi-Fi Unimontes e suporte técnico.",
              href: "https://unimontes.br/dti/",
              external: true,
            },
          ]}
        />
        <PanelRelated
          links={[
            { label: "WebGiz", to: R.webgiz },
            { label: "Recursos Tecnológicos", to: R.recursos },
            { label: "Ajuda e Suporte", to: R.ajuda },
          ]}
        />
      </div>
    ),
  },
];

export const conteudoServicosDocumentos: PaginaConteudo = {
  caminho: "/servicos-documentos",
  titulo: "Serviços e Documentos",
  popular,
  tags,
  secoes,
};
