<?php

namespace App\Filament\Resources\Editais\Pages;

use App\Filament\Resources\Editais\EditalResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditEdital extends EditRecord
{
    protected static string $resource = EditalResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
