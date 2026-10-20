import { ApiError, fetchApi } from "./api";
import type { CursoResumo, Curso, CursoDetalheView, CursoDocLink, VagasCurso } from "../types";

/**
 * Serviço de Cursos — consome a API pública do backend (somente leitura).
 *
 * A API devolve o registro CRU (`CursoResumo` / `Curso`); toda a formatação
 * de apresentação, inclusive os blocos genéricos de estágio e TCC, é montada
 * aqui em `toCursoView`. O banco nunca guarda texto de apresentação.
 */

/**
 * Documentos institucionais válidos para todos os cursos, publicados no site
 * oficial. O calendário muda a cada ano letivo: atualizar o link aqui (ou, no
 * futuro, cadastrá-lo no painel como documento institucional).
 */
const UP = "https://unimontes.br/wp-content/uploads";
const NORMAS_GRADUACAO = `${UP}/2026/09/NORMAS_regulamentacao_ensino_n984_10-dez-2025.pdf`;
const NORMAS_MONITORIA = `${UP}/2022/04/Normas-Gerais-para-Regulamentacao-da-Monitoria..pdf`;
const CALENDARIO = {
  label: "Calendário Acadêmico 2026",
  url: `${UP}/2026/01/r-983-e-anexo.pdf`,
  desc: "Datas do ano letivo — Resolução CEPEx nº 983/2025.",
};

/** Lista de cursos (página /cursos) */
export async function getCursos(): Promise<CursoResumo[]> {
  return fetchApi<CursoResumo[]>("/cursos");
}

/**
 * Detalhe de um curso pelo slug (página /cursos/:slug).
 *
 * Devolve `null` quando o curso não existe ou não está publicado (404);
 * qualquer outra falha é propagada para a página exibir o estado de erro.
 */
export async function getCurso(slug: string): Promise<CursoDetalheView | null> {
  try {
    const curso = await fetchApi<Curso>(`/cursos/${encodeURIComponent(slug)}`);
    return toCursoView(curso);
  } catch (erro) {
    if (erro instanceof ApiError && erro.status === 404) return null;
    throw erro;
  }
}

/** "Matutino e Noturno" / "Montes Claros, Januária e Unaí" */
function juntar(itens: string[]) {
  return itens.length <= 1
    ? (itens[0] ?? "")
    : `${itens.slice(0, -1).join(", ")} e ${itens[itens.length - 1]}`;
}

/**
 * Vagas agrupadas por quantidade/periodicidade, para caber num card:
 * "70 anuais (Montes Claros) · 35 anuais por campus (7 campi)"
 */
function formatarVagas(vagas: VagasCurso[]) {
  const grupos = new Map<string, string[]>();
  for (const v of vagas) {
    const chave = v.periodicidade ? `${v.quantidade} ${v.periodicidade}` : `${v.quantidade}`;
    grupos.set(chave, [...(grupos.get(chave) ?? []), v.campus]);
  }
  return Array.from(grupos, ([chave, campi]) => {
    if (vagas.length === 1) return chave;
    return campi.length === 1
      ? `${chave} (${campi[0]})`
      : `${chave} por campus (${campi.length} campi)`;
  }).join(" · ");
}

/** Aba "Documentos": links do curso + documentos institucionais comuns */
function montarArquivos(c: Curso): CursoDocLink[] {
  const arquivos: CursoDocLink[] = [];
  if (c.documentos.matrizUrl)
    arquivos.push({
      label: "Estrutura Curricular",
      url: c.documentos.matrizUrl,
      destaque: true,
      desc: "Disciplinas, períodos e carga horária do curso.",
    });
  if (c.documentos.ppcUrl)
    arquivos.push({
      label: "Projeto Pedagógico do Curso (PPC)",
      url: c.documentos.ppcUrl,
      destaque: true,
      desc: "Objetivos, perfil do egresso e organização do curso.",
    });
  arquivos.push({ ...CALENDARIO, destaque: true });
  arquivos.push(...c.documentosExtras);
  if (c.regulamentoTccUrl)
    arquivos.push({ label: "Regulamento de TCC do curso", url: c.regulamentoTccUrl });
  arquivos.push({
    label: "Normas para Regulamentação do Ensino (graduação)",
    url: NORMAS_GRADUACAO,
  });
  arquivos.push({ label: "Normas Gerais de Monitoria", url: NORMAS_MONITORIA });
  if (c.paginaOficial)
    arquivos.push({ label: "Página do curso no site da Unimontes", url: c.paginaOficial });
  return arquivos;
}

/**
 * Transforma o registro CRU na VIEW derivada consumida pela página de detalhe.
 * Aqui mora toda a formatação de apresentação — mantida no frontend.
 *
 * Os blocos de estágio e TCC trazem as regras gerais da universidade; os
 * detalhes de cada curso ficam no PPC e no regulamento, linkados nos documentos.
 */
