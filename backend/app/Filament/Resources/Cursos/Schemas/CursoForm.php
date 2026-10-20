<?php

namespace App\Filament\Resources\Cursos\Schemas;

use App\Enums\Grau;
use App\Enums\Turno;
use App\Filament\Componentes\Campos;
use App\Models\Curso;
use Filament\Forms\Components\CheckboxList;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class CursoForm
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
                        Select::make('grau')
                            ->options(Grau::class)
                            ->required(),
                        Select::make('centro_id')
                            ->label('Centro de ensino')
                            ->relationship('centro', 'sigla')
                            ->preload()
                            ->required(),
                        Select::make('area')
                            ->label('Área do conhecimento')
                            ->options(array_combine(Curso::AREAS, Curso::AREAS))
                            ->required(),
                        TextInput::make('duracao')
                            ->label('Duração')
                            ->numeric()
                            ->minValue(1)
                            ->maxValue(16)
                            ->suffix('semestres'),
                        CheckboxList::make('turnos')
                            ->label('Turnos de ingresso')
                            ->options(Turno::class)
                            ->columns(5)
                            ->required()
                            ->columnSpanFull(),
                        TextInput::make('imagem')
                            ->label('Imagem (URL)')
                            ->url()
                            ->columnSpanFull(),
                        Toggle::make('publicado')
                            ->helperText('Cursos não publicados não aparecem no portal.')
                            ->default(true),
                    ]),

                Section::make('Descrição')
                    ->components([
                        Textarea::make('descricao')
                            ->label('Descrição do curso')
                            ->rows(8)
                            ->helperText('Separe os parágrafos com uma linha em branco.'),
                        Repeater::make('perfil_egresso')
                            ->label('Perfil do egresso')
                            ->simple(TextInput::make('item')->required())
                            ->defaultItems(0)
                            ->addActionLabel('Adicionar competência'),
                        Repeater::make('mercado_trabalho')
                            ->label('Mercado de trabalho')
                            ->schema([
                                TextInput::make('titulo')->label('Título')->required(),
                                TextInput::make('descricao')->label('Descrição')->required(),
                            ])
                            ->columns(2)
                            ->defaultItems(0)
                            ->addActionLabel('Adicionar área de atuação'),
                    ]),

                Section::make('Coordenação')
                    ->columns(2)
                    ->components([
                        TextInput::make('coordenador')->label('Coordenador(a)'),
                        TextInput::make('localizacao')->label('Localização'),
                        TextInput::make('email_coordenacao')->label('E-mail')->email(),
                        TextInput::make('telefone_coordenacao')->label('Telefone')->tel(),
                    ]),

                Section::make('Documentos')
                    ->description('Links para os arquivos publicados no site oficial da Unimontes.')
                    ->columns(2)
                    ->components([
                        TextInput::make('matriz_url')->label('Estrutura curricular')->url(),
                        TextInput::make('ppc_url')->label('Projeto Pedagógico (PPC)')->url(),
                        TextInput::make('regulamento_tcc_url')->label('Regulamento de TCC')->url(),
                        TextInput::make('pagina_oficial')->label('Página do curso em unimontes.br')->url(),
                        Repeater::make('documentos_extras')
                            ->label('Outros documentos')
                            ->schema([
                                TextInput::make('label')->label('Nome')->required(),
                                TextInput::make('url')->label('Link')->url()->required(),
                            ])
                            ->columns(2)
                            ->defaultItems(0)
                            ->addActionLabel('Adicionar documento')
                            ->columnSpanFull(),
                    ]),
            ]);
    }
}
