{{-- resources/views/documents/index.blade.php --}}
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>EduPortal — Documentos</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
</head>
<body class="bg-light">

    @include('partials._nav')

    <div class="container py-5">

        <div class="d-flex align-items-start justify-content-between flex-wrap gap-2 mb-4">
            <div>
                <h2 class="mb-0 fw-bold">Documentos</h2>
                <p class="text-muted mb-0 small">Arquivos disponíveis para download</p>
            </div>

            {{-- Botão de upload — visível apenas para quem tem permissão documents.manage --}}
            @can('documents.manage')
            <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#uploadModal">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                     class="bi bi-upload me-1" viewBox="0 0 16 16">
                    <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0
                             1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5
                             0 0 1 .5-.5z"/>
                    <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5
                             2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1
                             1-.708-.708l3-3z"/>
                </svg>
                Enviar Documento
            </button>
            @endcan
        </div>

        <div id="alertContainer"></div>

        {{-- Filtro --}}
        <div class="row g-2 mb-3">
            <div class="col-md-5">
                <input type="text" id="filterInput" class="form-control form-control-sm"
                       placeholder="Filtrar por nome ou tipo…" aria-label="Filtrar documentos">
            </div>
        </div>

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
                            <th scope="col">Nome do Arquivo</th>
                            <th scope="col">Tipo</th>
                            <th scope="col">Tamanho</th>
                            <th scope="col">Enviado em</th>
                            <th scope="col" class="text-end">Ações</th>
                        </tr>
                    </thead>
                    <tbody id="docsBody"></tbody>
                </table>
            </div>
        </div>

        {{-- Paginação --}}
        <nav id="paginationNav" class="mt-4 d-none" aria-label="Paginação de documentos">
            <ul class="pagination justify-content-center" id="paginationList"></ul>
        </nav>

        <div id="noResults" class="text-center py-5 d-none">
            <span class="fs-1">📄</span>
            <p class="text-muted mt-2">Nenhum documento encontrado.</p>
        </div>

    </div>

    {{-- Modal de Upload — renderizado condicionalmente pelo Blade --}}
    @can('documents.manage')
    <div class="modal fade" id="uploadModal" tabindex="-1"
         aria-labelledby="uploadModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="uploadModalLabel">Enviar Documento</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"
                            aria-label="Fechar"></button>
                </div>
                <div class="modal-body">
                    <div id="uploadAlertContainer"></div>

                    <div class="mb-3">
                        <label for="docTitle" class="form-label">Título <span class="text-danger">*</span></label>
                        <input type="text" class="form-control" id="docTitle"
                               placeholder="Título do documento" required>
                    </div>

                    <div class="mb-3">
                        <label for="docType" class="form-label">Tipo de Documento <span class="text-danger">*</span></label>
                        <select class="form-select" id="docType" required>
                            <option value="" disabled selected>Selecione…</option>
                            <option value="edital">Edital</option>
                            <option value="apostila">Apostila</option>
                            <option value="prova">Prova</option>
                            <option value="regulamento">Regulamento</option>
                            <option value="outro">Outro</option>
                        </select>
                    </div>

                    <div class="mb-3">
                        <label for="docFile" class="form-label">Arquivo <span class="text-danger">*</span></label>
                        <input type="file" class="form-control" id="docFile"
                               accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.png,.jpg" required>
                        <div class="form-text">PDF, Office, imagens. Máx. 10 MB.</div>
                    </div>

                    {{-- Progresso --}}
                    <div id="uploadProgress" class="d-none">
                        <div class="progress" role="progressbar" aria-label="Upload em progresso"
                             aria-valuenow="100" aria-valuemin="0" aria-valuemax="100">
                            <div class="progress-bar progress-bar-striped progress-bar-animated w-100"></div>
                        </div>
                        <p class="text-muted small mt-1 text-center">Enviando…</p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-primary" id="btnUpload">
                        Enviar
                    </button>
                </div>
            </div>
        </div>
    </div>
    @endcan

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="/js/api-client.js"></script>
    <script>
    (function () {
        const { apiRequest, showAlert, escapeHtml, formatBytes } = ApiClient;

        let allDocs    = [];
        let currentPage = 1;
        const perPage  = 12;

        // ── Carregar lista ──────────────────────────────────────────────
        async function loadDocuments() {
            document.getElementById('loadingSpinner').classList.remove('d-none');
            document.getElementById('tableWrapper').classList.add('d-none');
            try {
                const data = await apiRequest('GET', '/api/documents');
                allDocs = Array.isArray(data) ? data : (data.data ?? []);
                render();
            } catch (err) {
                showAlert('alertContainer', err.message || 'Erro ao carregar documentos.', 'danger');
            } finally {
                document.getElementById('loadingSpinner').classList.add('d-none');
            }
        }

        // ── Filtro + Paginação ──────────────────────────────────────────
        function filtered() {
            const q = (document.getElementById('filterInput')?.value ?? '').toLowerCase().trim();
            if (!q) return allDocs;
            return allDocs.filter(d =>
                (d.original_name ?? d.title ?? '').toLowerCase().includes(q) ||
                (d.document_type ?? d.type ?? '').toLowerCase().includes(q)
            );
        }

        function render() {
            const items      = filtered();
            const totalPages = Math.ceil(items.length / perPage) || 1;
            if (currentPage > totalPages) currentPage = 1;
            const slice = items.slice((currentPage - 1) * perPage, currentPage * perPage);

            const wrapper = document.getElementById('tableWrapper');
            const noRes   = document.getElementById('noResults');
            const pagNav  = document.getElementById('paginationNav');
            const pagList = document.getElementById('paginationList');
            const tbody   = document.getElementById('docsBody');

            wrapper.classList.toggle('d-none', slice.length === 0);
            noRes.classList.toggle('d-none', slice.length > 0);

            tbody.innerHTML = slice.map(d => {
                const name  = d.original_name ?? d.title ?? 'arquivo';
                const type  = d.document_type ?? d.type ?? '—';
                const size  = d.size != null ? formatBytes(d.size) : '—';
                const date  = d.created_at
                    ? new Date(d.created_at).toLocaleDateString('pt-BR') : '—';
                return `
                <tr>
                    <td>
                        <span class="me-1">${fileEmoji(name)}</span>
                        <span class="fw-semibold">${escapeHtml(name)}</span>
                    </td>
                    <td><span class="badge bg-light text-dark border">${escapeHtml(type)}</span></td>
                    <td class="text-muted small">${escapeHtml(size)}</td>
                    <td class="text-muted small">${escapeHtml(date)}</td>
                    <td class="text-end">
                        <a href="/api/documents/${d.id}/download"
                           class="btn btn-sm btn-outline-primary" target="_blank"
                           aria-label="Download de ${escapeHtml(name)}">
                            ⬇ Download
                        </a>
                    </td>
                </tr>`;
            }).join('');

            // Paginação
            if (totalPages <= 1) { pagNav.classList.add('d-none'); return; }
            pagNav.classList.remove('d-none');
            pagList.innerHTML = Array.from({ length: totalPages }, (_, i) => i + 1)
                .map(p => `<li class="page-item ${p === currentPage ? 'active' : ''}">
                    <button class="page-link" data-page="${p}">${p}</button></li>`).join('');
            pagList.querySelectorAll('[data-page]').forEach(btn =>
                btn.addEventListener('click', () => {
                    currentPage = parseInt(btn.dataset.page); render();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }));
        }

        function fileEmoji(name) {
            const ext = (name.split('.').pop() || '').toLowerCase();
            if (['pdf'].includes(ext))                return '📕';
            if (['doc','docx'].includes(ext))         return '📝';
            if (['xls','xlsx'].includes(ext))         return '📊';
            if (['png','jpg','jpeg','gif'].includes(ext)) return '🖼️';
            return '📄';
        }

        // ── Upload ──────────────────────────────────────────────────────
        const btnUpload = document.getElementById('btnUpload');
        if (btnUpload) {
            btnUpload.addEventListener('click', async () => {
                const title    = document.getElementById('docTitle')?.value.trim();
                const type     = document.getElementById('docType')?.value;
                const fileEl   = document.getElementById('docFile');
                const file     = fileEl?.files[0];
                const progress = document.getElementById('uploadProgress');

                document.getElementById('uploadAlertContainer').innerHTML = '';

                if (!title || !type || !file) {
                    showAlert('uploadAlertContainer', 'Preencha todos os campos obrigatórios.', 'warning');
                    return;
                }

                const fd = new FormData();
                fd.append('title', title);
                fd.append('document_type', type);
                fd.append('file', file);

                btnUpload.disabled = true;
                progress?.classList.remove('d-none');

                try {
                    await apiRequest('POST', '/api/documents', { formData: fd });
                    showAlert('alertContainer', '✅ Documento enviado com sucesso!', 'success');

                    // Fechar modal e resetar form
                    bootstrap.Modal.getInstance(document.getElementById('uploadModal'))?.hide();
                    document.getElementById('docTitle').value = '';
                    document.getElementById('docType').value  = '';
                    fileEl.value = '';

                    // Atualizar lista
                    currentPage = 1;
                    await loadDocuments();
                } catch (err) {
                    const msg = err.status === 403
                        ? 'Você não tem permissão para enviar documentos.'
                        : (err.message || 'Erro ao enviar documento.');
                    showAlert('uploadAlertContainer', msg, 'danger');
                } finally {
                    btnUpload.disabled = false;
                    progress?.classList.add('d-none');
                }
            });
        }

        document.getElementById('filterInput')?.addEventListener('input', () => {
            currentPage = 1; render();
        });

        loadDocuments();
    })();
    </script>
</body>
</html>
