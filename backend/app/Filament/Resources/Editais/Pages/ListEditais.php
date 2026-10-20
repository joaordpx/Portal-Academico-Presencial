<?php

namespace App\Filament\Resources\Editais\Pages;

use App\Filament\Resources\Editais\EditalResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListEditais extends ListRecords
{
    protected static string $resource = EditalResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
