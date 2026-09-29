<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Portal Academico - Login Playground</title>
    <style>
        :root {
            --bg: #0f172a;
            --panel: rgba(15, 23, 42, 0.82);
            --panel-2: rgba(30, 41, 59, 0.82);
            --ink: #e2e8f0;
            --muted: #94a3b8;
            --accent: #38bdf8;
            --accent-2: #22c55e;
            --danger: #ef4444;
            --border: rgba(148, 163, 184, 0.24);
            --shadow: 0 20px 50px rgba(2, 6, 23, 0.45);
        }

        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            min-height: 100vh;
            font-family: Inter, "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
            color: var(--ink);
            background:
                radial-gradient(circle at top left, rgba(56, 189, 248, 0.25), transparent 34%),
                radial-gradient(circle at 85% 15%, rgba(34, 197, 94, 0.2), transparent 28%),
                linear-gradient(135deg, #020617 0%, #0f172a 40%, #111827 100%);
        }

        .page {
            width: min(1100px, calc(100% - 2rem));
            margin: 0 auto;
            padding: 1.25rem 0 2rem;
        }

        .topbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 1rem;
            padding: 0.9rem 1rem;
            border: 1px solid var(--border);
            border-radius: 18px;
            background: rgba(15, 23, 42, 0.55);
            backdrop-filter: blur(16px);
            box-shadow: var(--shadow);
            margin-bottom: 1rem;
        }

        .brand {
            display: flex;
            flex-direction: column;
            gap: 0.15rem;
        }

        .brand strong {
            font-size: 1rem;
            letter-spacing: 0.2px;
        }

        .brand span {
            color: var(--muted);
            font-size: 0.88rem;
        }

        .nav-actions {
            display: flex;
            gap: 0.5rem;
            flex-wrap: wrap;
        }

        .nav-link {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 0.55rem 0.85rem;
            border-radius: 999px;
            border: 1px solid var(--border);
            color: var(--ink);
            text-decoration: none;
            background: rgba(148, 163, 184, 0.08);
        }

        .hero {
            display: grid;
            grid-template-columns: 1.2fr 0.8fr;
            gap: 1rem;
        }

        .panel {
            border: 1px solid var(--border);
            border-radius: 22px;
            background: var(--panel);
            backdrop-filter: blur(16px);
            box-shadow: var(--shadow);
            overflow: hidden;
        }

        .panel-inner {
            padding: 1.25rem;
        }

        .eyebrow {
            display: inline-flex;
            padding: 0.35rem 0.7rem;
            border-radius: 999px;
            background: rgba(56, 189, 248, 0.12);
            color: #7dd3fc;
            font-size: 0.8rem;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            margin-bottom: 0.9rem;
        }

        h1 {
            margin: 0;
            font-size: clamp(2rem, 4vw, 3.1rem);
            line-height: 1.02;
        }

        .lead {
            color: var(--muted);
            font-size: 1rem;
            line-height: 1.6;
            margin: 0.9rem 0 0;
            max-width: 58ch;
        }

        .credentials {
            display: grid;
            gap: 0.75rem;
            margin-top: 1.2rem;
            grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .credential-card {
            border: 1px solid var(--border);
            border-radius: 16px;
            padding: 0.9rem;
            background: var(--panel-2);
        }

        .credential-card span {
            display: block;
            color: var(--muted);
            font-size: 0.8rem;
            margin-bottom: 0.3rem;
        }

        .credential-card strong {
            display: block;
            font-size: 0.93rem;
            word-break: break-word;
        }

        .form-title {
            display: flex;
            justify-content: space-between;
            gap: 1rem;
            align-items: baseline;
            margin-bottom: 1rem;
        }

        .form-title h2 {
            margin: 0;
            font-size: 1.15rem;
        }

        .form-title p {
            margin: 0;
            color: var(--muted);
            font-size: 0.88rem;
        }

        .status {
            margin-bottom: 0.9rem;
            padding: 0.75rem 0.9rem;
            border-radius: 14px;
            background: rgba(148, 163, 184, 0.08);
            border: 1px solid var(--border);
            color: var(--muted);
            min-height: 2.7rem;
        }

        .status.success {
            color: #bbf7d0;
            border-color: rgba(34, 197, 94, 0.3);
            background: rgba(34, 197, 94, 0.12);
        }

        .status.error {
            color: #fecaca;
            border-color: rgba(239, 68, 68, 0.3);
            background: rgba(239, 68, 68, 0.12);
        }

        form {
            display: grid;
            gap: 0.9rem;
        }

        .field {
            display: grid;
            gap: 0.35rem;
        }

        label {
            font-size: 0.84rem;
            color: var(--muted);
            font-weight: 600;
        }

        input[type="email"],
        input[type="password"] {
            width: 100%;
            border: 1px solid var(--border);
            border-radius: 14px;
            padding: 0.9rem 1rem;
            font-size: 0.98rem;
            background: rgba(15, 23, 42, 0.7);
            color: var(--ink);
            outline: none;
        }

        input[type="email"]::placeholder,
        input[type="password"]::placeholder {
            color: #64748b;
        }

        .row {
            display: grid;
            gap: 0.75rem;
            grid-template-columns: 1fr 1fr;
            align-items: center;
        }

        .checkbox {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: var(--muted);
            font-size: 0.9rem;
        }

        .actions {
            display: flex;
            gap: 0.6rem;
            flex-wrap: wrap;
        }

        button,
        .button-link {
            border: none;
            border-radius: 14px;
            padding: 0.85rem 1rem;
            font-size: 0.95rem;
            font-weight: 700;
            cursor: pointer;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
        }

        button:hover,
        .button-link:hover,
        .nav-link:hover {
            transform: translateY(-1px);
        }

        .button-primary {
            background: linear-gradient(135deg, var(--accent), #0ea5e9);
            color: white;
            box-shadow: 0 14px 28px rgba(14, 165, 233, 0.28);
        }

        .button-secondary {
            background: rgba(148, 163, 184, 0.14);
            color: var(--ink);
            border: 1px solid var(--border);
        }

        .button-success {
            background: linear-gradient(135deg, var(--accent-2), #16a34a);
            color: white;
        }

        .error-list {
            margin: 0;
            padding-left: 1.1rem;
            color: #fecaca;
        }

        .current-user {
            display: grid;
            gap: 0.8rem;
        }

        .user-card {
            border-radius: 18px;
            border: 1px solid rgba(34, 197, 94, 0.22);
            background: rgba(34, 197, 94, 0.12);
            padding: 1rem;
        }

        .user-card strong {
            display: block;
            margin-bottom: 0.25rem;
        }

        .user-card span {
            display: block;
            color: var(--muted);
            font-size: 0.9rem;
        }

        .helper {
            color: var(--muted);
            font-size: 0.9rem;
            line-height: 1.5;
        }

        @media (max-width: 900px) {
            .hero {
                grid-template-columns: 1fr;
            }

            .credentials {
                grid-template-columns: 1fr;
            }

            .row {
                grid-template-columns: 1fr;
            }

            .topbar {
                align-items: flex-start;
                flex-direction: column;
            }
        }
    </style>
</head>
<body>
<div class="page">
    <header class="topbar">
        <div class="brand">
            <strong>Portal Academico</strong>
            <span>Login playground para validar autenticacao de sessao.</span>
        </div>
        <div class="nav-actions">
            <a class="nav-link" href="{{ url('/api-playground') }}">API Playground</a>
            <a class="nav-link" href="{{ url('/login') }}">Login</a>
        </div>
    </header>

    <main class="hero">
        <section class="panel">
            <div class="panel-inner">
                <span class="eyebrow">Tela de teste</span>
                <h1>Entrar no sistema e validar a sessao.</h1>
                <p class="lead">
                    Use esta tela para testar o fluxo de autenticação com os usuários semeados no ambiente local.
                    As credenciais abaixo usam a senha padrão <strong>password</strong>.
                </p>

                <div class="credentials">
                    <div class="credential-card">
                        <span>Suporte</span>
                        <strong>suporte@example.com</strong>
                    </div>
                    <div class="credential-card">
                        <span>Admin</span>
                        <strong>admin@example.com</strong>
                    </div>
                    <div class="credential-card">
                        <span>Aluno</span>
                        <strong>test@example.com</strong>
                    </div>
                </div>
            </div>
        </section>

        <section class="panel">
            <div class="panel-inner">
                <div class="form-title">
                    <div>
                        <h2>Autenticacao</h2>
                        <p>POST em /login com session guard.</p>
                    </div>
                </div>

                @php($message = session('status'))
                @if ($message)
                    <div class="status success">{{ $message }}</div>
                @endif

                @if ($errors->any())
                    <div class="status error">
                        <ul class="error-list">
                            @foreach ($errors->all() as $error)
                                <li>{{ $error }}</li>
                            @endforeach
                        </ul>
                    </div>
                @endif

                @auth
                    <div class="current-user">
                        <div class="user-card">
                            <strong>Voce esta autenticado.</strong>
                            <span>{{ auth()->user()->name }} · {{ auth()->user()->email }}</span>
                        </div>

                        <form method="POST" action="{{ route('logout') }}">
                            @csrf
                            <button class="button-success" type="submit">Sair</button>
                        </form>
                    </div>
                @else
                    <form method="POST" action="{{ route('login.store') }}">
                        @csrf

                        <div class="field">
                            <label for="email">E-mail</label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value="{{ old('email') }}"
                                placeholder="admin@example.com"
                                autocomplete="email"
                                required
                            />
                        </div>

                        <div class="field">
                            <label for="password">Senha</label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                placeholder="password"
                                autocomplete="current-password"
                                required
                            />
                        </div>

                        <div class="row">
                            <label class="checkbox" for="remember">
                                <input id="remember" type="checkbox" name="remember" value="1" />
                                Manter conectado
                            </label>

                            <p class="helper">Se a autenticação falhar, confira se o usuário foi semeado no ambiente atual.</p>
                        </div>

                        <div class="actions">
                            <button class="button-primary" type="submit">Entrar</button>
                            <a class="button-link button-secondary" href="{{ url('/api-playground') }}">Ir para API Playground</a>
                        </div>
                    </form>
                @endauth
            </div>
        </section>
    </main>
</div>
</body>
</html>
