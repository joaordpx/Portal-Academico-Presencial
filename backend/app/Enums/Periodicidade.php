<?php

namespace App\Enums;

use Filament\Support\Contracts\HasLabel;

/** Periodicidade das vagas de ingresso de uma oferta de curso */
enum Periodicidade: string implements HasLabel
{
    case Semestrais = 'semestrais';
    case Anuais = 'anuais';

    public function getLabel(): string
    {
        return ucfirst($this->value);
    }
}
