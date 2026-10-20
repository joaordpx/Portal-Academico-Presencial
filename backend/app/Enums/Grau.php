<?php

namespace App\Enums;

use Filament\Support\Contracts\HasLabel;

enum Grau: string implements HasLabel
{
    case Bacharelado = 'Bacharelado';
    case Licenciatura = 'Licenciatura';
    case Tecnologo = 'Tecnólogo';

    public function getLabel(): string
    {
        return $this->value;
    }
}
