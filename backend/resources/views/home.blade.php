{{-- resources/views/home.blade.php --}}
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>EduPortal — Início</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
    <style>
        .hero {
            background: linear-gradient(135deg, #0d6efd 0%, #0a4bbd 100%);
            color: #fff;
            padding: 80px 0 60px;
        }
        .hero .search-box {
            max-width: 640px;
            margin: 0 auto;
        }
        .result-card { transition: box-shadow .2s; }
        .result-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,.12); }
    </style>
</head>
<body class="bg-light">

    @include('partials._nav')

    {{-- Hero search --}}
    <section class="hero">
        <div class="container text-center">
            <h1 class="display-5 fw-bold mb-2">O que você quer aprender?</h1>
            <p class="lead mb-4 opacity-75">Pesquise cursos, disciplinas e documentos em um só lugar.</p>

            <div class="search-box">
                <div class="input-group input-group-lg shadow">
                    <input type="text" id="searchInput" class="form-control border-0"
                           placeholder="Ex: Cálculo, Programação, Edital..."
                           aria-label="Buscar">
                    <button class="btn btn-warning fw-semibold" id="btnSearch" type="button">
                        Buscar
                    </button>
                </div>
            </div>
        </div>
    </section>

    {{-- Resultados --}}
    <div class="container py-5">

        <div id="alertContainer"></div>

        {{-- Spinner --}}
        <div id="loadingSpinner" class="text-center d-none py-4">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Carregando…</span>
            </div>
        </div>

        {{-- Resultados --}}
        <div id="searchResultsSection" class="d-none">
            <h5 id="searchResultsTitle" class="mb-3 text-muted fw-normal"></h5>
            <div id="searchResults" class="row g-3"></div>
        </div>

        {{-- Estado vazio inicial --}}
        <div id="emptyState" class="text-center py-5 text-muted">
            <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56"
                 fill="currentColor" class="bi bi-search mb-3 opacity-25" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85
                         3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.099zm-5.242
                         1.656a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11z"/>
            </svg>
            <p class="fs-5">Pesquise acima para encontrar conteúdo.</p>
        </div>

        {{-- Atalhos rápidos --}}
        <div id="quickLinks" class="row g-3 mt-2">
            <div class="col-md-4">
                <a href="{{ route('courses.index') }}"
                   class="card text-decoration-none text-dark result-card h-100">
                    <div class="card-body d-flex align-items-center gap-3">
                        <span class="fs-2">🎓</span>
                        <div>
                            <div class="fw-semibold">Cursos</div>
                            <div class="text-muted small">Veja todos os cursos disponíveis</div>
                        </div>
                    </div>
                </a>
            </div>
            <div class="col-md-4">
                <a href="{{ route('subjects.index') }}"
                   class="card text-decoration-none text-dark result-card h-100">
                    <div class="card-body d-flex align-items-center gap-3">
                        <span class="fs-2">📚</span>
                        <div>
                            <div class="fw-semibold">Disciplinas</div>
                            <div class="text-muted small">Explore as disciplinas do portal</div>
                        </div>
                    </div>
                </a>
            </div>
            <div class="col-md-4">
                <a href="{{ route('documents.index') }}"
                   class="card text-decoration-none text-dark result-card h-100">
                    <div class="card-body d-flex align-items-center gap-3">
                        <span class="fs-2">📄</span>
                        <div>
                            <div class="fw-semibold">Documentos</div>
                            <div class="text-muted small">Acesse e faça download de arquivos</div>
                        </div>
                    </div>
                </a>
            </div>
        </div>

    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="/js/api-client.js"></script>
    <script>
    (function () {
        const { apiRequest, showAlert, escapeHtml } = ApiClient;

        const input   = document.getElementById('searchInput');
        const btn     = document.getElementById('btnSearch');
        const spinner = document.getElementById('loadingSpinner');
        const section = document.getElementById('searchResultsSection');
        const title   = document.getElementById('searchResultsTitle');
        const results = document.getElementById('searchResults');
        const empty   = document.getElementById('emptyState');
        const quick   = document.getElementById('quickLinks');

        async function doSearch() {
            const q = input.value.trim();
            if (!q) { input.focus(); return; }

            spinner.classList.remove('d-none');
            section.classList.add('d-none');
            empty.classList.add('d-none');
            quick.classList.add('d-none');
            document.getElementById('alertContainer').innerHTML = '';

            try {
                const data = await apiRequest('GET', `/api/search?q=${encodeURIComponent(q)}`);
                renderResults(data, q);
            } catch (err) {
                showAlert('alertContainer', err.message || 'Erro ao buscar.', 'danger');
                empty.classList.remove('d-none');
            } finally {
                spinner.classList.add('d-none');
            }
        }

        function renderResults(data, q) {
            const items = Array.isArray(data) ? data : (data.data ?? data.results ?? []);

            section.classList.remove('d-none');
            title.textContent = items.length
                ? `${items.length} resultado(s) para "${q}"`
                : `Nenhum resultado para "${q}"`;

            results.innerHTML = items.length
                ? items.map(item => `
                    <div class="col-md-6 col-lg-4">
                        <div class="card result-card h-100">
                            <div class="card-body">
                                <span class="badge bg-secondary mb-1 text-uppercase" style="font-size:.7rem">
                                    ${escapeHtml(item.type ?? 'item')}
                                </span>
                                <h6 class="card-title mb-1">
                                    ${escapeHtml(item.title ?? item.name ?? item.original_name ?? '—')}
                                </h6>
                                <p class="card-text text-muted small mb-0">
                                    ${escapeHtml(item.description ?? item.summary ?? '')}
                                </p>
                            </div>
                            ${buildCardFooter(item)}
                        </div>
                    </div>`).join('')
                : `<div class="col"><p class="text-muted">Tente outros termos de busca.</p></div>`;
        }

        function buildCardFooter(item) {
            if (item.type === 'course' && item.id)
                return `<div class="card-footer bg-transparent border-0 pt-0">
                    <a href="/courses/${item.id}" class="btn btn-sm btn-outline-primary">Ver curso</a></div>`;
            if (item.type === 'document' && item.id)
                return `<div class="card-footer bg-transparent border-0 pt-0">
                    <a href="/api/documents/${item.id}/download" class="btn btn-sm btn-outline-secondary"
                       target="_blank">Download</a></div>`;
            return '';
        }

        btn.addEventListener('click', doSearch);
        input.addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(); });
    })();
    </script>
</body>
</html>
