{{-- resources/views/courses/show.blade.php --}}
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    {{-- courseId é passado pelo controller: view('courses.show', ['courseId' => $id]) --}}
    <meta name="course-id" content="{{ $courseId }}">
    <title>EduPortal — Detalhes do Curso</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
</head>
<body class="bg-light">

    @include('partials._nav')

    <div class="container py-5" style="max-width:860px">

        {{-- Breadcrumb --}}
        <nav aria-label="breadcrumb" class="mb-4">
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="{{ route('home') }}">Início</a></li>
                <li class="breadcrumb-item"><a href="{{ route('courses.index') }}">Cursos</a></li>
                <li class="breadcrumb-item active" id="breadcrumbTitle" aria-current="page">Carregando…</li>
            </ol>
        </nav>

        <div id="alertContainer"></div>

        {{-- Spinner --}}
        <div id="loadingSpinner" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Carregando…</span>
            </div>
        </div>

        {{-- Conteúdo do curso --}}
        <div id="courseContent" class="d-none">

            <div class="card border-0 shadow-sm mb-4">
                <div class="card-body p-4">
                    <div class="d-flex align-items-center gap-3 mb-3">
                        <span class="fs-1">🎓</span>
                        <div>
                            <h2 class="mb-0 fw-bold" id="courseName">—</h2>
                            <span id="courseStatus" class="badge mt-1"></span>
                        </div>
                    </div>
                    <p class="text-muted" id="courseDescription"></p>

                    <div class="row g-3 mt-1" id="courseMeta"></div>
                </div>
            </div>

            {{-- Disciplinas relacionadas --}}
            <div id="subjectsSection" class="d-none">
                <h5 class="fw-semibold mb-3">📚 Disciplinas do Curso</h5>
                <div class="row g-3" id="subjectsGrid"></div>
            </div>

        </div>

    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="/js/api-client.js"></script>
    <script>
    (function () {
        const { apiRequest, showAlert, escapeHtml } = ApiClient;

        const courseId = document.querySelector('meta[name="course-id"]').getAttribute('content');

        async function loadCourse() {
            try {
                const data = await apiRequest('GET', `/api/courses/${courseId}`);
                const course = data.data ?? data;
                renderCourse(course);
                if (Array.isArray(course.subjects) && course.subjects.length) {
                    renderSubjects(course.subjects);
                }
            } catch (err) {
                showAlert('alertContainer',
                    err.status === 404 ? 'Curso não encontrado.' : (err.message || 'Erro ao carregar curso.'),
                    'danger');
            } finally {
                document.getElementById('loadingSpinner').classList.add('d-none');
            }
        }

        function renderCourse(c) {
            const name = c.name ?? c.title ?? 'Sem nome';
            document.getElementById('courseName').textContent = name;
            document.getElementById('breadcrumbTitle').textContent = name;
            document.title = `EduPortal — ${name}`;

            const statusEl = document.getElementById('courseStatus');
            const active = c.active || c.status === 'active';
            statusEl.className = `badge ${active ? 'bg-success' : 'bg-secondary'}`;
            statusEl.textContent = active ? 'Ativo' : 'Inativo';

            document.getElementById('courseDescription').textContent =
                c.description || 'Sem descrição disponível.';

            // Meta fields
            const metaItems = [
                { label: 'Código', value: c.code ?? c.slug ?? '—' },
                { label: 'Carga horária', value: c.workload ? `${c.workload}h` : '—' },
                { label: 'Modalidade', value: c.modality ?? c.mode ?? '—' },
                { label: 'Criado em', value: c.created_at ? new Date(c.created_at).toLocaleDateString('pt-BR') : '—' },
            ];

            document.getElementById('courseMeta').innerHTML = metaItems
                .filter(m => m.value !== '—')
                .map(m => `
                    <div class="col-6 col-md-3">
                        <div class="bg-light rounded p-2 text-center">
                            <div class="text-muted small">${escapeHtml(m.label)}</div>
                            <div class="fw-semibold">${escapeHtml(m.value)}</div>
                        </div>
                    </div>`).join('');

            document.getElementById('courseContent').classList.remove('d-none');
        }

        function renderSubjects(subjects) {
            const section = document.getElementById('subjectsSection');
            const grid    = document.getElementById('subjectsGrid');
            section.classList.remove('d-none');
            grid.innerHTML = subjects.map(s => `
                <div class="col-sm-6">
                    <div class="card border-0 shadow-sm h-100">
                        <div class="card-body d-flex gap-2">
                            <span class="fs-4">📖</span>
                            <div>
                                <div class="fw-semibold">${escapeHtml(s.name ?? s.title ?? '—')}</div>
                                <div class="text-muted small">${escapeHtml(s.description ?? '')}</div>
                            </div>
                        </div>
                    </div>
                </div>`).join('');
        }

        loadCourse();
    })();
    </script>
</body>
</html>
