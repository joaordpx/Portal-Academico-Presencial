<?php

namespace App\Models;

use App\Enums\EventoTipo;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

/** Evento cadastrado no painel (origem "manual") ou sincronizado do SiGex (origem "sigex") */
class Evento extends Model
{
    protected $table = 'eventos';

    protected $fillable = [
        'slug', 'titulo', 'descricao', 'conteudo', 'tipo', 'data', 'data_fim', 'horario', 'local',
        'campus', 'imagem', 'origem', 'id_externo', 'organizador', 'link_oficial',
        'inscricoes_abertas', 'publicado',
    ];

    protected function casts(): array
    {
        return [
            'tipo' => EventoTipo::class,
            'data' => 'date',
            'data_fim' => 'date',
            'inscricoes_abertas' => 'boolean',
            'publicado' => 'boolean',
        ];
    }

    /** @param Builder<Evento> $query */
    #[Scope]
    protected function publicados(Builder $query): void
    {
        $query->where('publicado', true);
    }
}