export function toCursoView(c: Curso): CursoDetalheView {
  const anos = c.duracao ? Math.round(c.duracao / 2) : undefined;
  const vagas = formatarVagas(c.vagas);

  return {
    ...c,
    eyebrow: c.grau === "Tecnólogo" ? "Graduação Tecnológica" : `Graduação ${c.grau}`,
    tipo: juntar(c.turnos),
    duracaoLabel: anos ? `${anos} anos` : "Consulte o PPC",
    dados: [
      {
        rotulo: "Duração",
        valor: c.duracao ? `${anos} anos (${c.duracao} semestres)` : "Consulte o PPC",
      },
      ...(c.centro ? [{ rotulo: "Centro de Ensino", valor: c.centro }] : []),
      { rotulo: c.campi.length > 1 ? "Campi" : "Campus", valor: juntar(c.campi) },
      { rotulo: "Grau", valor: c.grau },
      { rotulo: "Modalidade", valor: c.modalidade },
      { rotulo: c.turnos.length > 1 ? "Turnos" : "Turno", valor: juntar(c.turnos) },
      { rotulo: "Área", valor: c.area },
      ...(vagas ? [{ rotulo: "Vagas", valor: vagas }] : []),
    ],
    estagio: {
      intro: `O estágio curricular obrigatório do curso de ${c.nome} segue o Projeto Pedagógico do Curso (PPC), que define carga horária, período de realização e forma de acompanhamento.`,
      informacoes: [
        {
          rotulo: "Estágio obrigatório",
          valor: "Conforme o PPC — orientações com a coordenação do curso",
        },
        {
          rotulo: "Estágio não obrigatório",
          valor: "Remunerado, sem vínculo empregatício — Balcão de Estágio da CAE",
        },
        {
          rotulo: "Quem pode participar",
          valor: "Acadêmicos regularmente matriculados e frequentes",
        },
        { rotulo: "Primeiro passo", valor: "Termo de Convênio entre a empresa e a Unimontes" },
      ],
      descricao:
        "Para o estágio não obrigatório, a Coordenadoria de Apoio ao Estudante (CAE) mantém convênios com empresas de Montes Claros e região. O modelo de Termo de Convênio é solicitado pelo e-mail cae@unimontes.br. A CAE atende das 7h às 21h, em frente à Secretaria Geral (Prédio 2).",
      documentosNecessarios: [
        "Termo de Convênio entre a empresa e a Unimontes",
        "Termo de Compromisso de Estágio",
        "Termo aditivo, em caso de prorrogação",
        "Termo de rescisão, em caso de encerramento antecipado",
      ],
      contatoEmail: "cae@unimontes.br",
    },
    tcc: {
      intro: `O Trabalho de Conclusão de Curso, quando previsto na estrutura curricular de ${c.nome}, segue o PPC e o regulamento aprovado pelo colegiado do curso.`,
      orientacoes: [
        { rotulo: "Regulamento", valor: "Definido pelo colegiado do curso" },
        {
          rotulo: "Normas gerais",
          valor: "Normas para Regulamentação do Ensino nos Cursos de Graduação (dez/2025)",
        },
        { rotulo: "Orientação", valor: "Professor orientador da área do tema" },
        { rotulo: "Dúvidas", valor: "Coordenação do curso" },
      ],
      descricao:
        "Prazos, formato (monografia, artigo ou outro produto) e forma de avaliação variam entre os cursos. Confira o regulamento do seu curso e os prazos do calendário acadêmico.",
      etapas: [
        "Escolha do tema e do orientador",
        "Elaboração do projeto",
        "Desenvolvimento e redação",
        "Entrega para avaliação",
        "Apresentação ou defesa, conforme o regulamento",
        "Entrega da versão final",
      ],
      documentos: [
        ...(c.regulamentoTccUrl
          ? [{ label: "Regulamento de TCC do curso", url: c.regulamentoTccUrl }]
          : []),
        ...(c.documentos.ppcUrl
          ? [{ label: "Projeto Pedagógico do Curso (PPC)", url: c.documentos.ppcUrl }]
          : []),
        { label: "Normas de Graduação", url: NORMAS_GRADUACAO },
        { label: CALENDARIO.label, url: CALENDARIO.url },
      ],
    },
    arquivos: montarArquivos(c),
    coordenacao: {
      intro: `A coordenação do curso de ${c.nome} atende estudantes e comunidade em assuntos acadêmicos do curso. Declarações, histórico e demais documentos são solicitados à Secretaria Geral.`,
      coordenador: c.coordenacao.coordenador ?? "Coordenação do curso",
      email: c.coordenacao.email ?? undefined,
      telefone: c.coordenacao.telefone ?? undefined,
      localizacao: c.coordenacao.localizacao ?? undefined,
      horarioAtendimento: "Conforme horário divulgado pela coordenação",
    },
  };
}
