# 🎓 Portal Acadêmico – UNIMONTES

Este repositório contém o código-fonte da camada back-end do **Portal Acadêmico** da Universidade Estadual de Montes Claros (UNIMONTES), sistema desenvolvido com o objetivo de **centralizar e facilitar o acesso a informações institucionais e acadêmicas** para alunos.

O projeto busca modernizar o acesso às informações da universidade, oferecendo uma estrutura organizada e de fácil navegação. Dentro deste portal está integrado o **Manual do Calouro**, um módulo voltado especialmente para alunos recém-ingressos.

---

## 📘 Sobre o Manual do Calouro

O **Manual do Calouro** é uma seção dedicada a concentrar informações essenciais aos novos estudantes, como:
- Orientações iniciais sobre matrícula e acesso ao sistema acadêmico;
- Estrutura da universidade e contatos de setores importantes;
- Calendário acadêmico e eventos institucionais;
- Perguntas frequentes (FAQ);
- Dicas e orientações gerais para ambientação na vida universitária.

Esse módulo será implementado dentro do próprio backend do Portal Acadêmico, utilizando **Laravel (PHP)**, para garantir integração total com o restante do sistema e facilidade de manutenção.

---

## 🧱 Tecnologias utilizadas

- **Linguagem:** PHP 8.3+
- **Framework:** Laravel 12
- **Banco de Dados:** MySQL/MariaDB
- **Servidor Local:** Artisan / Apache / Nginx
- **Versionamento:** Git & GitHub

---

## ⚙️ Estrutura do Projeto


---

## 🚀 Como executar o projeto localmente

```bash
# 1. Clonar o repositório
git clone https://github.com/seuusuario/portal-academico.git

# 2. Entrar na pasta do projeto
cd portal-academico

# 3. Instalar as dependências
composer install

# 4. Configurar o arquivo .env
cp .env.example .env
php artisan key:generate

# 5. Executar as migrações do banco de dados
php artisan migrate

# 6. Iniciar o servidor local
php artisan serve
```

## 🧭 Status do Projeto

🔹 Em desenvolvimento
Estrutura base do backend concluída, aguardando definição completa dos requisitos funcionais do Manual do Calouro.

## ✍️ Desenvolvido por:
Dilceu Lopes – Sistemas de Informação – UNIMONTES
Ana Lívia – Sistemas de Informação – UNIMONTES

---

## 🔗 Integração SigEx (Eventos externos)

- **Descrição:** O backend pode sincronizar ações/eventos externos fornecidos pelo serviço SigEx e torná-los disponíveis via API pública interna.
- **Variáveis de ambiente:** adicione/configure no arquivo `.env` (ou `.env.example`):
	- `SIGEX_BASE_URL` — URL base do serviço SigEx (ex.: https://sigex.exemplo.gov.br)
	- `SIGEX_API_KEY` — chave de API usada em `X-API-KEY` nas requisições ao SigEx
	- `SIGEX_CACHE_MINUTES` — minutos para cachear a resposta remota (padrão: `10`)
- **Configuração:** `config/services.php` contém a chave `sigex` lendo as variáveis acima.

### Endpoints relevantes

- `GET /api/events` — lista paginada de eventos (retorno modelado no formato SigEx: `nome`, `descricao`, `data_inicio`, `data_fim`, `vagas_disponiveis`, `esgotado`, `url_detalhes`, etc.)
- `GET /api/events/{event}` — detalhes de um evento

### Sincronização (Artisan)

- Comando: `php artisan events:sync-external` — consulta o endpoint público do SigEx (`/api/v1/public/acoes`) usando o header `X-API-KEY`, cacheia a resposta e faz upsert por ID externo.
- Recomendação de agendamento: execute o comando a cada 5–10 minutos. O SigEx aplica limite de 60 requisições/minuto por IP, por isso o cache local é usado para evitar `429`.

Exemplo (dentro do container Docker):

```bash
docker compose exec app php artisan events:sync-external
```

### Comportamento e notas técnicas

- O modelo `Event` usa o identificador externo do SigEx como chave primária local (para evitar duplicatas).
- O serviço `EventPollingService` realiza:
	- requisição ao SigEx com `X-API-KEY`;
	- cache da resposta por `SIGEX_CACHE_MINUTES` minutos;
	- upsert dos eventos recebidos e despublicação (is_published=false) dos eventos que não estiverem na última sincronização;
	- tratamento explícito de respostas `401` e `429`.
- Ao usar endpoints que exigem sessão (ex.: formulários via browser), verifique que as requisições JS incluam `credentials: 'same-origin'` e que as rotas usem o guard `auth:web` quando apropriado.

### RBAC e permissões

- Foi adicionada a permissão `users.manage` e atribuída ao papel `suporte`. A permissão controla a UI/rotas de gestão de usuários.
- Observação: o papel `admin` **não** recebe `users.manage` por padrão — ajuste o seeding/seus seeds conforme necessário.

### Dicas de deploy e debugging

- Após mudanças em rotas locais, execute `php artisan route:clear` no ambiente de execução (ex.: dentro do container) para evitar cache de rotas desatualizado.
- Após mudanças em views Blade, execute `php artisan view:clear` para limpar views compiladas.


