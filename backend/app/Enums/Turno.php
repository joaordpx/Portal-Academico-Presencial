<?php

namespace App\Enums;

use Filament\Support\Contracts\HasLabel;

enum Turno: string implements HasLabel
{
    case Integral = 'Integral';
    case Diurno = 'Diurno';
    case Matutino = 'Matutino';
    case Vespertino = 'Vespertino';
    case Noturno = 'Noturno';

    public function getLabel(): string
    {
        return $this->value;
    }
}
