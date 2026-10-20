import { createBrowserRouter } from "react-router";
import { Layout } from "./components/layout/Layout";
import { Home } from "./pages/Home";

/**
 * A Home é carregada junto com a aplicação (é a porta de entrada).
 * As demais páginas usam `lazy`: o React Router baixa o código de cada
 * uma somente quando a rota é acessada, reduzindo o peso do primeiro
 * carregamento — relevante em conexões móveis lentas.
 */
export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      {
        path: "vida-academica",
        lazy: async () => ({ Component: (await import("./pages/VidaAcademica")).VidaAcademica }),
      },
      {
        path: "cursos",
        lazy: async () => ({ Component: (await import("./pages/Cursos")).Cursos }),
      },
      {
        path: "cursos/:slug",
        lazy: async () => ({ Component: (await import("./pages/CursoDetalhe")).CursoDetalhe }),
      },
      {
        path: "servicos-documentos",
        lazy: async () => ({
          Component: (await import("./pages/ServicosDocumentos")).ServicosDocumentos,
        }),
      },
      {
        path: "editais-oportunidades",
        lazy: async () => ({ Component: (await import("./pages/Editais")).Editais }),
      },
      {
        path: "eventos",
        lazy: async () => ({ Component: (await import("./pages/Eventos")).Eventos }),
      },
      {
        path: "eventos/:slug",
        lazy: async () => ({ Component: (await import("./pages/EventoDetalhe")).EventoDetalhe }),
      },
      {
        path: "assistencia-estudantil",
        lazy: async () => ({
          Component: (await import("./pages/AssistenciaEstudantil")).AssistenciaEstudantil,
        }),
      },
      {
        path: "movimento-estudantil-lazer",
        lazy: async () => ({
          Component: (await import("./pages/MovimentoEstudantil")).MovimentoEstudantil,
        }),
      },
      {
        path: "unidades-localizacao",
        lazy: async () => ({
          Component: (await import("./pages/UnidadesLocalizacao")).UnidadesLocalizacao,
        }),
      },
      {
        path: "ajuda-suporte",
        lazy: async () => ({ Component: (await import("./pages/AjudaSuporte")).AjudaSuporte }),
      },
      // Rota antiga mantida: os links existentes para /contato continuam válidos
      {
        path: "contato",
        lazy: async () => ({ Component: (await import("./pages/AjudaSuporte")).AjudaSuporte }),
      },
      {
        path: "*",
        lazy: async () => ({ Component: (await import("./pages/NotFound")).NotFound }),
      },
    ],
  },
]);
