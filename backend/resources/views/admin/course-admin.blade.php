{{-- resources/views/admin/course-admin.blade.php --}}
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>EduPortal — Gestão de Cursos</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
</head>
<body class="bg-light">

    @include('partials._nav')

    <div class="container py-5" style="max-width: 900px">

        {{-- Breadcrumb --}}
        <nav aria-label="breadcrumb" class="mb-4">
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="{{ route('home') }}">Início</a></li>
                <li class="breadcrumb-item active" aria-current="page">Gestão de Cursos</li>
            </ol>
        </nav>

        {{-- Header --}}
        <div class="d-flex align-items-center gap-3 mb-5">
            <span class="fs-1">🎓</span>
            <div>
                <h2 class="mb-0 fw-bold">Gestão de Cursos</h2>
                <p class="text-muted mb-0">Painel administrativo para gerenciamento de cursos</p>
            </div>
        </div>

        {{-- Role guard — rendered server-side --}}
        @role('admin')

        <div class="alert alert-info d-flex align-items-center gap-2" role="alert">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                 class="bi bi-info-circle-fill flex-shrink-0" viewBox="0 0 16 16">
                <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194
                         0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703
                         0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381
                         2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
            </svg>
            <div>
                Módulo em desenvolvimento. As funcionalidades abaixo são placeholders e serão implementadas
                em uma próxima versão.
            </div>
        </div>

        <div class="row g-4">
            {{-- Card: Listar cursos --}}
            <div class="col-md-6">
                <div class="card border-0 shadow-sm h-100">
                    <div class="card-body p-4">
                        <div class="d-flex align-items-center gap-3 mb-3">
                            <span class="badge bg-primary-subtle text-primary p-2 fs-5">📋</span>
                            <h5 class="card-title mb-0 fw-semibold">Listar Cursos</h5>
                        </div>
                        <p class="card-text text-muted small">
                            Visualize todos os cursos cadastrados, filtre por status e edite informações.
                        </p>
                        <a href="{{ route('courses.index') }}" class="btn btn-outline-primary btn-sm mt-1">
                            Ir para Cursos →
                        </a>
                    </div>
                </div>
            </div>

            {{-- Card: Criar curso --}}
            <div class="col-md-6">
                <div class="card border-0 shadow-sm h-100">
                    <div class="card-body p-4">
                        <div class="d-flex align-items-center gap-3 mb-3">
                            <span class="badge bg-success-subtle text-success p-2 fs-5">➕</span>
                            <h5 class="card-title mb-0 fw-semibold">Criar Curso</h5>
                        </div>
                        <p class="card-text text-muted small">
                            Cadastre um novo curso informando nome, carga horária e modalidade.
                        </p>
                        <button class="btn btn-outline-secondary btn-sm mt-1" disabled
                                title="Em breve">
                            Em breve
                        </button>
                    </div>
                </div>
            </div>

            {{-- Card: Gestão de disciplinas --}}
            <div class="col-md-6">
                <div class="card border-0 shadow-sm h-100">
                    <div class="card-body p-4">
                        <div class="d-flex align-items-center gap-3 mb-3">
                            <span class="badge bg-warning-subtle text-warning p-2 fs-5">📚</span>
                            <h5 class="card-title mb-0 fw-semibold">Disciplinas</h5>
                        </div>
                        <p class="card-text text-muted small">
                            Gerencie disciplinas vinculadas a cursos e atualize cargas horárias.
                        </p>
                        <a href="{{ route('subjects.index') }}" class="btn btn-outline-warning btn-sm mt-1">
                            Ir para Disciplinas →
                        </a>
                    </div>
                </div>
            </div>

            {{-- Card: Documentos --}}
            <div class="col-md-6">
                <div class="card border-0 shadow-sm h-100">
                    <div class="card-body p-4">
                        <div class="d-flex align-items-center gap-3 mb-3">
                            <span class="badge bg-info-subtle text-info p-2 fs-5">📄</span>
                            <h5 class="card-title mb-0 fw-semibold">Documentos</h5>
                        </div>
                        <p class="card-text text-muted small">
                            Envie e gerencie materiais didáticos, editais e regulamentos.
                        </p>
                        <a href="{{ route('documents.index') }}" class="btn btn-outline-info btn-sm mt-1">
                            Ir para Documentos →
                        </a>
                    </div>
                </div>
            </div>
        </div>

        {{-- Stats placeholder --}}
        <div class="card border-0 shadow-sm mt-4">
            <div class="card-header bg-transparent fw-semibold">
                Estatísticas rápidas
                <span class="badge bg-secondary ms-1">placeholder</span>
            </div>
            <div class="card-body">
                <div class="row g-3 text-center" id="statsRow">
                    <div class="col-4">
                        <div class="fs-4 fw-bold text-primary" id="statCourses">—</div>
                        <div class="text-muted small">Cursos</div>
                    </div>
                    <div class="col-4">
                        <div class="fs-4 fw-bold text-success" id="statSubjects">—</div>
                        <div class="text-muted small">Disciplinas</div>
                    </div>
                    <div class="col-4">
                        <div class="fs-4 fw-bold text-info" id="statDocs">—</div>
                        <div class="text-muted small">Documentos</div>
                    </div>
                </div>
            </div>
        </div>

        @else
        {{-- Acesso negado para não-admins --}}
        <div class="text-center py-5">
            <span class="fs-1">🔒</span>
            <h4 class="mt-3">Acesso Restrito</h4>
            <p class="text-muted">Esta área é exclusiva para administradores.</p>
            <a href="{{ route('home') }}" class="btn btn-primary">Voltar ao Início</a>
        </div>
        @endrole

    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="/js/api-client.js"></script>
    <script>
    // Carrega stats rápidos via API
    (async function () {
        const { apiRequest } = ApiClient;
        try {
            const [courses, subjects, docs] = await Promise.all([
                apiRequest('GET', '/api/courses'),
                apiRequest('GET', '/api/subjects'),
                apiRequest('GET', '/api/documents'),
            ]);
            const count = d => Array.isArray(d) ? d.length : (d.data?.length ?? d.total ?? '?');
            document.getElementById('statCourses').textContent  = count(courses);
            document.getElementById('statSubjects').textContent = count(subjects);
            document.getElementById('statDocs').textContent     = count(docs);
        } catch (_) { /* silencioso */ }
    })();
    </script>
</body>
</html>
