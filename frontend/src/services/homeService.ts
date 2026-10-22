import { getEditais } from "./editalService";
import { getEventos } from "./eventoService";
import { formatarData, formatarPeriodo } from "../utils/data";
import type { Comunicado, DestaqueHero, Noticia, Oportunidade } from "../types";

/**
 * Serviço da Home.
 *
 * - Oportunidades e destaque do hero: derivados da API (editais e eventos).
 * - Comunicados e notícias: AINDA LOCAIS. São conteúdos reais de unimontes.br
 *   (06/10/2026), mantidos até o backend expor `/api/comunicados` e
 *   `/api/noticias`, que vão ler a API REST do WordPress do site oficial.
 */

const MAX_OPORTUNIDADES = 4;

/**
 * Editais abertos e eventos com inscrição aberta, pela data mais próxima.
 * Uma falha da API é propagada para a seção exibir o estado de erro.
 */
export async function getOportunidades(hoje = new Date()): Promise<Oportunidade[]> {
  const [editais, eventos] = await Promise.all([getEditais(hoje), getEventos(hoje)]);

  const deEditais = editais
    .filter((e) => e.status === "Aberto")
    .map((e) => ({
      ordem: e.prazo,
      item: {
        id: `edital-${e.id}`,
        title: e.titulo,
        tipo: e.tipo,
        rotuloData: "Prazo",
        data: formatarData(e.prazo),
        publico: e.publico,
        campus: e.campus,
        url: e.url ?? undefined,
      } satisfies Oportunidade,
    }));

  const deEventos = eventos
    .filter((e) => e.inscricoesAbertas && e.dias >= 0)
    .map((e) => ({
      ordem: e.data,
      item: {
        id: `evento-${e.id}`,
        title: e.titulo,
        tipo: "Evento",
        rotuloData: "Data",
        data: formatarPeriodo(e.data, e.dataFim),
        campus: e.campus ?? undefined,
        to: `/eventos/${e.slug}`,
      } satisfies Oportunidade,
    }));

  return [...deEditais, ...deEventos]
    .sort((a, b) => a.ordem.localeCompare(b.ordem))
    .slice(0, MAX_OPORTUNIDADES)
    .map((o) => o.item);
}

/**
 * Selo do hero: o evento que acontece hoje ou o próximo da semana.
 * Sem evento nesse intervalo, não há selo — nada de texto fixo para expirar.
 */
export async function getDestaqueHero(hoje = new Date()): Promise<DestaqueHero | null> {
  const eventos = await getEventos(hoje);
  const proximo = eventos
    .filter((e) => e.dias >= 0 && e.dias <= 7)
    .sort((a, b) => a.dias - b.dias || a.data.localeCompare(b.data))[0];
  if (!proximo) return null;

  const quando =
    proximo.dias === 0 ? "Hoje" : proximo.dias === 1 ? "Amanhã" : `Em ${proximo.dias} dias`;
  return {
    texto: `${quando} · ${proximo.titulo}`,
    corFundo: "#FF4D2E",
    to: `/eventos/${proximo.slug}`,
  };
}

export async function getComunicados(): Promise<Comunicado[]> {
  return [
    {
      id: 1,
      tag: "Seminário",
      tagColor: "#00B894",
      title: "Programação do Seminário Audiovisual Unimontes",
      desc: "A Pró-Reitoria de Extensão divulgou a programação do seminário, realizado em 23 e 24 de setembro no Auditório do CCH (Prédio 2), com painéis sobre jornalismo, desinformação, políticas para o audiovisual e educação empreendedora.",
      publico: "Participantes inscritos",
      campus: "Montes Claros",
      data: "22/09/2026",
      url: "https://unimontes.br/comunicado/comunicado-programacao-do-seminario-audiovisual-unimontes%ef%bf%bc%ef%bf%bc%ef%bf%bc%ef%bf%bc/",
    },
    {
      id: 2,
      tag: "Esporte",
      tagColor: "#FF4D2E",
      title: "Retirada dos kits da 4ª Corrida Eles com Elas pela Vida",
      desc: "Os kits foram entregues no sábado (19/09), no Parque Cândido Canela. A largada da corrida, promovida pelo Hospital Universitário Clemente de Faria, foi no domingo (20/09), às 8h.",
      publico: "Inscritos na corrida",
      campus: "Montes Claros",
      data: "17/09/2026",
      url: "https://unimontes.br/comunicado/comunicado-retirada-dos-kits-da-4a-corrida-eles-com-elas-pela-vida/",
    },
    {
      id: 3,
      tag: "Congresso",
      tagColor: "#6E3AFF",
      title: "III Congresso Internacional de Educação e Diversidade",
      desc: "O congresso acontece de 4 a 6 de novembro de 2026, com palestras, minicursos, oficinas, mesas-redondas e apresentações de trabalhos. A comunidade acadêmica está convidada a contribuir com a programação.",
      publico: "Comunidade acadêmica",
      campus: "Todos os campi",
      data: "16/09/2026",
      url: "https://unimontes.br/comunicado/comunicado-unimontes-convida-comunidade-academica-a-contribuir-com-a-programacao-do-iii-congresso-internacional-de-educacao-e-diversidade/",
    },
  ];
}

export async function getNoticias(): Promise<Noticia[]> {
  return [
    {
      id: 1,
      cat: "Pesquisa",
      catColor: "#00B894",
      bg: "#D9F5EC",
      img: "https://unimontes.br/wp-content/uploads/2026/09/WhatsApp-Image-2026-09-24-at-19.55.59-1.jpeg",
      title: "Pesquisa da Unimontes gera três patentes e transfere tecnologia para cooperativa",
      desc: "Shampoo, condicionador e máscara capilar à base de mel, desenvolvidos em pesquisa de mestrado em Biotecnologia, serão comercializados pela Coopermapi.",
      date: "06/10/2026",
      url: "https://unimontes.br/pesquisa-da-unimontes-gera-tres-patentes-e-transfere-tecnologia-para-cooperativa/",
    },
    {
      id: 2,
      cat: "Inovação",
      catColor: "#6E3AFF",
      bg: "#ECE3FF",
      img: "https://unimontes.br/wp-content/uploads/2026/10/IDEATHON-1-e1791291966974.jpeg",
      title: "Unimontes é parceira da Semana Municipal de Inovação",
      desc: "O evento acontece de 19 a 23 de outubro em Montes Claros e outras cidades do Norte de Minas, com participação da Coordenadoria de Inovação Tecnológica (CIT).",
      date: "06/10/2026",
      url: "https://unimontes.br/unimontes-e-parceira-na-realizacao-da-semana-de-inovacao-conectando-pessoas-ideias-e-oportunidades/",
    },
    {
      id: 3,
      cat: "Extensão",
      catColor: "#FF4D2E",
      bg: "#FFE3DA",
      img: "https://unimontes.br/wp-content/uploads/2026/10/Arte_revInterc.jpg",
      title: "Revista Intercâmbio abre submissões para o volume 23",
      desc: "O periódico semestral da Pró-Reitoria de Extensão recebe trabalhos inéditos de docentes, discentes e servidores até o dia 30 de outubro.",
      date: "06/10/2026",
      url: "https://unimontes.br/unimontes-abre-inscricoes-para-publicacao-de-trabalhos-na-revista-intercambio/",
    },
  ];
}
