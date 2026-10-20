<?php

namespace App\Enums;

use Filament\Support\Contracts\HasLabel;

enum EventoTipo: string implements HasLabel
{
    case Cultural = 'Cultural';
    case Academico = 'Acadêmico';
    case Comunitario = 'Comunitário';

    public function getLabel(): string
    {
        return $this->value;
    }
}
