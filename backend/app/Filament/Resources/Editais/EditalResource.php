<?php

namespace App\Filament\Resources\Editais;

use App\Filament\Resources\Editais\Pages\CreateEdital;
use App\Filament\Resources\Editais\Pages\EditEdital;
use App\Filament\Resources\Editais\Pages\ListEditais;
use App\Filament\Resources\Editais\Schemas\EditalForm;
use App\Filament\Resources\Editais\Tables\EditaisTable;
use App\Models\Edital;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class EditalResource extends Resource
{
    protected static ?string $model = Edital::class;

    protected static ?string $slug = 'editais';

    protected static ?string $modelLabel = 'edital';

    protected static ?string $pluralModelLabel = 'editais';

    protected static string|UnitEnum|null $navigationGroup = 'Publicações';

    protected static ?int $navigationSort = 1;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedClipboardDocumentList;

    protected static ?string $recordTitleAttribute = 'titulo';

    public static function form(Schema $schema): Schema
    {
        return EditalForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return EditaisTable::configure($table);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListEditais::route('/'),
            'create' => CreateEdital::route('/criar'),
            'edit' => EditEdital::route('/{record}/editar'),
        ];
    }
}
