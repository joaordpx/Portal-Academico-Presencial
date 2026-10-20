# Portal Acadêmico — Backend

API pública (somente leitura) para o frontend do portal e painel administrativo para
alimentar o conteúdo.

| Camada | Tecnologia |
|---|---|
| Framework | Laravel 12 (PHP 8.3) |
| Painel administrativo | Filament 5 — `/admin` |
| Papéis e permissões | spatie/laravel-permission |
| Banco | SQLite no desenvolvimento · MySQL em produção (servidor da DTI) |

## Como rodar

Requer PHP 8.2+ com a extensão `intl` (o [Laravel Herd](https://herd.laravel.com) já traz tudo).

```bash
composer install
```

```bash
cp .env.example .env
```

```bash
php artisan key:generate
```

```bash
php artisan migrate --seed
```

```bash
php artisan serve
```

- API: `http://localhost:8000/api/status`
- Painel: `http://localhost:8000/admin` — em desenvolvimento o seed cria `admin@portal.test`
  com a senha padrão da `UserFactory`. Esse usuário nunca é criado em produção.

## Papéis

| Papel | Acesso |
|---|---|
| `administrador` | Todo o conteúdo e os usuários |
| `editor` | Alimenta o conteúdo (escopo por centro/setor a definir com os recursos do painel) |

Usuários sem papel não entram no painel. O portal público não tem login.

## Qualidade

```bash
php artisan test
```

```bash
vendor/bin/pint
```

O CI do repositório roda Pint, `composer audit` e os testes a cada pull request.
