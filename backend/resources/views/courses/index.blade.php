{{-- resources/views/courses/index.blade.php --}}
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>EduPortal — Cursos</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
    <style>
        .course-card { transition: transform .15s, box-shadow .15s; }
        .course-card:hover { transform: translateY(-3px); box-shadow: 0 6px 20px rgba(0,0,0,.1); }
    </style>
</head>
<body class="bg-light">

    @include('partials._nav')

    <div class="container py-5">

        {{-- Cabeçalho --}}
        <div class="d-flex align-items-center justify-content-between mb-4">
            <div>
                <h2 class="mb-0 fw-bold">Cursos</h2>
                <p class="text-muted mb-0 small">Todos os cursos disponíveis na plataforma</p>
            </div>
            <div class="input-group" style="max-width:260px">
                <input type="text" id="filterInput" class="form-control form-control-sm"
                       placeholder="Filtrar por nome…" aria-label="Filtrar cursos">
            </div>
        </div>

        <div id="alertContainer"></div>

        {{-- Spinner --}}
        <div id="loadingSpinner" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Carregando cursos…</span>
            </div>
            <p class="text-muted mt-2 small">Carregando cursos…</p>
        </div>

        {{-- Grade de cursos --}}
        <div id="coursesGrid" class="row g-4 d-none"></div>

        {{-- Paginação --}}
        <nav id="paginationNav" class="mt-4 d-none" aria-label="Paginação de cursos">
            <ul class="pagination justify-content-center" id="paginationList"></ul>
        </nav>

        {{-- Nenhum resultado --}}
        <div id="noResults" class="text-center py-5 d-none">
            <span class="fs-1">🎓</span>
            <p class="text-muted mt-2">Nenhum curso encontrado.</p>
        </div>

    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="/js/api-client.js"></script>
    <script>
    (function () {
        const { apiRequest, showAlert, escapeHtml } = ApiClient;

        const grid     = document.getElementById('coursesGrid');
        const spinner  = document.getElementById('loadingSpinner');
        const noRes    = document.getElementById('noResults');
        const pagNav   = document.getElementById('paginationNav');
        const pagList  = document.getElementById('paginationList');
        const filter   = document.getElementById('filterInput');

        let allCourses = [];
        let currentPage = 1;
        const perPage  = 9;

        async function loadCourses() {
            try {
                const data = await apiRequest('GET', '/api/courses');
                // Suporta array puro ou objeto paginado do Laravel
                allCourses = Array.isArray(data) ? data : (data.data ?? []);
                render();
            } catch (err) {
                showAlert('alertContainer', err.message || 'Erro ao carregar cursos.', 'danger');
            } finally {
                spinner.classList.add('d-none');
            }
        }

        function filtered() {
            const q = filter.value.toLowerCase().trim();
            if (!q) return allCourses;
            return allCourses.filter(c =>
                (c.name ?? c.title ?? '').toLowerCase().includes(q) ||
                (c.description ?? '').toLowerCase().includes(q)
            );
        }

        function render() {
            const items = filtered();
            const total = items.length;
            const totalPages = Math.ceil(total / perPage) || 1;
            if (currentPage > totalPages) currentPage = 1;

            const slice = items.slice((currentPage - 1) * perPage, currentPage * perPage);

            grid.classList.toggle('d-none', slice.length === 0);
            noRes.classList.toggle('d-none', slice.length > 0);

            grid.innerHTML = slice.map(c => `
                <div class="col-sm-6 col-lg-4">
                    <div class="card course-card h-100 border-0 shadow-sm">
                        <div class="card-body">
                            <div class="d-flex align-items-start justify-content-between mb-2">
                                <span class="fs-2">🎓</span>
                                ${c.active || c.status === 'active'
                                    ? '<span class="badge bg-success-subtle text-success">Ativo</span>'
                                    : '<span class="badge bg-secondary-subtle text-secondary">Inativo</span>'}
                            </div>
                            <h5 class="card-title fw-semibold mb-1">
                                ${escapeHtml(c.name ?? c.title ?? 'Sem nome')}
                            </h5>
                            <p class="card-text text-muted small">
                                ${escapeHtml((c.description ?? '').slice(0, 120))}
                                ${(c.description ?? '').length > 120 ? '…' : ''}
                            </p>
                        </div>
                        <div class="card-footer bg-transparent border-0 pb-3">
                            <a href="/courses/${c.id}" class="btn btn-sm btn-primary w-100">
                                Ver detalhes
                            </a>
                        </div>
                    </div>
                </div>`).join('');

            // Paginação
            if (totalPages <= 1) {
                pagNav.classList.add('d-none');
                return;
            }
            pagNav.classList.remove('d-none');
            pagList.innerHTML = Array.from({ length: totalPages }, (_, i) => i + 1)
                .map(p => `
                    <li class="page-item ${p === currentPage ? 'active' : ''}">
                        <button class="page-link" data-page="${p}">${p}</button>
                    </li>`).join('');

            pagList.querySelectorAll('[data-page]').forEach(btn => {
                btn.addEventListener('click', () => {
                    currentPage = parseInt(btn.dataset.page);
                    render();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                });
            });
        }

        filter.addEventListener('input', () => { currentPage = 1; render(); });

        loadCourses();
    })();
    </script>
</body>
</html>
