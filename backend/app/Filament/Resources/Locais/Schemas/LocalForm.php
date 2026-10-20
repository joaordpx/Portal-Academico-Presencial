<?php

namespace App\Filament\Resources\Locais\Schemas;

use App\Enums\LocalTipo;
use App\Filament\Componentes\Campos;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TagsInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Schema;

class LocalForm
{
    /** Itens do levantamento de acessibilidade, na ordem exibida no portal */
    private const ACESSIBILIDADE = [
        'rampa' => 'Rampa de acesso',
        'elevador' => 'Elevador ou plataforma elevatória',
        'banheiroAdaptado' => 'Banheiro adaptado',
        'pisoTatil' => 'Piso tátil',
        'vagaEspecial' => 'Vaga especial',
    ];

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
                        Select::make('tipo')->options(LocalTipo::class)->required(),
                        TextInput::make('numero')
                            ->label('Número do prédio')
                            ->numeric()
                            ->minValue(1),
                        Select::make('campus_id')
                            ->label('Campus')
                            ->relationship('campus', 'nome')
                            ->preload()
                            ->required(),
                        Select::make('centro_id')
                            ->label('Centro de ensino sediado')
                            ->relationship('centro', 'sigla')
                            ->preload()
                            ->helperText('Só para prédios de centro. Os cursos do centro aparecem automaticamente.'),
                        Textarea::make('descricao')->label('Descrição')->rows(3)->columnSpanFull(),
                        Toggle::make('publicado')->default(true),
                    ]),

                Section::make('O que funciona aqui')
                    ->components([
                        TagsInput::make('setores')->placeholder('Ex.: Secretaria Geral (térreo)'),
                        TagsInput::make('servicos')->label('Serviços')->placeholder('Ex.: Auditório'),
                    ]),

                Section::make('Contato e funcionamento')
                    ->columns(2)
                    ->components([
                        TextInput::make('localizacao')
                            ->label('Localização')
                            ->placeholder('Prédio 2 (CCH) · Térreo')
                            ->columnSpanFull(),
                        TextInput::make('telefone')->tel(),
                        TextInput::make('email')->label('E-mail')->email(),
                        Campos::horarios()->columnSpanFull(),
                    ]),

                Section::make('Mapa')
                    ->columns(3)
                    ->collapsed()
                    ->components([
                        TextInput::make('latitude')->numeric(),
                        TextInput::make('longitude')->numeric(),
                        TextInput::make('svg_id')
                            ->label('ID na planta do campus')
                            ->helperText('Para o futuro mapa interativo.'),
                    ]),

                Section::make('Acessibilidade')
                    ->description('Enquanto o levantamento não for concluído, o portal informa que os dados estão em levantamento.')
                    ->components([
                        Toggle::make('acessibilidade.levantada')
                            ->label('Levantamento concluído')
                            ->live(),
                        ...array_map(
                            fn (string $chave, string $rotulo) => Toggle::make("acessibilidade.{$chave}")
                                ->label($rotulo)
                                ->visible(fn (Get $get): bool => (bool) $get('acessibilidade.levantada')),
                            array_keys(self::ACESSIBILIDADE),
                            self::ACESSIBILIDADE,
                        ),
                    ]),
            ]);
    }
}
