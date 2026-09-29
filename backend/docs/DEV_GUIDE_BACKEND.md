# Guia Técnico para Desenvolvedores - Portal Acadêmico Backend

Data de referência: 2026-03-21

## Visão Geral
Este documento serve como referência técnica para desenvolvedores que irão manter ou evoluir o backend do Portal Acadêmico da UNIMONTES.

- **Stack:** PHP 8.2+, Laravel 12, Eloquent ORM, MySQL/MariaDB
- **Busca:** Laravel Scout + Meilisearch (fuzzy search)
- **Autorização:** Spatie Laravel Permission (RBAC)
- **Testes:** PHPUnit
- **API:** REST/JSON

## Estrutura do Projeto
- `routes/` — Definição dos endpoints (API REST)
- `app/Http/Controllers/` — Lógica de interface HTTP e validação
- `app/Services/` — Regras de negócio e orquestração
- `app/Models/` — Modelos Eloquent (domínio e persistência)
- `app/Http/Resources/` — Serialização de respostas JSON
- `database/migrations/` — Migrations do banco de dados
- `database/seeders/` — Seeders para dados iniciais e testes
- `tests/Feature/` — Testes de integração/contrato
- `config/` — Arquivos de configuração (inclui search.php, scout.php)

## Principais Módulos
- **User:** Usuários, papéis e permissões
- **Course, Subject, Center, Department:** Entidades acadêmicas principais
- **Document:** Upload, download e metadados de arquivos institucionais
- **Busca:** Endpoint `/api/search` com fuzzy search (Scout/Meilisearch)
- **RBAC:** Controle de acesso por papel/permissão (Spatie)

## Padrões e Convenções
- **Nomenclatura:** Inglês técnico para código, banco e API. Exceções: `cpf`, `matricula`.
- **REST:** Contrato JSON padronizado, erros com código e mensagem (`AUTH_401`, `AUTH_403` etc).
- **Factories:** Usadas para gerar dados fake em testes e seeders.
- **Trait Searchable:** Models indexados para busca fuzzy devem usar `use Searchable` e definir `toSearchableArray()`.

## Fluxo de Desenvolvimento
1. **Instalação:**
   - Composer install
   - Configurar `.env` (ver exemplos em outros arquivos)
   - Rodar migrations e seeders: `php artisan migrate --seed`
2. **Testes:**
   - Rodar `php artisan test` para validar regressão
3. **Busca:**
   - Rodar Meilisearch (Docker recomendado)
   - Indexar dados: `php artisan scout:import "App\\Models\\Course"` (e demais models)
4. **Execução:**
   - Servidor local: `php artisan serve`
   - API disponível em `/api/*`

## Dicas para Manutenção
- Sempre rode os testes antes de subir alterações.
- Atualize os seeders/factories ao criar novos campos.
- Para novos módulos, siga o padrão controller → service → resource → policy.
- Para RBAC, registre permissões no `RoleSeeder` e proteja rotas com middleware `can:*`.
- Para busca, lembre de reindexar após alterar dados ou campos indexados.
- Documente endpoints e regras de negócio neste arquivo ou em arquivos específicos.

## Setup do Projeto (Docker)

1. Configure o `.env` conforme exemplo abaixo.
2. Suba os serviços: `docker-compose up --build`
3. Acesse o container app: `docker-compose exec app bash`
4. Instale dependências: `composer install`
5. Gere a key: `php artisan key:generate`
6. Rode as migrations e seeders: `php artisan migrate --seed`
7. Reindexe buscas: `php artisan scout:import "App\\Models\\Course"` (e outros models)
8. Configure prioridade dos campos: `php artisan scout:meilisearch-config`

## Busca Inteligente (IA-Like / Meilisearch)

