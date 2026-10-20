<?php

namespace App\Enums;

use Filament\Support\Contracts\HasLabel;

enum EditalTipo: string implements HasLabel
{
    case Monitoria = 'Monitoria';
    case Extensao = 'Extensão';
    case Pesquisa = 'Pesquisa';
    case Estagio = 'Estágio';
    case Assistencia = 'Assistência';
    case Mobilidade = 'Mobilidade';
    case PosGraduacao = 'Pós-Graduação';

    public function getLabel(): string
    {
        return $this->value;
    }
}
