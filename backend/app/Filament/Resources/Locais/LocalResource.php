<?php

namespace App\Filament\Resources\Locais;

use App\Filament\Resources\Locais\Pages\CreateLocal;
use App\Filament\Resources\Locais\Pages\EditLocal;
use App\Filament\Resources\Locais\Pages\ListLocais;
use App\Filament\Resources\Locais\Schemas\LocalForm;
use App\Filament\Resources\Locais\Tables\LocaisTable;
use App\Models\Local;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class LocalResource extends Resource
{
    protected static ?string $model = Local::class;

    protected static ?string $slug = 'locais';

    protected static ?string $modelLabel = 'local';

    protected static ?string $pluralModelLabel = 'locais';

    protected static string|UnitEnum|null $navigationGroup = 'Campus e unidades';

    protected static ?int $navigationSort = 2;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedBuildingOffice2;

    protected static ?string $recordTitleAttribute = 'nome';

    public static function form(Schema $schema): Schema
    {
        return LocalForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return LocaisTable::configure($table);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListLocais::route('/'),
            'create' => CreateLocal::route('/criar'),
            'edit' => EditLocal::route('/{record}/editar'),
        ];
    }
}