- **Motor:** Laravel Scout + Meilisearch (Docker).
- **Multi-Search:** O `SearchService` utiliza o endpoint `/multi-search` para consultar todos os índices em uma única requisição HTTP, garantindo alta performance.
- **Extração de Texto (PDF/TXT):** Conteúdo interno de arquivos PDF e TXT é extraído durante o upload e indexado no campo `searchable_text`.
- **Ranking Nativo:** O `SearchService` utiliza o algoritmo de ranking do Meilisearch (Rust) para relevância superior.
- **Destaques (Highlighting):** Resultados retornam o campo `highlights` com tags `<mark>` ao redor dos termos encontrados.
- **Snippets (Inteligentes):** O campo `description` da busca prioriza automaticamente o fragmento do texto extraído que contém o termo pesquisado, facilitando a visualização rápida pelo usuário.
- **Sinônimos:** Configurados em `MeilisearchConfigureCommand.php` (ex: PPC = Projeto Pedagógico, PAES, Vestibular, etc).
- **Autocomplete:** Endpoint `/api/search/suggest` com multi-search e cache de 10 minutos.
- **Resiliência:** Fallback automático para SQL (LIKE) unificado caso o Meilisearch esteja offline.
- **Configuração:** Sempre que alterar campos indexáveis ou resetar o banco, rode:
  - `php artisan scout:sync-all` (comando mestre que configura e importa tudo)

## Monitoramento e Saúde (Health Check)

- **Endpoint:** `GET /api/health`
- **Proteção:** Restrito a usuários autenticados com permissão `health.read` (papel `suporte`).
- **O que faz:** Verifica a conectividade e o status dos serviços críticos:
    - **Database:** Conexão MySQL.
    - **Redis:** Conexão via driver `predis`.
    - **Meilisearch:** Status da API e disponibilidade do host.
    - **Storage:** Permissão de escrita no disco local.
- **Resposta:** Retorna `200 OK` se tudo estiver operacional ou `503 Service Unavailable` se algum serviço crítico falhar.

## Auditoria Administrativa (Audit Log)

- **O que é:** Sistema de rastreabilidade para ações de `admin` e `suporte`.
- **Implementação:** Trait `App\Traits\Auditable`.
- **Eventos Monitorados:** 
    - **Escrita:** `created`, `updated`, `deleted` em modelos principais (Course, Document, Event, User).
    - **Leitura (LGPD):** `accessed` (visualização de detalhes de usuário) e `downloaded` (download de arquivos).
- **Dados Registrados:** Usuário, evento, valores antigos vs novos, IP e User Agent.
- **Conformidade LGPD (Hardening):** Campos sensíveis (`password`, `remember_token`) e **Dados Pessoais Identificáveis (`cpf`, `matricula`)** são automaticamente removidos dos logs para garantir a privacidade e minimização de dados.

## Autorização Contextual (Zero Trust)

- **Abordagem:** "Tudo é proibido, exceto quando explicitamente permitido".
- **CoursePolicy & SubjectPolicy:** 
    - `suporte`: Acesso total.
    - `admin`: Restrito a gerenciar apenas os cursos/disciplinas aos quais está explicitamente vinculado (via `adminCourses`). Não pode criar ou deletar cursos.
- **DocumentPolicy:**
    - `suporte`: Acesso total.
    - `admin`: Pode enviar documentos e deletar apenas os que ele mesmo enviou ou que pertencem ao seu contexto de curso.
    - **Visibilidade:** Documentos não marcados como `is_public` são restritos aos donos ou suporte.

## Segurança de Upload e Privacidade (Hardening)

- **Visibilidade:** Campo `is_public` define se o documento é acessível publicamente ou restrito a administradores.
- **Busca Protegida:** A API de busca filtra automaticamente documentos privados para usuários não autenticados.
- **MIME Type Hardening:** Validação rigorosa do conteúdo binário (`PDF`, `DOCX`, `TXT`, `JPG`, `PNG`). Impede renomeação maliciosa de extensões.
- **Tamanho Máximo:** Limite de 10MB por arquivo para prevenir DoS.
- **Sanitização de Nomes:** Nomes de arquivos originais são sanitizados via `Str::slug` para prevenir ataques de Path Traversal.

## Segurança e Performance

- **Logging:** Configurado como `LOG_CHANNEL=daily` para organização de arquivos por data.
- **Redis Client:** Utiliza `predis` (PHP puro) para máxima portabilidade entre ambientes Docker sem depender de extensões C.
- **Rate Limiting:** Rotas de busca protegidas por `throttle:60,1`.
- **N+1 Prevention:** Uso obrigatório de Eager Loading (`with()`) em listagens.
- **Caching:** Sugestões de busca e respostas do SigEx são cacheadas.

## Integração SigEx (Eventos externos)

- **O que é:** serviço externo (SigEx) que disponibiliza ações/eventos públicos via `GET /api/v1/public/acoes`.
- **Configuração (.env):**

```
SIGEX_BASE_URL=
SIGEX_API_KEY=
SIGEX_CACHE_MINUTES=10
```

