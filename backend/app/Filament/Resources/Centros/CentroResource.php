<?php

namespace App\Filament\Resources\Centros;

use App\Filament\Resources\Centros\Pages\ManageCentros;
use App\Models\Centro;
use BackedEnum;
use Filament\Actions\EditAction;
use Filament\Forms\Components\TextInput;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use UnitEnum;

/** Centros de ensino — poucos registros, editados num único modal */
class CentroResource extends Resource
{
    protected static ?string $model = Centro::class;

    protected static ?string $slug = 'centros';

    protected static ?string $modelLabel = 'centro de ensino';

    protected static ?string $pluralModelLabel = 'centros de ensino';

    protected static ?string $navigationLabel = 'Centros de ensino';

    protected static string|UnitEnum|null $navigationGroup = 'Acadêmico';

    protected static ?int $navigationSort = 2;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedBuildingLibrary;

    protected static ?string $recordTitleAttribute = 'sigla';

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('sigla')
                    ->required()
                    ->maxLength(20)
                    ->unique(ignoreRecord: true),
                TextInput::make('nome')
                    ->required()
                    ->maxLength(255),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->defaultSort('sigla')
            ->columns([
                TextColumn::make('sigla')->searchable()->sortable(),
                TextColumn::make('nome')->searchable(),
                TextColumn::make('cursos_count')->label('Cursos')->counts('cursos'),
                TextColumn::make('locais_count')->label('Locais')->counts('locais'),
            ])
            ->recordActions([
                EditAction::make(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ManageCentros::route('/'),
        ];
    }
}
