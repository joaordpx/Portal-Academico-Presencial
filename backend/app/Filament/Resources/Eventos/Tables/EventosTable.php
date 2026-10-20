<?php

namespace App\Filament\Resources\Eventos\Tables;

use App\Enums\EventoTipo;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ToggleColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class EventosTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('data', 'desc')
            ->columns([
                TextColumn::make('titulo')->label('Título')->searchable()->wrap(),
                TextColumn::make('data')->label('Início')->date('d/m/Y')->sortable(),
                TextColumn::make('tipo')->badge(),
                TextColumn::make('origem')
                    ->badge()
                    ->formatStateUsing(fn (string $state): string => $state === 'sigex' ? 'SiGex' : 'Manual')
                    ->color(fn (string $state): string => $state === 'sigex' ? 'info' : 'gray'),
                ToggleColumn::make('publicado'),
            ])
            ->filters([
                SelectFilter::make('tipo')->options(EventoTipo::class),
                SelectFilter::make('origem')->options(['manual' => 'Manual', 'sigex' => 'SiGex']),
            ])
            ->recordActions([
                EditAction::make(),
            ]);
    }
}
