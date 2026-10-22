import {
  PanelAccordion,
  PanelLinks,
  PanelRelated,
  PanelNote,
} from "../../components/layout/SectionLayout";
import type { Section } from "../../components/layout/SectionLayout";
import type { PaginaConteudo } from "./tipos";
import { FormularioContato, Glossario } from "./AjudaSuporteComponentes";

/* Canal oficial "Fale com a Unimontes" (unimontes.br/falecom) */
const FALECOM_EMAIL = "falecom@unimontes.br";

const popular = [
  { label: "Fale com a Unimontes", href: "https://unimontes.br/falecom/" },
  { label: "WebGiz", href: "http://www.webgiz.unimontes.br/" },
  { label: "Secretaria Geral", href: "https://unimontes.br/unidades/secretaria-geral/" },
  { label: "Suporte de TI (DTI)", href: "https://unimontes.br/dti/" },
];

const tags = ["recuperar senha", "declaração de matrícula", "edital", "WebGiz", "Wi-Fi", "PPC"];

/* ───────────── Glossário de siglas ───────────── */

/** Também indexadas pela busca global (sigla → significado) */
const SIGLAS = [
  { sigla: "AACC", significado: "Atividades Acadêmico-Científico-Culturais" },
  { sigla: "AIEX", significado: "Atividades de Interação Ensino-Extensão" },
  {
    sigla: "CAE",
    significado: "Coordenadoria de Apoio ao Estudante — estágio não obrigatório e Unicalourada",
  },
  { sigla: "CCBS", significado: "Centro de Ciências Biológicas e da Saúde (Prédio 6)" },
  { sigla: "CCET", significado: "Centro de Ciências Exatas e Tecnológicas (Prédio 3)" },
  { sigla: "CCH", significado: "Centro de Ciências Humanas (Prédio 2)" },
  { sigla: "CCSA", significado: "Centro de Ciências Sociais Aplicadas (Prédio 1)" },
  { sigla: "CEAD", significado: "Centro de Educação a Distância" },
  { sigla: "CEPEx", significado: "Conselho de Ensino, Pesquisa e Extensão" },
  { sigla: "CEPT", significado: "Centro de Educação Profissional e Tecnológica" },
  { sigla: "CEU", significado: "Centro Esportivo Universitário Reitor João Valle Maurício" },
  { sigla: "CONSU", significado: "Conselho Universitário" },
  {
    sigla: "COTEPS",
    significado: "Coordenação Técnica de Processos Seletivos — vestibular e PAES",
  },
  { sigla: "DBU", significado: "Diretoria de Biblioteca Universitária" },
  { sigla: "DCE", significado: "Diretório Central dos Estudantes" },
  { sigla: "DTI", significado: "Diretoria de Tecnologia da Informação — WebGiz e Wi-Fi" },
  { sigla: "HUCF", significado: "Hospital Universitário Clemente de Faria" },
  { sigla: "NAE", significado: "Núcleo de Assistência Estudantil — auxílios de permanência" },
  { sigla: "NUSI", significado: "Núcleo de Sociedade Inclusiva" },
  { sigla: "PAES", significado: "Programa de Avaliação Seriada para o acesso ao Ensino Superior" },
  { sigla: "PAPPO", significado: "Programa de Apoio Psicológico, Psicopedagógico e Orientacional" },
  { sigla: "PEAES", significado: "Programa Estadual de Assistência Estudantil" },
  { sigla: "PIBIC", significado: "Programa Institucional de Bolsas de Iniciação Científica" },
  { sigla: "PIBID", significado: "Programa Institucional de Bolsa de Iniciação à Docência" },
  { sigla: "PPC", significado: "Projeto Pedagógico do Curso" },
  { sigla: "PREx", significado: "Pró-Reitoria de Extensão" },
  { sigla: "RU", significado: "Restaurante Universitário (Prédio 10)" },
  { sigla: "SAVA", significado: "Sistema de Acolhimento às Vítimas de Assédio" },
  { sigla: "SiGex", significado: "Sistema de Gestão da Extensão" },
  { sigla: "Sisu", significado: "Sistema de Seleção Unificada" },
  { sigla: "TCC", significado: "Trabalho de Conclusão de Curso" },
  { sigla: "WebGiz", significado: "Sistema acadêmico de notas, frequência e matrícula" },
];

/* ───────────── Seções ───────────── */

