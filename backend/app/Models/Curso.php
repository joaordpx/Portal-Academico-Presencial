<?php

namespace App\Models;

use App\Enums\Grau;
use App\Enums\Turno;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\AsEnumCollection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/** Curso de graduação presencial */
class Curso extends Model
{
    /** Grandes áreas do conhecimento usadas no filtro de cursos do portal */
    public const AREAS = [
        'Ciências Agrárias',
        'Ciências Biológicas',
        'Ciências da Saúde',
        'Ciências Exatas e da Terra',
        'Ciências Humanas',
        'Ciências Sociais Aplicadas',
        'Engenharias',
        'Linguística, Letras e Artes',
    ];

    protected $table = 'cursos';

    protected $fillable = [
        'slug', 'nome', 'grau', 'modalidade', 'centro_id', 'area', 'turnos', 'duracao', 'imagem',
        'descricao', 'perfil_egresso', 'mercado_trabalho',
        'coordenador', 'email_coordenacao', 'telefone_coordenacao', 'localizacao',
        'matriz_url', 'ppc_url', 'regulamento_tcc_url', 'pagina_oficial', 'documentos_extras',
        'publicado',
    ];

    protected function casts(): array
    {
        return [
            'grau' => Grau::class,
            'turnos' => AsEnumCollection::of(Turno::class),
            'perfil_egresso' => 'array',
            'mercado_trabalho' => 'array',
            'documentos_extras' => 'array',
            'publicado' => 'boolean',
        ];
    }

    /** @param Builder<Curso> $query */
    #[Scope]
    protected function publicados(Builder $query): void
    {
        $query->where('publicado', true);
    }

    /** @return BelongsTo<Centro, $this> */
    public function centro(): BelongsTo
    {
        return $this->belongsTo(Centro::class);
    }

    /** @return HasMany<CursoOferta, $this> */
    public function ofertas(): HasMany
    {
        return $this->hasMany(CursoOferta::class);
    }
}
