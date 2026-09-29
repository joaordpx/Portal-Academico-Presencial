# EduPortal — Instruções de Integração

## 1. Estrutura de arquivos gerados

```
public/
  js/
    api-client.js                        ← helper JS (CSRF, fetch, erros)

resources/views/
  partials/
    _nav.blade.php                       ← navbar com role-aware links
  home.blade.php                         ← search hero
  courses/
    index.blade.php                      ← lista de cursos
    show.blade.php                       ← detalhe de curso
  subjects/
    index.blade.php                      ← lista de disciplinas
  documents/
    index.blade.php                      ← lista + upload de documentos
  admin/
    course-admin.blade.php               ← painel admin (placeholder)
    support-admin.blade.php              ← painel suporte (placeholder)

app/Http/Controllers/
  PageController.php                     ← controller mínimo (só retorna views)

routes/
  web_additions.php                      ← bloco a colar no routes/web.php
```

---

## 2. Passos de instalação

### 2.1 Copie os arquivos para o projeto

```bash
# A partir da raiz do projeto Laravel
cp -r public/js/api-client.js        public/js/api-client.js
cp -r resources/views/partials       resources/views/
cp    resources/views/home.blade.php resources/views/
cp -r resources/views/courses        resources/views/
cp -r resources/views/subjects       resources/views/
cp -r resources/views/documents      resources/views/
cp -r resources/views/admin          resources/views/
cp    app/Http/Controllers/PageController.php \
      app/Http/Controllers/PageController.php
```

### 2.2 Adicione as rotas ao web.php

Cole o conteúdo de `routes/web_additions.php` **no final** de `routes/web.php`
(remova os comentários do arquivo se preferir manter o web.php limpo).

### 2.3 Registre os middlewares Spatie (se ainda não registrados)

No `bootstrap/app.php` do Laravel 12:

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->alias([
        'role'              => \Spatie\Permission\Middleware\RoleMiddleware::class,
        'permission'        => \Spatie\Permission\Middleware\PermissionMiddleware::class,
        'role_or_permission'=> \Spatie\Permission\Middleware\RoleOrPermissionMiddleware::class,
    ]);
})
```

### 2.4 Seed + serve

```bash
php artisan migrate --seed
php artisan serve
```

---

## 3. URLs disponíveis após integração

| URL                  | View                           | Restrição              |
|----------------------|--------------------------------|------------------------|
| `/home`              | home.blade.php                 | auth                   |
| `/courses`           | courses/index.blade.php        | auth                   |
| `/courses/{id}`      | courses/show.blade.php         | auth                   |
| `/subjects`          | subjects/index.blade.php       | auth                   |
| `/documents`         | documents/index.blade.php      | auth                   |
| `/admin/courses`     | admin/course-admin.blade.php   | auth + role:admin      |
| `/admin/support`     | admin/support-admin.blade.php  | auth + role:admin\|suporte |

---

## 4. Testes manuais no browser

### Como admin (`admin@example.com` / `password`)

1. Acesse `http://localhost:8000/login` → faça login
2. Vá em `/home` → busque por qualquer termo → verifique cards de resultado
3. Vá em `/courses` → verifique lista, filtro e paginação
4. Clique em um curso → verifique detalhes e disciplinas
5. Vá em `/documents` → verifique o botão **Enviar Documento** aparece
6. Upload: clique em Enviar → preencha título, tipo, escolha um PDF → clique Enviar
7. Verifique que o novo documento aparece na lista com o nome original
8. Vá em `/admin/courses` e `/admin/support` → ambos acessíveis
9. Navbar deve mostrar o dropdown "Administração"

### Como aluno (`test@example.com` / `password`)

1. Login → vá em `/documents`
2. Verifique que o botão **Enviar Documento** **não** aparece
3. Tente acessar `/admin/courses` → espere redirect/403
4. Navbar **não** deve mostrar dropdown "Administração"

### Como suporte (`suporte@example.com` / `password`)

