<?php

namespace App\Filament\Resources\Centros\Pages;

use App\Filament\Resources\Centros\CentroResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ManageRecords;

class ManageCentros extends ManageRecords
{
    protected static string $resource = CentroResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
