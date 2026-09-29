# Portal Acadêmico — Unimontes

Portal que centraliza informações da vida acadêmica da **Universidade Estadual de Montes Claros**:
cursos, calendário, matrícula, documentos, editais, eventos, assistência estudantil e localização
no campus.

O objetivo é resolver um problema concreto: hoje essas informações existem, mas estão espalhadas e
são difíceis de encontrar. O portal reúne o que é próprio da universidade e **redireciona para as
fontes oficiais** onde elas já são mantidas — evitando duplicar conteúdo que ficaria desatualizado.

**Público:** estudantes da modalidade presencial de todos os campi (Montes Claros, Januária,
Pirapora, Salinas, São Francisco).

---

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | React 18 + React Router 7 |
| Build | Vite 6 + TypeScript |
| Estilo | TailwindCSS 4 |
| Componentes | Radix UI + shadcn/ui |
| Animações | Motion |
| Ícones | Lucide |
| Backend (em integração) | Laravel 12 + MySQL + Meilisearch |

---

## Como rodar

```bash
npm install
```

```bash
npm run dev
```

A aplicação sobe em `http://localhost:5173`.

Para gerar o build de produção:

```bash
npm run build
```

### Variáveis de ambiente

Crie um arquivo `.env` na raiz:

```
VITE_API_URL=http://localhost:8000/api
```

Se a variável não for definida, o padrão é `http://localhost:8000/api`.

---

## Estrutura do projeto

```
src/
├── app/
│   ├── routes.tsx              # definição das rotas
│   ├── pages/                  # uma página por rota
│   └── components/
│       ├── layout/             # Header, Footer, PageHeader, SectionLayout
│       ├── shared/             # Reveal, SearchDialog, ImageWithFallback
│       └── ui/                 # primitivas (Radix / shadcn)
├── services/                   # acesso a dados
├── types/                      # tipos compartilhados
├── utils/                      # formatação de datas etc.
├── assets/                     # imagens
└── styles/                     # Tailwind e tema
```

---

## Padrão de dados

O padrão tem dois níveis:

- **Cru** — espelha a tabela do backend (ex.: `Curso`, `Evento`, `Local`)
- **View** — derivado no serviço, com a formatação de apresentação (ex.: `CursoDetalheView`)

O banco guarda dados crus; a formatação (montar `"Graduação Bacharelado"`, `"4 anos"`, pares
rótulo/valor) fica no frontend.

---

## Design system

**Roxo `#6E3AFF`** é a cor estrutural: navegação, filtros, botões, estados ativos.

As demais cores são **acentos semânticos**:

| Cor | Uso |
|---|---|
| 🟢 `#00B894` | disponível, aberto, acessibilidade presente |
| 🔴 `#FF4D2E` | urgência (prazo próximo), eventos culturais |
| 🟡 `#FFB800` | destaque, biblioteca |
| 🔵 `#2563EB` | links de texto |

Componentes de seção reutilizáveis (`src/app/components/layout/SectionLayout.tsx`):

| Componente | Uso |
|---|---|
| `PanelLinks` | grade de botões-link |
| `PanelAccordion` | conteúdo expansível (FAQ, blocos longos) |
| `PanelSteps` | passo a passo com trilhas alternáveis |
| `PanelRedirect` | encaminhamento para fonte oficial externa |
| `PanelRelated` | bloco "Links relacionados" |
| `PanelNote` | aviso informativo |

---

## Rotas

| Rota | Página |
|---|---|
| `/` | Início |
| `/cursos` · `/cursos/:slug` | Cursos e detalhe do curso |
| `/vida-academica` | Calendário, matrícula, biblioteca, normas, tutoriais |
| `/servicos-documentos` | Sistemas, documentos, requerimentos |
| `/editais-oportunidades` | Editais, estágios, bolsas, pesquisa e extensão |
| `/eventos` · `/eventos/:slug` | Eventos e detalhe do evento |
| `/assistencia-estudantil` | Auxílios, RU, saúde, acessibilidade, direitos |
| `/movimento-estudantil-lazer` | DCE, centros acadêmicos, esporte, reservas |
| `/unidades-localizacao` | Campus, demais unidades, organograma |
| `/ajuda-suporte` | Como usar, FAQ, problemas de acesso, glossário, contato |