- **Uso no código:** `config/services.php` contém a chave `sigex` que lê as variáveis acima; o serviço `app/Services/EventPollingService.php` realiza a sincronização e usa cache local para evitar `429`.
- **Comando Artisan:** `php artisan events:sync-external` — executa a sincronização e faz upsert dos eventos.
- **Recomendação de agendamento:** executar o comando a cada 5–10 minutos via scheduler (`app/Console/Kernel.php`) ou cron no container/host.
- **Notas de debug:** valide que o header `X-API-KEY` esteja configurado corretamente; trate respostas `401` e `429` conforme logs do comando.

## Operação e deploy (notas adicionais)

- Após alterações de rota rode: `php artisan route:clear` no ambiente de execução (ex.: dentro do container Docker).
- Após alterações em views rode: `php artisan view:clear` para limpar views compiladas.
- Ao implementar novos campos nas migrations, atualize factories e seeders para garantir execução local dos testes.

## Plano de Aplicação da Busca com Experiência Próxima de IA

Objetivo: fazer a busca responder como um assistente de informação institucional, priorizando relevância, contexto e clareza de resposta, sem trocar o banco principal.

### Fase 1: Indexação rica
- Indexar cursos, disciplinas, centros, departamentos e documentos no motor de busca.
- Incluir título, descrição, tipo, contexto, nome original do arquivo, extensão e metadados úteis.
- Para documentos, armazenar também texto extraído do conteúdo quando o formato permitir.

### Fase 2: Relevância e ranking
- Priorizar correspondências por título, contexto e proximidade semântica do termo pesquisado.
- Criar pesos diferentes para nome, descrição, tipo de documento e conteúdo extraído.
- Penalizar resultados genéricos quando existirem resultados mais específicos.

### Fase 3: Experiência de resposta
- Exibir trechos destacados do conteúdo encontrado.
- Mostrar categoria, contexto e tipo de resultado antes do usuário abrir o item.
- Ordenar por relevância real, não apenas por data ou quantidade de texto.

### Fase 4: Autocomplete e sinônimos
- Sugerir consultas frequentes enquanto o usuário digita.
- Mapear sinônimos institucionais e variações comuns de linguagem.
- Corrigir grafias próximas e ampliar consultas curtas com termos equivalentes.

### Fase 5: Observabilidade e melhoria contínua
- Registrar consultas sem resultado.
- Registrar cliques, refinamentos e abandono de busca.
- Usar essas métricas para ajustar ranking, sinônimos e qualidade dos índices.

### Fase 6: Evolução semântica
- Caso a necessidade aumente, adicionar busca vetorial por embeddings para consultas mais abstratas.
- Usar essa camada apenas como complemento à busca textual já existente.
- Manter Meilisearch como motor principal enquanto ele atender bem à UX.

### Critério de sucesso
- O usuário encontra a informação com poucas tentativas.
- Resultados relevantes aparecem no topo mesmo com consultas vagas.
- Documentos, cursos e regras institucionais ficam pesquisáveis de forma uniforme.
- A experiência continua rápida, simples e previsível.

## Docker

- Use `docker-compose up --build` para subir app, MySQL, Redis e Meilisearch.
- O Laravel acessa serviços via nomes dos containers: `db`, `redis`, `meilisearch`.
- Após subir, acesse o app em http://localhost:8000 e o painel do Meilisearch em http://localhost:7700 (use a API Key do .env).

## Variáveis de Ambiente Importantes (.env)

```
DB_HOST=db
DB_PORT=3306
DB_DATABASE=portal_academico
DB_USERNAME=portal_academico_user
DB_PASSWORD=portal@cademico013
MEILISEARCH_HOST=http://meilisearch:7700
MEILISEARCH_KEY=nbiNSJnwZmUEzztAyFOV6XQFB9olj4tmw_QhC83rjmw
```

## Checklist pós-build Docker

- `docker-compose exec app bash`
- `composer install`
- `php artisan key:generate`
- `php artisan migrate --seed`
- `php artisan scout:import "App\\Models\\Course"` (e outros models)
- `php artisan scout:meilisearch-config`

## Observações

- O Meilisearch exige API Key para acessar o painel web.
- Os dados de busca são aleatórios (lorem ipsum) em ambiente de desenvolvimento.
- O fallback SQL garante busca mesmo se o Meilisearch cair.
