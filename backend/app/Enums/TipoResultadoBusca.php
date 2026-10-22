<?php

namespace App\Enums;

use Filament\Support\Contracts\HasLabel;

/** Tipo do resultado clicado na busca global do portal (espelha `TipoBusca` do frontend) */
enum TipoResultadoBusca: string implements HasLabel
{
    case Pagina = 'pagina';
    case Atalho = 'atalho';
    case Curso = 'curso';
    case Local = 'local';
    case Edital = 'edital';
    case Evento = 'evento';

    public function getLabel(): string
    {
        return match ($this) {
            self::Pagina => 'Páginas',
            self::Atalho => 'Ações rápidas',
            self::Curso => 'Cursos',
            self::Local => 'Locais',
            self::Edital => 'Editais',
            self::Evento => 'Eventos',
        };
    }
}
