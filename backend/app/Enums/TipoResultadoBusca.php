<?php

namespace App\Enums;

use Filament\Support\Contracts\HasLabel;

/** Tipo do resultado clicado na busca global do portal (espelha `TipoBusca` do frontend) */
enum TipoResultadoBusca: string implements HasLabel
{
    case Link = 'link';
    case Secao = 'secao';
    case Pergunta = 'pergunta';
    case Sigla = 'sigla';
    case Curso = 'curso';
    case Local = 'local';
    case Edital = 'edital';
    case Evento = 'evento';

    public function getLabel(): string
    {
        return match ($this) {
            self::Link => 'Links e documentos',
            self::Secao => 'Seções do portal',
            self::Pergunta => 'Perguntas frequentes',
            self::Sigla => 'Siglas',
            self::Curso => 'Cursos',
            self::Local => 'Locais',
            self::Edital => 'Editais',
            self::Evento => 'Eventos',
        };
    }
}
