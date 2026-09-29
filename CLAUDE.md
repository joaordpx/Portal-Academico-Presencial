# Portal Acadêmico — Unimontes

Monorepo com `frontend/` (React + TypeScript, Vite) e `backend/` (Laravel 12, PHP 8.2+, Laravel Scout + Meilisearch, Spatie Permission). Portal público que resolve a dor de "a busca do site da Unimontes não funciona", cobrindo cursos, vida acadêmica, editais/oportunidades, eventos, unidades/localização e ajuda/suporte.

## Status atual (2026-09-29)

- **Frontend**: completo nas 14 páginas da arquitetura de informação, mas **100% mockado** (`frontend/src/services/*.ts`). Nenhuma chamada real à API — os `fetchApi(...)` previstos estão comentados nos services, prontos para o swap mock → API.
- **Backend**: Laravel 12 funcional, com `Course`, `Subject`, `Center`, `Department`, `Document`, `User`/RBAC (Spatie) e busca (Scout + Meilisearch) implementados e testados — mas **não integrado ao frontend React**. O contrato de dados do backend (nomes de campos, nível de detalhe) diverge bastante do que o frontend espera. Ver `docs/roadmap.md` para o diagnóstico histórico e `plan.md` (raiz) para o plano de adequação do backend a este contrato.
- **`backend/claude readme/README.md`** descreve uma UI de referência/playground em Blade/SSR (autenticação por sessão, views em `resources/views/`) que **está de fato integrada** em `backend/routes/web.php` e consome a mesma API JSON via `fetch()` client-side. Não é o produto final (o produto é o frontend React) — é uma ferramenta interna de teste manual do backend. Não confundir com o contrato React.
- **Auth do backend**: sessão/cookie (`auth:web`) + CSRF, sem Sanctum/Passport e **sem nenhum endpoint JSON de login** (`/api/login` não existe). Qualquer integração do React com rotas autenticadas do backend precisa disso resolvido antes.

## Onde ficam os documentos de referência

| Documento | Conteúdo |
|---|---|
| `docs/modelo-dados.md` | Modelo de dados "vivo", desenhado a partir do que o frontend mock revela. Define os dois níveis CRU/VIEW e as decisões CRUD vs REDIRECT vs ESTÁTICO por entidade. |
| `docs/roadmap.md` | Diagnóstico de estado do projeto e roadmap por fases (fundação técnica, busca, backend, conteúdo, alimentação, refinamento). Define o escopo do MVP. |
| `backend/docs/API_CONTRACTS.md` | Contratos de API do backend com exemplos — **pode estar desatualizado frente ao código real**; usar como ponto de partida, sempre confirmar contra `routes/api.php` + Controllers + Resources. |
| `backend/docs/CONVENCAO_NOMENCLATURA.md` | Convenção de nomenclatura do backend (inglês técnico no código/API, português na documentação institucional). |
| `backend/docs/DEV_GUIDE_BACKEND.md` | Guia técnico do backend: stack, estrutura de pastas, busca (Meilisearch), auditoria, RBAC, Docker, integração SigEx. |
| `backend/claude readme/README.md` | Instruções de uma UI de referência Blade/SSR sobre a mesma API — ver nota acima; não é o contrato do frontend React. |
| `plan.md` (raiz) | Plano de adequação do backend ao contrato esperado pelo frontend — organizado por entidade, priorizado pelo MVP do roadmap. Implementação vem depois, em etapa separada. |

## Convenções de nomenclatura

- Código, banco de dados e chaves JSON da API do backend: **inglês técnico** (`name`, `course_id`, `min_duration`, `shift`, `type`...). Exceções de domínio jurídico/regulatório: `cpf`, `matricula`.
- Documentação institucional e textos para usuários da universidade: **português**.
- **Atenção**: o frontend foi modelado mock-first inteiramente em **português** (`nome`, `grau`, `turno`, `descricao`, `vagas`...) e o `EventResource` do backend hoje mistura os dois padrões (`nome`, `descricao`, `data_inicio`... junto com `center_id`, `is_published`, `created_at`). Isso é uma das divergências centrais entre frontend e backend — ver `plan.md`.

## Padrão de dados do frontend (dois níveis)

- **CRU** — espelha a tabela/relações do backend. Só dados brutos, sem formatação.
- **VIEW** — derivado no frontend (camada `toView` de cada serviço, ex. `toCursoView` em `cursoService.ts`), formatado para exibição (rótulos, labels compostos). **Nunca persiste no backend.**
- Regra de ouro: o banco guarda o CRU; toda formatação de apresentação fica no frontend. Ao adequar o backend, resistir à tentação de devolver campos já formatados (ex. `eyebrow`, `duracaoLabel`) — isso é responsabilidade do frontend.

Ver `docs/modelo-dados.md` para a classificação por entidade (🟢 CRUD / 🔵 REDIRECT / ⚪ ESTÁTICO).

## Comandos relevantes

**Frontend** (`frontend/`, `package.json`):
- `npm run dev` — servidor de desenvolvimento (Vite)
- `npm run build` — `tsc --noEmit && vite build` (type-check antes do build)
- `npm run typecheck` — apenas `tsc --noEmit`
- `npm run lint` / `npm run lint:fix` — ESLint
- `npm run format` / `npm run format:check` — Prettier
- `npm run test` / `npm run test:watch` — Vitest

> Nota: `docs/roadmap.md` (04/08/2026) descreve o frontend como sem lint/testes/type-check no build ("Fase 1 — Fundação técnica" ainda pendente). O `package.json` atual já tem tudo isso configurado (`eslint.config.js`, `.prettierrc.json`, testes em `frontend/src/services/*.test.ts` e `frontend/src/utils/data.test.ts`) — o roadmap parece desatualizado nesse ponto específico; confirmar o estado real antes de assumir uma fase como pendente.

**Backend** (`backend/`, Laravel 12 + Docker):
- `docker-compose up --build` — sobe app, MySQL, Redis, Meilisearch
- `composer install`, `php artisan key:generate`, `php artisan migrate --seed`
- `php artisan test` (ou `composer test`) — PHPUnit
- `php artisan scout:sync-all` — reindexa tudo no Meilisearch (rodar após alterar campos indexáveis ou resetar o banco)
- `php artisan events:sync-external` — sincroniza eventos do SigEx manualmente (também agendado a cada 10 min via `routes/console.php`, requer scheduler rodando)
- `php artisan route:clear` — após alterar rotas
