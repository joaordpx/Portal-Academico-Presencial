{{-- resources/views/partials/_nav.blade.php --}}
<nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
    <div class="container">

        <a class="navbar-brand fw-bold" href="{{ route('home') }}">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                 class="bi bi-mortarboard-fill me-1 mb-1" viewBox="0 0 16 16">
                <path d="M8.211 2.047a.5.5 0 0 0-.422 0l-7.5 3.5a.5.5 0 0 0 .025.917l7.5 3a.5.5 0 0 0
                         .372 0L14 7.14V13a1 1 0 0 0-1 1v2h3v-2a1 1 0 0 0-1-1V6.739l.686-.275a.5.5 0
                         0 0 .025-.917l-7.5-3.5Z"/>
                <path d="M4.176 9.032a.5.5 0 0 0-.656.327l-.5 1.7a.5.5 0 0 0 .294.605l4.5 1.8a.5.5 0 0
                         0 .372 0l4.5-1.8a.5.5 0 0 0 .294-.605l-.5-1.7a.5.5 0 0 0-.656-.327L8
                         10.466 4.176 9.032Z"/>
            </svg>
            EduPortal
        </a>

        <button class="navbar-toggler" type="button"
                data-bs-toggle="collapse" data-bs-target="#mainNav"
                aria-controls="mainNav" aria-expanded="false" aria-label="Alternar navegação">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="mainNav">

            {{-- Links principais --}}
            @auth
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">

                <li class="nav-item">
                    <a class="nav-link {{ request()->routeIs('home') ? 'active' : '' }}"
                       href="{{ route('home') }}">
                        Início
                    </a>
                </li>

                <li class="nav-item">
                    <a class="nav-link {{ request()->routeIs('courses.*') ? 'active' : '' }}"
                       href="{{ route('courses.index') }}">
                        Cursos
                    </a>
                </li>

                <li class="nav-item">
                    <a class="nav-link {{ request()->routeIs('subjects.*') ? 'active' : '' }}"
                       href="{{ route('subjects.index') }}">
                        Disciplinas
                    </a>
                </li>

                <li class="nav-item">
                    <a class="nav-link {{ request()->routeIs('documents.*') ? 'active' : '' }}"
                       href="{{ route('documents.index') }}">
                        Documentos
                    </a>
                </li>

                {{-- Dropdown Admin — visível apenas para admin e suporte --}}
                @hasanyrole('admin|suporte')
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle {{ request()->routeIs('admin.*') ? 'active' : '' }}"
                       href="#" id="adminDropdown" role="button"
                       data-bs-toggle="dropdown" aria-expanded="false">
                        Administração
                    </a>
                    <ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="adminDropdown">
                        @role('admin')
                        <li>
                            <a class="dropdown-item" href="{{ route('admin.courses') }}">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"
                                     fill="currentColor" class="bi bi-journal-richtext me-1" viewBox="0 0 16 16">
                                    <path d="M7.5 2a.5.5 0 0 1 .5.5v1h1a.5.5 0 0 1 0 1H8v1a.5.5 0 0 1-1 0v-1H6a.5.5
                                             0 0 1 0-1h1v-1a.5.5 0 0 1 .5-.5z"/>
                                    <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0
                                             1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2z"/>
                                    <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1
                                             0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1
                                             0-1H1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1z"/>
                                </svg>
                                Gestão de Cursos
                            </a>
                        </li>
                        @endrole

                        @role('suporte')
                        <li>
                            <a class="dropdown-item" href="{{ route('admin.support') }}">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"
                                     fill="currentColor" class="bi bi-headset me-1" viewBox="0 0 16 16">
                                    <path d="M8 1a5 5 0 0 0-5 5v1h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H3a1 1 0 0
                                             1-1-1V6a6 6 0 1 1 12 0v6a2.5 2.5 0 0 1-2.5 2.5H9.366a1 1 0 0
                                             1-.866.5h-1a1 1 0 1 1 0-2h1a1 1 0 0 1 .866.5H11.5A1.5 1.5 0 0 0
                                             13 12h-1a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h1V6a5 5 0 0 0-5-5z"/>
                                </svg>
                                Painel de Suporte
                            </a>
                        </li>
                        <li>
                            <a class="dropdown-item" href="{{ route('admin.users') }}">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"
                                     fill="currentColor" class="bi bi-people me-1" viewBox="0 0 16 16">
                                    <path d="M13 7A3 3 0 1 1 7 7a3 3 0 0 1 6 0zM4.5 8a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm-2.447 5A2.5 2.5 0 0 1 4.5 10h2A2.5 2.5 0 0 1 9 12.5V14H2.053v-.5zm7.447-1.5c0-1.105.895-2 2-2h2a2 2 0 0 1 2 2V14h-6v-2.5z"/>
                                </svg>
                                Usuários
                            </a>
                        </li>
                        @endrole

                        {{-- Visível para ambos --}}
                        @role('admin')
                        <li><hr class="dropdown-divider"></li>
                        <li>
                            <a class="dropdown-item" href="{{ route('admin.support') }}">
                                Painel de Suporte
                            </a>
                        </li>
                        @endrole
                    </ul>
                </li>
                @endrole

            </ul>

            {{-- Usuário logado --}}
            <ul class="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center">
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle d-flex align-items-center gap-2"
                       href="#" id="userDropdown" role="button"
                       data-bs-toggle="dropdown" aria-expanded="false">
                        <span class="badge bg-secondary">
                            @role('admin') admin
                            @elserole('suporte') suporte
                            @else aluno
                            @endrole
                        </span>
                        {{ Auth::user()->name }}
                    </a>
                    <ul class="dropdown-menu dropdown-menu-end dropdown-menu-dark"
                        aria-labelledby="userDropdown">
                        <li><span class="dropdown-item-text small text-muted">{{ Auth::user()->email }}</span></li>
                        <li><hr class="dropdown-divider"></li>
                        <li>
                            <form method="POST" action="{{ route('logout') }}">
                                @csrf
                                <button type="submit" class="dropdown-item text-danger">
                                    Sair
                                </button>
                            </form>
                        </li>
                    </ul>
                </li>
            </ul>
            @endauth

            @guest
            <ul class="navbar-nav ms-auto">
                <li class="nav-item">
                    <a class="nav-link" href="{{ route('login') }}">Entrar</a>
                </li>
            </ul>
            @endguest

        </div>
    </div>
</nav>
