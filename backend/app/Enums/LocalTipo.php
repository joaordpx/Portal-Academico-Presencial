<?php

namespace App\Enums;

use Filament\Support\Contracts\HasLabel;

enum LocalTipo: string implements HasLabel
{
    case SalasDeAula = 'Salas de aula';
    case Administrativo = 'Administrativo';
    case Biblioteca = 'Biblioteca';
    case Laboratorio = 'Laboratório';
    case Alimentacao = 'Alimentação';
    case Esportivo = 'Esportivo';
    case Servico = 'Serviço';

    public function getLabel(): string
    {
        return $this->value;
    }
}
