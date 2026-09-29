<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Portal Academico API Playground</title>
    <style>
        :root {
            --bg: #f4f1ec;
            --panel: #fffdfa;
            --ink: #1f1a17;
            --muted: #6f665f;
            --accent: #005f73;
            --accent-2: #0a9396;
            --danger: #9b2226;
            --border: #ded5cc;
            --code-bg: #1c1917;
            --code-ink: #fef7ed;
        }

        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
            color: var(--ink);
            background:
                radial-gradient(circle at 20% 10%, #e9d8a644 0, transparent 34%),
                radial-gradient(circle at 85% 20%, #94d2bd55 0, transparent 30%),
                var(--bg);
            min-height: 100vh;
        }

        .page {
            width: min(1200px, 100% - 2rem);
            margin: 1.5rem auto 2.5rem;
        }

        .hero {
            background: linear-gradient(120deg, #ee9b00 0%, #ca6702 40%, #bb3e03 100%);
            color: #fff;
            padding: 1.25rem 1.5rem;
            border-radius: 14px;
            box-shadow: 0 14px 30px #00000022;
            margin-bottom: 1rem;
        }

        .hero h1 {
            margin: 0;
            font-size: 1.4rem;
            letter-spacing: 0.3px;
        }

        .hero p {
            margin: 0.55rem 0 0;
            font-size: 0.95rem;
            opacity: 0.95;
        }

        .grid {
            display: grid;
            grid-template-columns: 1.1fr 1fr;
            gap: 0.9rem;
        }

        .card {
            background: var(--panel);
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 1rem;
        }

        .card h2 {
            margin: 0 0 0.7rem;
            font-size: 1rem;
        }

        .row {
            display: grid;
            gap: 0.55rem;
            grid-template-columns: 1fr 1fr;
        }

        .row-3 {
            display: grid;
            gap: 0.55rem;
            grid-template-columns: repeat(3, 1fr);
        }

        .field {
            display: flex;
            flex-direction: column;
            gap: 0.2rem;
        }

        label {
            font-size: 0.8rem;
            color: var(--muted);
            font-weight: 600;
        }

        input,
        select,
        textarea,
        button {
            border: 1px solid var(--border);
            border-radius: 8px;
            padding: 0.55rem 0.65rem;
            font-size: 0.92rem;
            background: #fff;
            color: var(--ink);
        }

        textarea {
            min-height: 120px;
            resize: vertical;
            font-family: Consolas, "Courier New", monospace;
        }

        button {
            cursor: pointer;
            background: var(--accent);
            color: #fff;
            border: none;
            font-weight: 700;
            transition: 0.15s ease;
        }

        button:hover {
            background: var(--accent-2);
        }

        button.alt {
            background: #8d99ae;
        }

        button.warn {
            background: var(--danger);
        }

        .chips {
            display: flex;
            flex-wrap: wrap;
            gap: 0.4rem;
            margin: 0.2rem 0 0.6rem;
        }

        .chip {
            font-size: 0.78rem;
            padding: 0.35rem 0.6rem;
            border-radius: 999px;
            border: 1px solid #c8bcb1;
            background: #1f7bf3;
            cursor: pointer;
        }

        .chip:hover {
            background: #f4ece4;
        }

        .status {
            font-size: 0.86rem;
            color: var(--muted);
            margin-bottom: 0.45rem;
            min-height: 1.2rem;
        }

        .file-preview {
            margin-top: 0.35rem;
            font-size: 0.82rem;
            color: var(--muted);
            word-break: break-word;
        }

        .response {
            margin-top: 0.5rem;
            border-radius: 10px;
            overflow: hidden;
            border: 1px solid #3f3f46;
        }

        .response-head {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.45rem 0.65rem;
            background: #312e2b;
            color: #f3f4f6;
            font-size: 0.82rem;
        }

        pre {
            margin: 0;
            padding: 0.8rem;
            background: var(--code-bg);
            color: var(--code-ink);
            max-height: 460px;
            overflow: auto;
            font-size: 0.8rem;
            line-height: 1.35;
            word-break: break-word;
            white-space: pre-wrap;
            overflow-wrap: break-word;
        }

        .span-2 {
            grid-column: 1 / -1;
        }

        @media (max-width: 960px) {
            .grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
<div class="page">
    <section class="hero">
        <h1>Portal Academico - API Playground</h1>
        <p>Interface de apoio para validar modulos REST do backend sem acoplar regra de negocio no frontend.</p>
    </section>

    <div class="grid">
        <section class="card">
            <h2>Conexao</h2>
            <div class="row">
                <div class="field">
                    <label for="baseUrl">Base URL</label>
                    <input id="baseUrl" value="{{ url('/api') }}" />
                </div>
                <div class="field">
                    <label for="bearerToken">Bearer Token (opcional)</label>
                    <input id="bearerToken" placeholder="eyJ..." />
                </div>
            </div>
            <div class="chips">
                <button class="chip" data-endpoint="/search?q=ac">GET /search</button>
                <button class="chip" data-endpoint="/courses">GET /courses</button>
                <button class="chip" data-endpoint="/subjects">GET /subjects</button>
                <button class="chip" data-endpoint="/centers">GET /centers</button>
                <button class="chip" data-endpoint="/departments">GET /departments</button>
                <button class="chip" data-endpoint="/documents">GET /documents</button>
            </div>

            <h2>Busca</h2>
            <div class="row-3">
                <div class="field">
                    <label for="searchQ">q</label>
                    <input id="searchQ" value="ac" />
                </div>
                <div class="field">
                    <label for="searchType">entity_type</label>
                    <select id="searchType">
                        <option value="all">all</option>
                        <option value="course">course</option>
                        <option value="subject">subject</option>
                        <option value="center">center</option>
                        <option value="department">department</option>
                        <option value="document">document</option>
                    </select>
                </div>
                <div class="field">
                    <label for="searchPerPage">per_page</label>
                    <input id="searchPerPage" value="10" />
                </div>
            </div>
            <div style="margin-top:0.55rem;">
                <button id="btnSearch">Executar Busca</button>
            </div>

            <h2 style="margin-top:1rem;">Requisicao customizada</h2>
            <div class="row-3">
                <div class="field">
                    <label for="requestMethod">Metodo</label>
                    <select id="requestMethod">
                        <option>GET</option>
                        <option>POST</option>
                        <option>PUT</option>
                        <option>PATCH</option>
                        <option>DELETE</option>
                    </select>
                </div>
                <div class="field span-2">
                    <label for="requestPath">Path</label>
                    <input id="requestPath" value="/courses" />
                </div>
            </div>
            <div class="field" style="margin-top:0.55rem;">
                <label for="requestBody">Body JSON (quando aplicavel)</label>
                <textarea id="requestBody">{
  "name": "Curso Teste",
  "type": "graduacao",
  "area": "Tecnologia",
  "shift": "Noite",
  "min_duration": 8,
  "market_description": "Curso para testes de API",
  "coordinator_email": "coordenacao@unimontes.br"
}</textarea>
            </div>
            <div style="margin-top:0.55rem; display:flex; gap:0.45rem;">
                <button id="btnSend">Enviar Requisicao</button>
                <button id="btnClear" class="alt" type="button">Limpar Resposta</button>
            </div>
        </section>

        <section class="card">
            <h2>Upload de Documento</h2>
            <div class="row">
                <div class="field">
                    <label for="docTitle">title</label>
                    <input id="docTitle" value="Documento de Teste" />
                </div>
                <div class="field">
                    <label for="docType">document_type</label>
                    <select id="docType">
                        <option value="notice">notice</option>
                        <option value="edital">edital</option>
                        <option value="ppc">ppc</option>
                        <option value="event">event</option>
                        <option value="general">general</option>
                    </select>
                </div>
                <div class="field">
                    <label for="docContextType">context_type</label>
                    <select id="docContextType">
                        <option value="">(vazio)</option>
                        <option value="course">course</option>
                        <option value="subject">subject</option>
                        <option value="center">center</option>
                        <option value="department">department</option>
                    </select>
                </div>
                <div class="field">
                    <label for="docContextId">context_id</label>
                    <input id="docContextId" placeholder="1" />
                </div>
            </div>
            <div class="field" style="margin-top:0.55rem;">
                <label for="docDescription">description</label>
                <input id="docDescription" value="Documento enviado pelo playground" />
            </div>
            <div class="field" style="margin-top:0.55rem;">
                <label for="docFile">file</label>
                <input id="docFile" type="file" />
                <div class="file-preview" id="docFilePreview">Nenhum arquivo selecionado.</div>
            </div>
            <div style="margin-top:0.55rem;">
                <button id="btnUpload">Enviar Documento</button>
            </div>

            <h2 style="margin-top:1rem;">Resposta</h2>
            <div class="status" id="status">Pronto.</div>
            <div class="response">
                <div class="response-head">
                    <span id="responseMeta">Sem requisicoes</span>
                    <span>JSON</span>
                </div>
                <pre id="responseOutput">{}</pre>
            </div>
        </section>
    </div>
</div>

<script>
    const baseUrlInput = document.getElementById('baseUrl');
    const tokenInput = document.getElementById('bearerToken');
    const statusEl = document.getElementById('status');
    const responseMetaEl = document.getElementById('responseMeta');
    const responseOutputEl = document.getElementById('responseOutput');
    const docFileInput = document.getElementById('docFile');
    const docFilePreview = document.getElementById('docFilePreview');

    function setStatus(message, isError = false) {
        statusEl.textContent = message;
        statusEl.style.color = isError ? '#9b2226' : '#6f665f';
    }

    function authHeaders(contentType = 'application/json') {
        const headers = {};
        if (contentType) {
            headers['Content-Type'] = contentType;
        }
        if (tokenInput.value.trim() !== '') {
            headers['Authorization'] = `Bearer ${tokenInput.value.trim()}`;
        }
        return headers;
    }

    function normalizeBaseUrl() {
        return baseUrlInput.value.trim().replace(/\/+$/, '');
    }

    function prettyJson(value) {
        try {
            return JSON.stringify(value, null, 2);
        } catch {
            return String(value);
        }
    }

    function renderFilePreview() {
        if (!docFileInput.files.length) {
            docFilePreview.textContent = 'Nenhum arquivo selecionado.';
            return;
        }

        const file = docFileInput.files[0];
        docFilePreview.textContent = `${file.name} · ${(file.size / 1024).toFixed(1)} KB · ${file.type || 'type desconhecido'}`;
    }

    function summarizeDocumentResponse(responseData) {
        if (responseData && typeof responseData === 'object') {
            const documentData = responseData.data ?? responseData;
            if (documentData && typeof documentData === 'object' && 'id' in documentData) {
                return `Documento criado: #${documentData.id} · ${documentData.title ?? 'sem título'} · ${documentData.original_name ?? 'sem nome original'} · ${documentData.path ?? 'sem path'}`;
            }
        }

        return null;
    }

    async function runRequest({ method, path, body = null, isForm = false, formData = null }) {
        const url = `${normalizeBaseUrl()}${path.startsWith('/') ? path : `/${path}`}`;
        const startedAt = performance.now();
        setStatus(`Executando ${method} ${path}...`);

        const options = { method };
        if (isForm) {
            options.body = formData;
            const headers = authHeaders(null);
            if (headers.Authorization) {
                options.headers = { Authorization: headers.Authorization };
            }
        } else {
            options.headers = authHeaders('application/json');
            if (body !== null) {
                options.body = JSON.stringify(body);
            }
        }

        try {
            const response = await fetch(url, options);
            const elapsed = (performance.now() - startedAt).toFixed(0);
            const text = await response.text();
            let parsed = text;
            try {
                parsed = JSON.parse(text);
            } catch {
                // keep raw text when response is not JSON.
            }

            responseMetaEl.textContent = `${response.status} ${response.statusText} - ${elapsed}ms`;
            responseOutputEl.textContent = prettyJson(parsed);
            const documentSummary = method === 'POST' && path === '/documents' ? summarizeDocumentResponse(parsed) : null;
            if (documentSummary) {
                setStatus(documentSummary, !response.ok);
            } else {
                setStatus(`Concluido: ${method} ${path} (${response.status})`, !response.ok);
            }
        } catch (error) {
            responseMetaEl.textContent = 'Erro de rede';
            responseOutputEl.textContent = prettyJson({ message: error.message });
            setStatus(`Falha de rede: ${error.message}`, true);
        }
    }

    document.querySelectorAll('.chip').forEach((button) => {
        button.addEventListener('click', () => {
            runRequest({ method: 'GET', path: button.dataset.endpoint });
        });
    });

    document.getElementById('btnSearch').addEventListener('click', () => {
        const q = encodeURIComponent(document.getElementById('searchQ').value.trim());
        const entityType = encodeURIComponent(document.getElementById('searchType').value);
        const perPage = encodeURIComponent(document.getElementById('searchPerPage').value.trim() || '10');
        runRequest({ method: 'GET', path: `/search?q=${q}&entity_type=${entityType}&per_page=${perPage}` });
    });

    document.getElementById('btnSend').addEventListener('click', () => {
        const method = document.getElementById('requestMethod').value;
        const path = document.getElementById('requestPath').value.trim();
        let body = null;

        if (!['GET', 'DELETE'].includes(method)) {
            const raw = document.getElementById('requestBody').value.trim();
            if (raw !== '') {
                try {
                    body = JSON.parse(raw);
                } catch {
                    setStatus('Body JSON invalido.', true);
                    return;
                }
            }
        }

        runRequest({ method, path, body });
    });

    document.getElementById('btnUpload').addEventListener('click', () => {
        if (!docFileInput.files.length) {
            setStatus('Selecione um arquivo para upload.', true);
            return;
        }

        const formData = new FormData();
        formData.append('title', document.getElementById('docTitle').value.trim());
        formData.append('description', document.getElementById('docDescription').value.trim());
        formData.append('document_type', document.getElementById('docType').value);

        const contextType = document.getElementById('docContextType').value;
        const contextId = document.getElementById('docContextId').value.trim();
        if (contextType !== '') {
            formData.append('context_type', contextType);
            if (contextId !== '') {
                formData.append('context_id', contextId);
            }
        }

        formData.append('file', docFileInput.files[0]);
        runRequest({ method: 'POST', path: '/documents', isForm: true, formData });
    });

    docFileInput.addEventListener('change', renderFilePreview);
    renderFilePreview();

    document.getElementById('btnClear').addEventListener('click', () => {
        responseMetaEl.textContent = 'Sem requisicoes';
        responseOutputEl.textContent = '{}';
        setStatus('Resposta limpa.');
    });
</script>
</body>
</html>
