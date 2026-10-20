<?php

namespace App\Filament\Resources\Locais\Tables;

use App\Enums\LocalTipo;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ToggleColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class LocaisTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('numero')
            ->columns([
                TextColumn::make('nome')->searchable()->sortable(),
                TextColumn::make('numero')->label('Nº')->sortable(),
                TextColumn::make('tipo')->badge(),
                TextColumn::make('campus.nome')->label('Campus')->sortable(),
                TextColumn::make('centro.sigla')->label('Centro')->badge()->color('gray'),
                TextColumn::make('telefone')->toggleable(),
                ToggleColumn::make('publicado'),
            ])
            ->filters([
                SelectFilter::make('tipo')->options(LocalTipo::class),
                SelectFilter::make('campus')->relationship('campus', 'nome'),
            ])
            ->recordActions([
                EditAction::make(),
            ]);
    }
}
