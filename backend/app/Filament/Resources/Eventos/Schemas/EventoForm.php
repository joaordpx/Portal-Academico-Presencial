<?php

namespace App\Filament\Resources\Eventos\Schemas;

use App\Enums\EventoTipo;
use App\Filament\Componentes\Campos;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class EventoForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(1)
            ->components([
                Section::make('Evento')
                    ->columns(2)
                    ->components([
                        Campos::nomeComSlug('titulo', 'Título'),
                        Campos::slug(),
                        Select::make('tipo')->options(EventoTipo::class)->required(),
                        TextInput::make('organizador'),
                        Textarea::make('descricao')
                            ->label('Resumo')
                            ->helperText('Aparece no card da listagem.')
                            ->required()
                            ->rows(2)
                            ->columnSpanFull(),
                        Textarea::make('conteudo')
                            ->label('Texto da página do evento')
                            ->helperText('Opcional. Separe os parágrafos com uma linha em branco. Sem texto, a página leva para o link oficial.')
                            ->rows(8)
                            ->columnSpanFull(),
                    ]),

                Section::make('Data e local')
                    ->columns(2)
                    ->components([
                        DatePicker::make('data')->label('Início')->required(),
                        DatePicker::make('data_fim')->label('Término')->afterOrEqual('data'),
                        TextInput::make('horario')->label('Horário')->placeholder('A partir das 14h'),
                        TextInput::make('campus')->default('Montes Claros'),
                        TextInput::make('local')->columnSpanFull(),
                    ]),

                Section::make('Divulgação')
                    ->columns(2)
                    ->components([
                        TextInput::make('imagem')->label('Imagem (URL)')->url()->columnSpanFull(),
                        TextInput::make('link_oficial')->label('Página oficial ou inscrição')->url()->columnSpanFull(),
                        Toggle::make('inscricoes_abertas')->label('Inscrições abertas'),
                        Toggle::make('publicado')->default(true),
                    ]),
            ]);
    }
}