1. Vá em `/admin/support` → acessível
2. Tente `/admin/courses` → deve retornar 403 (apenas admin)
3. Navbar deve mostrar dropdown com "Painel de Suporte" mas não "Gestão de Cursos"

---

## 5. Exemplos curl

### Login (obtém cookie de sessão)

```bash
# 1. Pega o CSRF token da página de login
curl -c cookies.txt http://localhost:8000/login -s | \
  grep -oP '(?<=name="csrf-token" content=")[^"]+' > /tmp/csrf.txt

# 2. Faz login
curl -X POST http://localhost:8000/login \
  -c cookies.txt -b cookies.txt \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "email=admin@example.com&password=password&_token=$(cat /tmp/csrf.txt)"
```

### Listar documentos

```bash
curl http://localhost:8000/api/documents \
  -c cookies.txt -b cookies.txt \
  -H "Accept: application/json"
```

### Upload de documento (admin/suporte)

```bash
curl -X POST http://localhost:8000/api/documents \
  -c cookies.txt -b cookies.txt \
  -H "Accept: application/json" \
  -H "X-CSRF-TOKEN: $(cat /tmp/csrf.txt)" \
  -F "title=Edital 2025" \
  -F "document_type=edital" \
  -F "file=@/caminho/para/arquivo.pdf"
```

### Busca global

```bash
curl "http://localhost:8000/api/search?q=calculo" \
  -c cookies.txt -b cookies.txt \
  -H "Accept: application/json"
```

---

## 6. Checklist de aceitação

- [x] Navbar mostra links corretos por role (`@role`, `@can` no Blade)
- [x] `/courses` lista itens de `GET /api/courses` com filtro e paginação client-side
- [x] `/courses/{id}` busca `GET /api/courses/{id}` e exibe detalhes + disciplinas
- [x] `/documents` lista documentos e exibe botão de upload **somente** para `documents.manage`
- [x] Upload chama `POST /api/documents` como multipart com `credentials: 'same-origin'`
- [x] Após upload a lista é atualizada e o novo documento aparece com `original_name`
- [x] Todas as chamadas JS incluem `X-CSRF-TOKEN` e `credentials: 'same-origin'`
- [x] Erros da API são exibidos em alertas Bootstrap (sem crashes silenciosos)
- [x] Sem novas migrations ou mudanças em endpoints existentes

---

## 7. Notas importantes

- **CSRF**: o helper `api-client.js` lê automaticamente o meta tag
  `<meta name="csrf-token" content="{{ csrf_token() }}">` presente em todas as views.
- **Paginação**: implementada client-side (9 itens/página em cursos, 15 em disciplinas,
  12 em documentos). Se a API retornar paginação server-side, adapte a resposta em
  `allCourses = data.data ?? data`.
- **Roles no Blade**: usamos `@role('admin')` da Spatie. Se o seu projeto usa guards
  customizados, ajuste conforme a documentação do pacote.
- **Sem JS frameworks**: tudo em ES6 vanilla + Bootstrap 5 CDN.

## 8. Integração SigEx (Eventos externos)

- **Variáveis `.env`**: `SIGEX_BASE_URL`, `SIGEX_API_KEY`, `SIGEX_CACHE_MINUTES` (padrão 10)
- **Endpoints**:
  - `GET /api/events` — lista paginada de eventos no formato SigEx (campos como `nome`, `descricao`, `data_inicio`, `data_fim`, `vagas_disponiveis`, `esgotado`, `url_detalhes`)
  - `GET /api/events/{event}` — detalhes do evento
- **Comando de sincronização**: `php artisan events:sync-external`

### Exemplos curl

Listar eventos (API pública paginada):

```bash
curl http://localhost:8000/api/events -H "Accept: application/json"
```

Sincronizar manualmente (rodar dentro do app ou do container):

```bash
# Se estiver usando Docker Compose
docker compose exec app php artisan events:sync-external
```

