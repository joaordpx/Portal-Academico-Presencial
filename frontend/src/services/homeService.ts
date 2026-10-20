/**
 * Serviço da Home (comunicados, oportunidades, notícias e destaque do hero).
 *
 * Mock temporário — para integrar, importe `fetchApi` de "./api", descomente a
 * chamada correspondente e remova o mock.
 */

import { Comunicado, Oportunidade, Noticia, DestaqueHero } from "../types";

export async function getComunicados(): Promise<Comunicado[]> {
  // return fetchApi<Comunicado[]>('/comunicados');
  return [
    {
      id: 1,
      tag: "Urgente",
      tagColor: "#FF4D2E",
      title: "Alteração do calendário acadêmico",
      desc: "Novo calendário a partir do próximo mês. Todas as turmas de graduação presencial devem estar atentas às novas datas.",
      publico: "Graduação presencial",
      campus: "Todos os campi",
      data: "22/05/2026",
    },
    {
      id: 2,
      tag: "Sistemas",
      tagColor: "#6E3AFF",
      title: "Manutenção programada do sistema acadêmico",
      desc: "Sistema indisponível no dia 18/05 das 22h às 6h para atualização e melhorias de performance.",
      publico: "Toda a comunidade",
      campus: "Online",
      data: "18/05/2026",
    },
    {
      id: 3,
      tag: "Matrícula",
      tagColor: "#00B894",
      title: "Aviso sobre renovação de matrícula",
      desc: "Atenção aos prazos para renovação de matrícula do período 2026/2. Confira datas no calendário acadêmico.",
      publico: "Graduação",
      campus: "Vila Mauricéia",
      data: "15/05/2026",
    },
  ];
}

export async function getOportunidades(): Promise<Oportunidade[]> {
  return [
    {
      id: 1,
      title: "Semana de Extensão Universitária",
      tipo: "Evento",
      prazo: "30/05/2026",
      publico: "Aberto a todos",
      campus: "Vila Mauricéia",
    },
    {
      id: 2,
      title: "Edital de Monitoria — Sistemas de Informação",
      tipo: "Edital",
      prazo: "10/06/2026",
      publico: "Graduação SI",
      campus: "Bloco G",
    },
    {
      id: 3,
      title: "Inscrição para Estágio — Administração",
      tipo: "Estágio",
      prazo: "05/06/2026",
      publico: "Administração",
      campus: "Vila Mauricéia",
    },
    {
      id: 4,
      title: "Curso gratuito: Excel Avançado",
      tipo: "Curso",
      prazo: "20/06/2026",
      publico: "Comunidade",
      campus: "EAD",
    },
  ];
}

export async function getNoticias(): Promise<Noticia[]> {
  return [
    {
      id: 1,
      cat: "Extensão",
      catColor: "#6E3AFF",
      bg: "#ECE3FF",
      img: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900",
      title: "Projeto de extensão leva atendimento jurídico a comunidades rurais",
      desc: "Alunos do curso de Direito participam de ação que beneficiou mais de 200 famílias na região norte de Minas.",
      date: "20/05/2026",
    },
    {
      id: 2,
      cat: "Serviços",
      catColor: "#FF4D2E",
      bg: "#FFE3DA",
      img: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900",
      title: "Novo aplicativo mobile facilita acesso ao cardápio do RU",
      desc: "Sistema permite consultar cardápio semanal, horários e saldo de refeições direto do celular.",
      date: "18/05/2026",
    },
    {
      id: 3,
      cat: "Pesquisa",
      catColor: "#00B894",
      bg: "#D9F5EC",
      img: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900",
      title: "Pesquisa sobre plantas do cerrado é destaque nacional",
      desc: "Estudo coordenado por professores e estudantes de Biologia recebe prêmio da SBPC.",
      date: "15/05/2026",
    },
  ];
}

export async function getDestaqueHero(): Promise<DestaqueHero | null> {
  return {
    texto: "Matrículas abertas",
    corFundo: "#FF4D2E",
    ativo: true,
  };
}
