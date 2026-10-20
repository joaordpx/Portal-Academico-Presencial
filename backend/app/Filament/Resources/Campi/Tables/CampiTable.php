<?php

namespace App\Filament\Resources\Campi\Tables;

use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class CampiTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('cidade')
            ->columns([
                TextColumn::make('nome')->searchable()->sortable(),
                TextColumn::make('regiao')->label('Região')->toggleable(),
                IconColumn::make('sede')->label('Sede')->boolean(),
                TextColumn::make('ofertas_count')->label('Cursos')->counts('ofertas')->sortable(),
                TextColumn::make('locais_count')->label('Locais')->counts('locais')->sortable(),
                TextColumn::make('telefone'),
                TextColumn::make('email')->label('E-mail')->toggleable(isToggledHiddenByDefault: true),
            ])
            ->recordActions([
                EditAction::make(),
            ]);
    }
}
