<?php

namespace App\Filament\Resources\Editais\Schemas;

use App\Enums\EditalTipo;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class EditalForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(1)
            ->components([
                Section::make()
                    ->columns(2)
                    ->components([
                        TextInput::make('titulo')
                            ->label('Título')
                            ->required()
                            ->maxLength(255)
                            ->columnSpanFull(),
                        Select::make('tipo')->options(EditalTipo::class)->required(),
                        DatePicker::make('prazo')
                            ->label('Prazo de inscrição')
                            ->required()
                            ->helperText('O edital aparece como aberto até o fim deste dia.'),
                        TextInput::make('publico')
                            ->label('Público')
                            ->required()
                            ->default('Todos os cursos')
                            ->datalist(['Todos os cursos', 'Graduados']),
                        TextInput::make('campus')
                            ->required()
                            ->default('Todos os campi')
                            ->datalist(['Todos os campi', 'Montes Claros']),
                        TextInput::make('url')
                            ->label('Link do edital')
                            ->url()
                            ->columnSpanFull(),
                        Toggle::make('publicado')->default(true),
                    ]),
            ]);
    }
}
