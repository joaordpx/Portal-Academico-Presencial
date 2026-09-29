# Contratos da API - Portal Acadêmico Backend

Este documento descreve detalhadamente todos os endpoints da API, incluindo exemplos de resposta para facilitar a integração com o frontend.

**Base URL:** `http://localhost:8000/api`  
**Headers Comuns:**
- `Accept: application/json`
- `Content-Type: application/json`
- `Authorization: Bearer {token}`

---

## 1. Busca Inteligente (Fuzzy & Multi-Search)

### 1.1 Busca Unificada
`GET /search?q={termo}&entity_type={tipo}`

**Resposta (Exemplo):**
```json
{
    "data": [
        {
            "id": 1,
            "entity_type": "course",
            "title": "Engenharia de Sistemas",
            "description": "O curso de Engenharia de <mark>Sistemas</mark> foca em...",
            "score": 0.95,
            "highlights": { "name": "Engenharia de <mark>Sistemas</mark>" },
            "data": {
                "id": 1,
                "name": "Engenharia de Sistemas",
                "area": "Ciências Exatas",
                "shift": "Diurno",
                "type": "graduacao"
            }
        }
    ],
    "meta": {
        "total": 1,
        "per_page": 10,
        "current_page": 1,
        "last_page": 1
    }
}
```

### 1.2 Autocomplete
`GET /search/suggest?q={termo}`

**Resposta:**
```json
{
    "data": [
        { "text": "Sistemas de Informação", "type": "course" },
        { "text": "PPC Sistemas 2024", "type": "document" }
    ]
}
```

---

## 2. Núcleo Acadêmico

### 2.1 Cursos (`/courses`)
- `GET /courses`: Lista simplificada.
- `GET /courses/{id}`: Detalhes completos + Disciplinas.

**Resposta de Detalhe:**
```json
{
    "data": {
        "id": 5,
        "name": "Medicina",
        "area": "Saúde",
        "shift": "Integral",
        "min_duration": 12,
        "type": "graduacao",
        "market_description": "Carreira focada em cuidado humano...",
        "coordinator_email": "coord.med@unimontes.br",
        "subjects": [
            { "id": 10, "course_id": 5, "period": 1, "name": "Anatomia I" }
        ]
    }
}
```

### 2.2 Disciplinas (`/subjects`)
- `GET /subjects?q={termo}`: Listagem e filtro.

**Resposta:**
```json
{
    "data": [
        { "id": 1, "course_id": 2, "period": 2, "name": "Cálculo II" }
    ]
}
```

### 2.3 Centros e Departamentos
- `GET /centers`: Lista centros acadêmicos (CCET, CCHS, etc).
- `GET /departments`: Lista departamentos vinculados.

---

## 3. Gestão de Documentos (`/documents`)

### 3.1 Listagem
`GET /documents?context_type=course&context_id=1`

**Resposta:**
```json
{
    "data": [
        {
            "id": 8,
            "title": "Edital de Monitoria",
            "description": "Edital para o semestre 2026/1",
            "document_type": "edital",
            "extension": "pdf",
            "mime_type": "application/pdf",
            "size_bytes": 1024000,
            "download_url": "http://localhost:8000/api/documents/8/download",
            "created_at": "2026-05-24T14:00:00Z"
        }
    ]
}
```

---

## 4. Gestão de Usuários e Vínculos

### 4.1 Usuário (`/users`)
**Resposta de Detalhe:**
```json
{
    "data": {
        "id": 3,
        "name": "João Silva",
        "cpf": "123.***.***-00",
        "matricula": "0012345",
        "email": "joao@unimontes.br",
        "role": "admin",
        "roles": ["admin"]
    }
}
```

### 4.2 Vínculos de Administração (`/admins/{user}/courses`)
Permite saber quais cursos um admin tem permissão para gerenciar.

**Resposta:**
```json
{
    "data": [
        { "id": 1, "name": "Sistemas de Informação", "type": "graduacao" }
    ]
}
```

---

## 5. Eventos Institucionais (SigEx)

### 5.1 Listagem (`/events`)
**Resposta:**
```json
{
    "data": [
        {
            "id": 101,
            "nome": "Semana da Computação",
            "descricao": "Evento técnico...",
            "data_inicio": "2026-06-01",
            "esgotado": false,
            "campus": "Montes Claros",
            "tipo": "Congresso"
        }
    ]
}
```

---

## 6. Monitoramento e Auditoria

### 6.1 Health Check (`GET /health`)
**Resposta (Sucesso):**
```json
{
    "status": "ok",
    "timestamp": "2026-05-24T16:55:00.000000Z",
    "services": {
        "database": { "status": "up" },
        "redis": { "status": "up" },
        "meilisearch": { "status": "up" },
        "storage": { "status": "up" }
    }
}
```

### 6.2 Audit Logs (Privado)
Eventos registrados: `created`, `updated`, `deleted`, `accessed` (visualização), `downloaded`.
*Dados Pessoais Identificáveis (PII) são filtrados dos logs automaticamente.*
