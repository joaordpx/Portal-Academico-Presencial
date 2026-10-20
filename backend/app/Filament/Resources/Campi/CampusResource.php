<?php

namespace App\Filament\Resources\Campi;

use App\Filament\Resources\Campi\Pages\CreateCampus;
use App\Filament\Resources\Campi\Pages\EditCampus;
use App\Filament\Resources\Campi\Pages\ListCampi;
use App\Filament\Resources\Campi\Schemas\CampusForm;
use App\Filament\Resources\Campi\Tables\CampiTable;
use App\Models\Campus;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class CampusResource extends Resource
{
    protected static ?string $model = Campus::class;

    protected static ?string $slug = 'campi';

    protected static ?string $modelLabel = 'campus';

    protected static ?string $pluralModelLabel = 'campi';

    protected static string|UnitEnum|null $navigationGroup = 'Campus e unidades';

    protected static ?int $navigationSort = 1;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedMapPin;

    protected static ?string $recordTitleAttribute = 'nome';

    public static function form(Schema $schema): Schema
    {
        return CampusForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return CampiTable::configure($table);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListCampi::route('/'),
            'create' => CreateCampus::route('/criar'),
            'edit' => EditCampus::route('/{record}/editar'),
        ];
    }
}
