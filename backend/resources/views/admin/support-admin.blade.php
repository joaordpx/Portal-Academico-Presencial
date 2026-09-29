{{-- resources/views/admin/support-admin.blade.php --}}
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>EduPortal — Painel de Suporte</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
</head>
<body class="bg-light">

    @include('partials._nav')

    <div class="container py-5" style="max-width: 900px">

        <nav aria-label="breadcrumb" class="mb-4">
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="{{ route('home') }}">Início</a></li>
                <li class="breadcrumb-item active" aria-current="page">Painel de Suporte</li>
            </ol>
        </nav>

        <div class="d-flex align-items-center gap-3 mb-5">
            <span class="fs-1">🎧</span>
            <div>
                <h2 class="mb-0 fw-bold">Painel de Suporte</h2>
                <p class="text-muted mb-0">Central de atendimento e gerenciamento de solicitações</p>
            </div>
        </div>

        @role('suporte|admin')

        <div class="alert alert-warning d-flex align-items-center gap-2" role="alert">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                 class="bi bi-exclamation-triangle-fill flex-shrink-0" viewBox="0 0 16 16">
                <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889
                         0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1
                         0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
            </svg>
            <div>
                Módulo em desenvolvimento. Os itens abaixo são placeholders funcionais.
            </div>
        </div>

        {{-- Quick actions --}}
        <div class="row g-4 mb-4">
            <div class="col-md-6">
                <div class="card border-0 shadow-sm h-100">
                    <div class="card-body p-4">
                        <div class="d-flex align-items-center gap-3 mb-3">
                            <span class="badge bg-danger-subtle text-danger p-2 fs-5">🆘</span>
                            <h5 class="card-title mb-0 fw-semibold">Chamados Abertos</h5>
                        </div>
                        <p class="card-text text-muted small">
                            Visualize e responda chamados de suporte enviados por alunos e professores.
                        </p>
                        <button class="btn btn-outline-secondary btn-sm" disabled title="Em breve">
                            Em breve
                        </button>
                    </div>
                </div>
            </div>

            <div class="col-md-6">
                <div class="card border-0 shadow-sm h-100">
                    <div class="card-body p-4">
                        <div class="d-flex align-items-center gap-3 mb-3">
                            <span class="badge bg-primary-subtle text-primary p-2 fs-5">👥</span>
                            <h5 class="card-title mb-0 fw-semibold">Usuários</h5>
                        </div>
                        <p class="card-text text-muted small">
                            Consulte usuários cadastrados, redefina senhas e ajuste permissões básicas.
                        </p>
                        <a href="{{ route('admin.users') }}" class="btn btn-outline-primary btn-sm">
                            Gerenciar usuários
                        </a>
                    </div>
                </div>
            </div>

            <div class="col-md-6">
                <div class="card border-0 shadow-sm h-100">
                    <div class="card-body p-4">
                        <div class="d-flex align-items-center gap-3 mb-3">
                            <span class="badge bg-success-subtle text-success p-2 fs-5">📊</span>
                            <h5 class="card-title mb-0 fw-semibold">Relatórios</h5>
                        </div>
                        <p class="card-text text-muted small">
                            Acesse logs de atividade e relatórios de uso da plataforma.
                        </p>
                        <button class="btn btn-outline-secondary btn-sm" disabled title="Em breve">
                            Em breve
                        </button>
                    </div>
                </div>
            </div>

            <div class="col-md-6">
                <div class="card border-0 shadow-sm h-100">
                    <div class="card-body p-4">
                        <div class="d-flex align-items-center gap-3 mb-3">
                            <span class="badge bg-info-subtle text-info p-2 fs-5">📄</span>
                            <h5 class="card-title mb-0 fw-semibold">Documentos</h5>
                        </div>
                        <p class="card-text text-muted small">
                            Gerencie documentos enviados, aprove ou remova arquivos inadequados.
                        </p>
                        <a href="{{ route('documents.index') }}" class="btn btn-outline-info btn-sm">
                            Ir para Documentos →
                        </a>
                    </div>
                </div>
            </div>
        </div>

        {{-- Log de atividade placeholder --}}
        <div class="card border-0 shadow-sm">
            <div class="card-header bg-transparent d-flex align-items-center justify-content-between">
                <span class="fw-semibold">Log de Atividade Recente</span>
                <span class="badge bg-secondary">placeholder</span>
            </div>
            <div class="card-body p-0">
                <ul class="list-group list-group-flush" id="activityLog">
                    <li class="list-group-item text-muted small text-center py-3">
                        <div class="spinner-border spinner-border-sm me-2" role="status">
                            <span class="visually-hidden">Carregando…</span>
                        </div>
                        Carregando atividade…
                    </li>
                </ul>
            </div>
        </div>

        @else
        <div class="text-center py-5">
            <span class="fs-1">🔒</span>
            <h4 class="mt-3">Acesso Restrito</h4>
            <p class="text-muted">Esta área é exclusiva para a equipe de suporte.</p>
            <a href="{{ route('home') }}" class="btn btn-primary">Voltar ao Início</a>
        </div>
        @endrole

    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="/js/api-client.js"></script>
    <script>
    // Simula atividade recente com dados dos endpoints disponíveis
    (async function () {
        const { apiRequest, escapeHtml } = ApiClient;
        const log = document.getElementById('activityLog');
        if (!log) return;

        try {
            const docs = await apiRequest('GET', '/api/documents');
            const items = Array.isArray(docs) ? docs : (docs.data ?? []);
            if (!items.length) {
                log.innerHTML = '<li class="list-group-item text-muted small text-center py-3">Nenhuma atividade registrada.</li>';
                return;
            }
            log.innerHTML = items.slice(0, 8).map(d => {
                const name = d.original_name ?? d.title ?? 'documento';
                const date = d.created_at
                    ? new Date(d.created_at).toLocaleString('pt-BR') : '—';
                return `<li class="list-group-item d-flex align-items-center gap-2 small">
                    <span class="text-success">📤</span>
                    <span>Documento <strong>${escapeHtml(name)}</strong> enviado</span>
                    <span class="ms-auto text-muted">${escapeHtml(date)}</span>
                </li>`;
            }).join('');
        } catch (_) {
            log.innerHTML = '<li class="list-group-item text-muted small text-center py-3">Não foi possível carregar o log.</li>';
        }
    })();
    </script>
</body>
</html>
