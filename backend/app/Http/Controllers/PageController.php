<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

/**
 * PageController
 *
 * Controller mínimo — apenas retorna views.
 * Nenhuma lógica de negócio: toda a busca/exibição de dados é feita
 * pelo JavaScript do front-end via chamadas às APIs existentes.
 */
class PageController extends Controller
{
    /**
     * Página inicial com search hero.
     */
    public function home()
    {
        return view('home');
    }

    /**
     * Lista de cursos (dados carregados via JS → GET /api/courses).
     */
    public function coursesIndex()
    {
        return view('courses.index');
    }

    /**
     * Detalhe de um curso (dados carregados via JS → GET /api/courses/{id}).
     *
     * @param  int|string  $id
     */
    public function coursesShow($id)
    {
        // Validação básica do ID antes de entregar a view
        abort_if(! is_numeric($id), 404);

        return view('courses.show', ['courseId' => (int) $id]);
    }

    /**
     * Lista de disciplinas (dados carregados via JS → GET /api/subjects).
     */
    public function subjectsIndex()
    {
        return view('subjects.index');
    }

    /**
     * Lista de documentos + upload (dados via JS → GET /api/documents).
     * Upload via JS → POST /api/documents (multipart, apenas para quem tem documents.manage).
     */
    public function documentsIndex()
    {
        return view('documents.index');
    }

    /**
     * Painel administrativo de cursos — visível apenas para a role 'admin'.
     * A verificação de role é feita na rota (middleware) e também via @role no Blade.
     */
    public function adminCourses()
    {
        return view('admin.course-admin');
    }

    /**
     * Painel de suporte — visível para roles 'suporte' e 'admin'.
     */
    public function adminSupport()
    {
        return view('admin.support-admin');
    }

    /**
     * Painel de usuários — visível apenas para a role 'suporte'.
     */
    public function adminUsers()
    {
        return view('admin.users-admin');
    }
}
