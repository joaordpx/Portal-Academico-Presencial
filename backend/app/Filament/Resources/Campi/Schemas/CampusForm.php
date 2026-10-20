<?php

namespace App\Filament\Resources\Campi\Schemas;

use App\Filament\Componentes\Campos;
use Filament\Forms\Components\TagsInput;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class CampusForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(1)
            ->components([
                Section::make('Identificação')
                    ->columns(2)
                    ->components([
                        Campos::nomeComSlug(),
                        Campos::slug(),
                        TextInput::make('cidade')->required(),
                        TextInput::make('regiao')->label('Região')->placeholder('Norte de Minas'),
                        Toggle::make('sede')
                            ->label('Campus-sede')
                            ->helperText('Os prédios do campus-sede aparecem no mapa de Unidades e Localização.'),
                    ]),

                Section::make('Contato e funcionamento')
                    ->columns(2)
                    ->components([
                        TextInput::make('endereco')->label('Endereço')->columnSpanFull(),
                        TextInput::make('telefone')->tel(),
                        TextInput::make('email')->label('E-mail')->email(),
                        TextInput::make('maps_url')->label('Link do Google Maps')->url()->columnSpanFull(),
                        Campos::horarios()->columnSpanFull(),
                    ]),

                Section::make('Estrutura')
                    ->components([
                        TagsInput::make('servicos')
                            ->label('Estrutura e serviços')
                            ->placeholder('Ex.: Biblioteca, Laboratório de Informática')
                            ->helperText('Os cursos do campus vêm das ofertas cadastradas em cada curso.'),
                    ]),
            ]);
    }
}
