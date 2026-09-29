# Convencao de Nomenclatura - Portal Academico Backend

Data de referencia: 2026-03-07

## Objetivo
Padronizar o projeto adotando o melhor dos dois mundos:
- tecnico em ingles (codigo, banco, APIs);
- comunicacao institucional em portugues (documentos funcionais e contexto de negocio).

## Regras
- Classes, metodos, variaveis, arquivos e tabelas: ingles.
- Endpoints e chaves JSON da API: ingles.
- Eventos de auditoria (Audit Log): ingles (`accessed`, `downloaded`, `created`, etc).
- Termos legais/regulatorios brasileiros podem permanecer em portugues quando forem padrao de dominio:
  - exemplos: `cpf`, `matricula`.
- Documentacao institucional e textos voltados a usuarios da universidade: portugues.

## Exemplos aplicados
- `User`, `Course`, `Subject`, `Center`, `Department`, `Document`, `AuditLog`
- Campos: `name`, `course_id`, `min_duration`, `coordinator_email`, `type`, `is_public`
- Chaves JSON: `name`, `shift`, `market_description`, `subjects`, `snippet`, `highlights`
- Eventos de Auditoria: `created`, `updated`, `deleted`, `accessed`, `downloaded`

## Tipos de curso (catalogo oficial)
- Valores tecnicos persistidos em `courses.type`:
  - `graduacao`
  - `pos-graduacao`
  - `tecnico`
  - `ead`
- Rotulos institucionais para exibicao:
  - graduacao
  - Pos-graduacao
  - Tecnico
  - ead (ensino a distancia)

## Observacoes de transicao
- Campos legados podem permanecer temporariamente para compatibilidade e migracao gradual.
- Novos modulos devem nascer seguindo esta convencao.

## Notas sobre infraestrutura Docker
- Os nomes dos containers Docker devem ser sempre em inglês e minúsculo (ex: `app`, `db`, `redis`, `meilisearch`).
- Variáveis de ambiente para conexão entre containers devem seguir o padrão técnico (ex: `DB_HOST=db`, `MEILISEARCH_HOST=http://meilisearch:7700`).
