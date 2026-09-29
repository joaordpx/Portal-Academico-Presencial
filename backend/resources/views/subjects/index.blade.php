{{-- resources/views/subjects/index.blade.php --}}
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>EduPortal — Disciplinas</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
</head>
<body class="bg-light">

    @include('partials._nav')

    <div class="container py-5">

        <div class="d-flex align-items-center justify-content-between mb-4">
            <div>
                <h2 class="mb-0 fw-bold">Disciplinas</h2>
                <p class="text-muted mb-0 small">Todas as disciplinas disponíveis na plataforma</p>
            </div>
            <div class="input-group" style="max-width:260px">
                <input type="text" id="filterInput" class="form-control form-control-sm"
                       placeholder="Filtrar…" aria-label="Filtrar disciplinas">
            </div>
        </div>

        <div id="alertContainer"></div>

        {{-- Spinner --}}
        <div id="loadingSpinner" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Carregando…</span>
            </div>
        </div>

        {{-- Tabela --}}
        <div id="tableWrapper" class="card border-0 shadow-sm d-none">
            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                    <thead class="table-light">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Nome</th>
                            <th scope="col">Código</th>
                            <th scope="col">Carga Horária</th>
                            <th scope="col">Curso</th>
                        </tr>
                    </thead>
                    <tbody id="subjectsBody"></tbody>
                </table>
            </div>
        </div>

        {{-- Paginação --}}
        <nav id="paginationNav" class="mt-4 d-none" aria-label="Paginação de disciplinas">
            <ul class="pagination justify-content-center" id="paginationList"></ul>
        </nav>

        <div id="noResults" class="text-center py-5 d-none">
            <span class="fs-1">📚</span>
            <p class="text-muted mt-2">Nenhuma disciplina encontrada.</p>
        </div>

    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="/js/api-client.js"></script>
    <script>
    (function () {
        const { apiRequest, showAlert, escapeHtml } = ApiClient;

        const tbody   = document.getElementById('subjectsBody');
        const spinner = document.getElementById('loadingSpinner');
        const wrapper = document.getElementById('tableWrapper');
        const noRes   = document.getElementById('noResults');
        const pagNav  = document.getElementById('paginationNav');
        const pagList = document.getElementById('paginationList');
        const filter  = document.getElementById('filterInput');

        let allSubjects = [];
        let currentPage = 1;
        const perPage   = 15;

        async function loadSubjects() {
            try {
                const data   = await apiRequest('GET', '/api/subjects');
                allSubjects  = Array.isArray(data) ? data : (data.data ?? []);
                render();
            } catch (err) {
                showAlert('alertContainer', err.message || 'Erro ao carregar disciplinas.', 'danger');
            } finally {
                spinner.classList.add('d-none');
            }
        }

        function filtered() {
            const q = filter.value.toLowerCase().trim();
            if (!q) return allSubjects;
            return allSubjects.filter(s =>
                (s.name ?? '').toLowerCase().includes(q) ||
                (s.code ?? '').toLowerCase().includes(q)
            );
        }

        function render() {
            const items      = filtered();
            const totalPages = Math.ceil(items.length / perPage) || 1;
            if (currentPage > totalPages) currentPage = 1;
            const slice = items.slice((currentPage - 1) * perPage, currentPage * perPage);

            wrapper.classList.toggle('d-none', slice.length === 0);
            noRes.classList.toggle('d-none', slice.length > 0);

            tbody.innerHTML = slice.map((s, i) => `
                <tr>
                    <td class="text-muted small">${(currentPage - 1) * perPage + i + 1}</td>
                    <td class="fw-semibold">${escapeHtml(s.name ?? '—')}</td>
                    <td><code>${escapeHtml(s.code ?? '—')}</code></td>
                    <td>${s.workload ? escapeHtml(String(s.workload)) + 'h' : '—'}</td>
                    <td>${s.course ? escapeHtml(s.course.name ?? s.course_name ?? '—') : '—'}</td>
                </tr>`).join('');

            // Paginação
            if (totalPages <= 1) { pagNav.classList.add('d-none'); return; }
            pagNav.classList.remove('d-none');
            pagList.innerHTML = Array.from({ length: totalPages }, (_, i) => i + 1)
                .map(p => `<li class="page-item ${p === currentPage ? 'active' : ''}">
                    <button class="page-link" data-page="${p}">${p}</button></li>`).join('');
            pagList.querySelectorAll('[data-page]').forEach(btn =>
                btn.addEventListener('click', () => { currentPage = parseInt(btn.dataset.page); render(); }));
        }

        filter.addEventListener('input', () => { currentPage = 1; render(); });
        loadSubjects();
    })();
    </script>
</body>
</html>
