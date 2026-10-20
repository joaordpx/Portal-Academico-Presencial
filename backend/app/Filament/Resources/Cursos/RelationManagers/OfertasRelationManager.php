<?php

namespace App\Filament\Resources\Cursos\RelationManagers;

use App\Enums\Periodicidade;
use Filament\Actions\CreateAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Validation\Rules\Unique;

/** Campi onde o curso é ofertado, com as vagas de ingresso */
class OfertasRelationManager extends RelationManager
{
    protected static string $relationship = 'ofertas';

    protected static ?string $title = 'Campi e vagas';

    protected static ?string $modelLabel = 'oferta';

    public function form(Schema $schema): Schema
    {
        return $schema
            ->columns(3)
            ->components([
                Select::make('campus_id')
                    ->label('Campus')
                    ->relationship('campus', 'nome')
                    ->preload()
                    ->required()
                    // Um curso aparece uma única vez em cada campus
                    ->unique(
                        ignoreRecord: true,
                        modifyRuleUsing: fn (Unique $rule) => $rule->where('curso_id', $this->getOwnerRecord()->getKey()),
                    ),
                TextInput::make('vagas')
                    ->numeric()
                    ->minValue(1),
                Select::make('periodicidade')
                    ->options(Periodicidade::class)
                    ->requiredWith('vagas'),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('campus.nome')
            ->columns([
                TextColumn::make('campus.nome')->label('Campus')->sortable(),
                TextColumn::make('vagas')->placeholder('Não informado'),
                TextColumn::make('periodicidade'),
            ])
            ->headerActions([
                CreateAction::make()->label('Adicionar campus'),
            ])
            ->recordActions([
                EditAction::make(),
                DeleteAction::make(),
            ]);
    }
}