const secoes: Section[] = [
  {
    id: "como-usar",
    label: "Como Usar o Portal",
    content: (
      <>
        <PanelAccordion
          intro="Entenda como navegar pelo portal e encontrar o que você precisa mais rápido."
          itens={[
            {
              titulo: "Como encontrar informações do meu curso",
              conteudo:
                "Acesse a seção Cursos e use a busca ou os filtros por campus, centro, turno, grau e área do conhecimento. Na página do curso você encontra vagas, turnos, estrutura curricular, PPC, documentos e o contato da coordenação.",
            },
            {
              titulo: "Como usar a busca do portal",
              conteudo:
                "A busca no topo da página (atalho Ctrl + K) leva direto às seções e serviços do portal. Experimente termos como “WebGiz”, “RU” ou “biblioteca”.",
            },
            {
              titulo: "O que encontro em cada seção",
              conteudo:
                "Vida Acadêmica reúne calendário, matrícula, biblioteca e normas. Serviços e Documentos concentra sistemas e requerimentos. Editais e Oportunidades lista bolsas e estágios. Unidades e Localização ajuda a se localizar no campus.",
            },
            {
              titulo: "Recursos de acessibilidade",
              conteudo:
                "As páginas podem ser navegadas pelo teclado, e o zoom do navegador (Ctrl + e Ctrl −) ajusta o tamanho do texto. Para apoio a necessidades educacionais específicas, procure o NUSI, no Prédio 2 (CCH).",
            },
          ]}
        />
        <PanelRelated
          links={[
            { label: "FAQ", to: "/ajuda-suporte#faq" },
            { label: "Glossário de Siglas", to: "/ajuda-suporte#glossario" },
            { label: "Fale com a Unimontes", to: "/ajuda-suporte#fale-conosco" },
          ]}
        />
      </>
    ),
  },
  {
    id: "faq",
    label: "FAQ",
    content: (
      <>
        <PanelAccordion
          intro="Respostas para as dúvidas mais frequentes dos estudantes."
          itens={[
            {
              titulo: "Como faço minha renovação de matrícula?",
              conteudo:
                "A renovação é feita pelo WebGiz, dentro do prazo do calendário acadêmico. O passo a passo completo está em Vida Acadêmica › Matrícula e Renovação de Matrícula.",
            },
            {
              titulo: "Como emito minha declaração de matrícula?",
              conteudo:
                "Envie e-mail ao responsável pelo seu curso na Secretaria Geral com o título “DECLARAÇÃO”, informando nome completo, matrícula, curso e campus. Para a versão impressa, escreva para secretaria.recepcao@unimontes.br e retire na recepção da Secretaria Geral.",
            },
            {
              titulo: "Onde vejo o calendário acadêmico?",
              conteudo:
                "O Calendário Letivo 2026 (Resolução CEPEx nº 983/2025) fica no site oficial da universidade. O acesso direto está em Vida Acadêmica › Calendário Acadêmico.",
            },
            {
              titulo: "Onde fica a Secretaria Geral?",
              conteudo:
                "No térreo do Prédio 2 (CCH), no Campus Darcy Ribeiro. Telefone (38) 3229-8040. Muitas solicitações podem ser feitas por e-mail, sem ir ao local.",
            },
            {
              titulo: "Quanto custa a refeição no Restaurante Universitário?",
              conteudo:
                "R$ 2,50 para acadêmicos. O RU fica no Prédio 10 e serve almoço das 10h30 às 13h30 e jantar das 17h30 às 20h.",
            },
            {
              titulo: "Como solicito segunda chamada de prova?",
              conteudo:
                "As regras estão nas Normas para Regulamentação do Ensino nos Cursos de Graduação. Procure a coordenação do seu curso dentro do prazo previsto.",
            },
            {
              titulo: "Como consulto minhas notas e frequência?",
              conteudo:
                "Notas e frequência ficam disponíveis no WebGiz, na área do estudante, por disciplina e período letivo.",
            },
            {
              titulo: "Quem procuro para dúvidas sobre o meu curso?",
              conteudo:
                "A coordenação do curso. O contato está na página do seu curso, na aba Coordenação.",
            },
          ]}
        />
        <PanelRelated
          links={[
            { label: "Problemas de Acesso", to: "/ajuda-suporte#problemas-acesso" },
            { label: "Serviços e Documentos", to: "/servicos-documentos" },
            { label: "Fale com a Unimontes", to: "/ajuda-suporte#fale-conosco" },
          ]}
        />
      </>
    ),
  },
  {
    id: "problemas-acesso",
    label: "Problemas de Acesso",
    content: (
      <>
        <PanelAccordion
          intro="Soluções para as dificuldades mais comuns de acesso aos sistemas da universidade."
          itens={[
            {
              titulo: "Esqueci minha senha do WebGiz",
              conteudo:
                "O login é o número de matrícula completo e a senha inicial é a data de nascimento com 8 dígitos (ex.: 28041983). Na tela de login, use “esqueci a senha”. Se ainda não conseguir, envie e-mail ao responsável pelo seu curso na Secretaria Geral.",
            },
            {
              titulo: "Não consigo renovar a matrícula",
              conteudo:
                "A renovação só abre no prazo do calendário acadêmico. Matrícula trancada não renova pelo sistema: solicite por e-mail ao responsável pelo seu curso na Secretaria Geral.",
            },
            {
              titulo: "Não consigo conectar no Wi-Fi do campus",
              conteudo:
                "A rede Wi-Fi Unimontes é gratuita para acadêmicos, servidores e colaboradores. Em caso de falha, procure a DTI: Prédio 5, 2º andar, sala 206 · (38) 3229-8125 · dti@unimontes.br.",
            },
            {
              titulo: "O portal não carrega ou está lento",
              conteudo:
                "Tente atualizar a página, limpar o cache do navegador ou acessar por outro dispositivo. Se o problema continuar, relate pelo Fale com a Unimontes.",
            },
            {
              titulo: "Minha matrícula não aparece no sistema",
              conteudo:
                "Isso pode ocorrer se a matrícula ainda não foi efetivada. Verifique sua situação com a Secretaria Geral: (38) 3229-8040 ou secretaria.recepcao@unimontes.br.",
            },
          ]}
        />
        <PanelRelated
          links={[
            { label: "Recursos Tecnológicos", to: "/vida-academica#tecnologicos" },
            { label: "FAQ", to: "/ajuda-suporte#faq" },
            { label: "Fale com a Unimontes", to: "/ajuda-suporte#fale-conosco" },
          ]}
        />
      </>
    ),
  },
  {
    id: "glossario",
    label: "Glossário de Siglas",
    content: (
      <>
        <Glossario siglas={SIGLAS} />
        <PanelRelated
          links={[
            { label: "Como Usar o Portal", to: "/ajuda-suporte#como-usar" },
            { label: "FAQ", to: "/ajuda-suporte#faq" },
            { label: "Cursos", to: "/cursos" },
          ]}
        />
      </>
    ),
  },
  {
    id: "fale-conosco",
    label: "Fale com a Unimontes",
    content: (
      <>
        <PanelAccordion
          intro="O Fale com a Unimontes é o canal oficial para dúvidas, elogios, sugestões e reclamações. Aqui também estão os telefones e e-mails dos principais setores."
          itens={[
            {
              titulo: "Escrever para o Fale com a Unimontes",
              conteudo: <FormularioContato email={FALECOM_EMAIL} />,
            },
            {
              titulo: "Atendimento presencial",
              conteudo:
                "Quiosque do Fale com a Unimontes, entre os prédios 1 e 2 do campus-sede, em frente à Secretaria Geral — de segunda a sexta, das 7h às 16h. Telefone (38) 3229-8229.",
            },
            {
              titulo: "Telefones",
              conteudo: (
                <ul className="space-y-1.5">
                  <li>Unimontes (geral): (38) 3229-8000</li>
                  <li>Fale com a Unimontes: (38) 3229-8229</li>
                  <li>Secretaria Geral: (38) 3229-8040</li>
                  <li>Biblioteca Central: (38) 3229-8212</li>
                  <li>Estágio (CAE): (38) 3229-8163</li>
                  <li>Suporte de TI (DTI): (38) 3229-8125</li>
                </ul>
              ),
            },
            {
              titulo: "E-mails",
              conteudo: (
                <ul className="space-y-1.5">
                  <li>Fale com a Unimontes: falecom@unimontes.br</li>
                  <li>Secretaria Geral (recepção): secretaria.recepcao@unimontes.br</li>
                  <li>Biblioteca Central: biblioteca.central@unimontes.br</li>
                  <li>Estágio (CAE): cae@unimontes.br</li>
                  <li>Suporte de TI (DTI): dti@unimontes.br</li>
                </ul>
              ),
            },
            {
              titulo: "Setores responsáveis",
              conteudo:
                "Documentos e matrícula: Secretaria Geral. Dúvidas do curso: coordenação do curso. Auxílios (PEAES): Núcleo de Assistência Estudantil. Estágio não obrigatório: CAE. Acessibilidade: NUSI. Wi-Fi e sistemas: DTI. Elogios, sugestões e reclamações: Fale com a Unimontes.",
            },
          ]}
        />

        <PanelNote>
          <strong className="font-bold">Campus Universitário Professor Darcy Ribeiro:</strong> Av.
          Rui Braga, s/nº, Vila Mauricéia, Montes Claros/MG · CEP 39401-089 · (38) 3229-8000 ·
          funcionamento das 8h às 18h, atendimento ao público das 8h às 17h.
        </PanelNote>

        <PanelLinks
          links={[
            {
              label: "Catálogo telefônico",
              desc: "Telefones de todos os setores da Unimontes, com busca por setor ou número.",
              href: "/contatos",
            },
            {
              label: "Sistema Fale com a Unimontes",
              desc: "Registre elogio, sugestão, pedido de providência, reclamação ou denúncia.",
              href: "https://www.sistemafalecom.unimontes.br/",
              external: true,
            },
            {
              label: "Ouvidoria-Geral do Estado",
              desc: "Disque-Ouvidoria 162.",
              href: "https://ouvidoriageral.mg.gov.br/",
              external: true,
            },
          ]}
        />

        <PanelRelated
          links={[
            { label: "FAQ", to: "/ajuda-suporte#faq" },
            { label: "Problemas de Acesso", to: "/ajuda-suporte#problemas-acesso" },
            { label: "Unidades e Localização", to: "/unidades-localizacao" },
          ]}
        />
      </>
    ),
  },
];

export const conteudoAjudaSuporte: PaginaConteudo = {
  caminho: "/ajuda-suporte",
  titulo: "Ajuda e Suporte",
  popular,
  tags,
  secoes,
};
