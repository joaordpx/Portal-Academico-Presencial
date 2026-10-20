<?php

namespace App\Filament\Componentes;

use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Utilities\Set;
use Illuminate\Support\Str;

/** Campos de formulário reaproveitados entre os recursos do painel */
class Campos
{
    /** Nome que preenche o slug automaticamente ao criar um registro */
    public static function nomeComSlug(string $campo = 'nome', string $rotulo = 'Nome'): TextInput
    {
        return TextInput::make($campo)
            ->label($rotulo)
            ->required()
            ->maxLength(255)
            ->live(onBlur: true)
            ->afterStateUpdated(function (Set $set, ?string $state, string $operation): void {
                if ($operation === 'create') {
                    $set('slug', Str::slug($state ?? ''));
                }
            });
    }

    /** Slug usado na URL pública (ex.: /cursos/sistemas-de-informacao) */
    public static function slug(): TextInput
    {
        return TextInput::make('slug')
            ->label('Endereço na URL')
            ->required()
            ->alphaDash()
            ->maxLength(255)
            ->unique(ignoreRecord: true)
            ->helperText('Gerado a partir do nome. Mudar quebra links já divulgados.');
    }

    /** Faixas de horário de funcionamento: [{rotulo?, dias?, horas}] */
    public static function horarios(): Repeater
    {
        return Repeater::make('horarios')
            ->label('Horário de funcionamento')
            ->schema([
                TextInput::make('rotulo')->label('Rótulo')->placeholder('Almoço'),
                TextInput::make('dias')->label('Dias')->placeholder('Segunda a sexta'),
                TextInput::make('horas')->label('Horas')->placeholder('07h às 22h')->required(),
            ])
            ->columns(3)
            ->defaultItems(0)
            ->addActionLabel('Adicionar horário')
            ->helperText('Deixe "Dias" em branco quando a fonte não informar os dias.');
    }
}
