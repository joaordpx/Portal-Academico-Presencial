{{-- resources/views/admin/users-admin.blade.php --}}
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>EduPortal — Usuários</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
</head>
<body class="bg-light">

    @include('partials._nav')

    <div class="container py-5">
        <nav aria-label="breadcrumb" class="mb-4">
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="{{ route('home') }}">Início</a></li>
                <li class="breadcrumb-item active" aria-current="page">Usuários</li>
            </ol>
        </nav>

        <div class="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
            <div>
                <h2 class="mb-0 fw-bold">Usuários</h2>
                <p class="text-muted mb-0">Cadastro e manutenção de usuários da plataforma</p>
            </div>
            <button class="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#userFormWrap" aria-expanded="true" aria-controls="userFormWrap">
                Novo Usuário
            </button>
        </div>

        <div id="alertContainer"></div>

        <div class="collapse show mb-4" id="userFormWrap">
            <div class="card shadow-sm border-0">
                <div class="card-body">
                    <form id="userForm" class="row g-3">
                        <input type="hidden" id="userId" value="">
                        <div class="col-md-6">
                            <label for="name" class="form-label">Nome</label>
                            <input type="text" class="form-control" id="name" required>
                        </div>
                        <div class="col-md-3">
                            <label for="cpf" class="form-label">CPF</label>
                            <input type="text" class="form-control" id="cpf" placeholder="000.000.000-00">
                        </div>
                        <div class="col-md-3">
                            <label for="matricula" class="form-label">Matrícula</label>
                            <input type="text" class="form-control" id="matricula">
                        </div>
                        <div class="col-md-6">
                            <label for="email" class="form-label">E-mail</label>
                            <input type="email" class="form-control" id="email" required>
                        </div>
                        <div class="col-md-3">
                            <label for="role" class="form-label">Perfil</label>
                            <select class="form-select" id="role" required>
                                <option value="aluno">aluno</option>
                                <option value="admin">admin</option>
                                <option value="suporte">suporte</option>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <label for="course_id" class="form-label">Curso ID</label>
                            <input type="number" min="1" class="form-control" id="course_id" placeholder="Opcional">
                        </div>
                        <div class="col-md-6">
                            <label for="password" class="form-label">Senha</label>
                            <input type="password" class="form-control" id="password" minlength="8">
                        </div>
                        <div class="col-md-6">
                            <label for="password_confirmation" class="form-label">Confirmar senha</label>
                            <input type="password" class="form-control" id="password_confirmation" minlength="8">
                        </div>
                        <div class="col-12 d-flex gap-2">
                            <button class="btn btn-success" type="submit">Salvar</button>
                            <button class="btn btn-outline-secondary" type="button" id="resetFormButton">Limpar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <div class="card shadow-sm border-0">
            <div class="card-body">
                <div class="d-flex gap-2 mb-3">
                    <input type="search" id="searchInput" class="form-control" placeholder="Buscar por nome, e-mail, CPF ou matrícula">
                    <button class="btn btn-outline-primary" id="searchButton" type="button">Buscar</button>
                </div>
                <div class="table-responsive">
                    <table class="table align-middle mb-0">
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>E-mail</th>
                                <th>Perfil</th>
                                <th>Curso</th>
                                <th class="text-end">Ações</th>
                            </tr>
                        </thead>
                        <tbody id="usersTableBody">
                            <tr>
                                <td colspan="5" class="text-center text-muted py-4">Carregando usuários...</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="/js/api-client.js"></script>
    <script>
        (function () {
            const { apiRequest, showAlert, escapeHtml } = ApiClient;
            const tableBody = document.getElementById('usersTableBody');
            const form = document.getElementById('userForm');
            const resetButton = document.getElementById('resetFormButton');
            const searchInput = document.getElementById('searchInput');
            const searchButton = document.getElementById('searchButton');

            function formData() {
                return {
                    name: document.getElementById('name').value.trim(),
                    cpf: document.getElementById('cpf').value.trim() || null,
                    matricula: document.getElementById('matricula').value.trim() || null,
                    email: document.getElementById('email').value.trim(),
                    password: document.getElementById('password').value,
                    password_confirmation: document.getElementById('password_confirmation').value,
                    role: document.getElementById('role').value,
                    course_id: document.getElementById('course_id').value ? Number(document.getElementById('course_id').value) : null,
                };
            }

            function resetForm() {
                form.reset();
                document.getElementById('userId').value = '';
                document.querySelector('button[type="submit"]').textContent = 'Salvar';
            }

            function renderRows(users) {
                if (!users.length) {
                    tableBody.innerHTML = '<tr><td colspan="5" class="text-center text-muted py-4">Nenhum usuário encontrado.</td></tr>';
                    return;
                }

                tableBody.innerHTML = users.map(user => `
                    <tr>
                        <td>
                            <div class="fw-semibold">${escapeHtml(user.name ?? '')}</div>
                            <div class="text-muted small">CPF: ${escapeHtml(user.cpf ?? '—')} · Matrícula: ${escapeHtml(user.matricula ?? '—')}</div>
                        </td>
                        <td>${escapeHtml(user.email ?? '')}</td>
                        <td><span class="badge text-bg-secondary">${escapeHtml(user.role ?? '—')}</span></td>
                        <td>${escapeHtml(user.course?.name ?? '—')}</td>
                        <td class="text-end">
                            <button class="btn btn-sm btn-outline-primary me-2" data-edit-user='${escapeHtml(JSON.stringify(user))}'>Editar</button>
                            <button class="btn btn-sm btn-outline-danger" data-delete-user='${user.id}'>Excluir</button>
                        </td>
                    </tr>
                `).join('');
            }

            async function loadUsers() {
                tableBody.innerHTML = '<tr><td colspan="5" class="text-center text-muted py-4">Carregando usuários...</td></tr>';

                try {
                    const response = await apiRequest('GET', '/api/users?per_page=100&search=' + encodeURIComponent(searchInput.value.trim()));
                    renderRows(response.data ?? []);
                } catch (error) {
                    tableBody.innerHTML = '<tr><td colspan="5" class="text-center text-danger py-4">Falha ao carregar usuários.</td></tr>';
                    showAlert('alertContainer', error.message || 'Falha ao carregar usuários.');
                }
            }

            async function submitUser(event) {
                event.preventDefault();

                const userId = document.getElementById('userId').value;
                const payload = formData();

                if (!payload.password) {
                    delete payload.password;
                    delete payload.password_confirmation;
                }

                try {
                    if (userId) {
                        await apiRequest('PUT', '/api/users/' + userId, payload);
                        showAlert('alertContainer', 'Usuário atualizado com sucesso.', 'success');
                    } else {
                        await apiRequest('POST', '/api/users', payload);
                        showAlert('alertContainer', 'Usuário criado com sucesso.', 'success');
                    }

                    resetForm();
                    await loadUsers();
                } catch (error) {
                    showAlert('alertContainer', error.message || 'Não foi possível salvar o usuário.');
                }
            }

            async function deleteUser(userId) {
                if (!confirm('Excluir este usuário?')) return;

                try {
                    await apiRequest('DELETE', '/api/users/' + userId);
                    showAlert('alertContainer', 'Usuário excluído com sucesso.', 'success');
                    await loadUsers();
                } catch (error) {
                    showAlert('alertContainer', error.message || 'Não foi possível excluir o usuário.');
                }
            }

            function fillForm(user) {
                document.getElementById('userId').value = user.id ?? '';
                document.getElementById('name').value = user.name ?? '';
                document.getElementById('cpf').value = user.cpf ?? '';
                document.getElementById('matricula').value = user.matricula ?? '';
                document.getElementById('email').value = user.email ?? '';
                document.getElementById('role').value = user.role ?? 'aluno';
                document.getElementById('course_id').value = user.course_id ?? '';
                document.getElementById('password').value = '';
                document.getElementById('password_confirmation').value = '';
                document.querySelector('button[type="submit"]').textContent = 'Atualizar';
                document.getElementById('userFormWrap').classList.add('show');
            }

            form.addEventListener('submit', submitUser);
            resetButton.addEventListener('click', resetForm);
            searchButton.addEventListener('click', loadUsers);
            searchInput.addEventListener('keydown', event => {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    loadUsers();
                }
            });

            tableBody.addEventListener('click', event => {
                const editData = event.target.getAttribute('data-edit-user');
                const deleteId = event.target.getAttribute('data-delete-user');

                if (editData) {
                    fillForm(JSON.parse(editData));
                }

                if (deleteId) {
                    deleteUser(deleteId);
                }
            });

            loadUsers();
        })();
    </script>
</body>
</html>