<?php

namespace App\Filament\Resources\Editais\Tables;

use App\Enums\EditalTipo;
use App\Models\Edital;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ToggleColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class EditaisTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('prazo', 'desc')
            ->columns([
                TextColumn::make('titulo')->label('Título')->searchable()->wrap(),
                TextColumn::make('tipo')->badge(),
                TextColumn::make('prazo')->date('d/m/Y')->sortable(),
                TextColumn::make('situacao')
                    ->label('Situação')
                    ->state(fn (Edital $record): string => $record->estaAberto() ? 'Aberto' : 'Encerrado')
                    ->badge()
                    ->color(fn (string $state): string => $state === 'Aberto' ? 'success' : 'gray'),
                TextColumn::make('campus')->toggleable(),
                ToggleColumn::make('publicado'),
            ])
            ->filters([
                SelectFilter::make('tipo')->options(EditalTipo::class),
                TernaryFilter::make('abertos')
                    ->label('Situação')
                    ->trueLabel('Abertos')
                    ->falseLabel('Encerrados')
                    ->queries(
                        true: fn (Builder $query) => $query->whereDate('prazo', '>=', today()),
                        false: fn (Builder $query) => $query->whereDate('prazo', '<', today()),
                    ),
            ])
            ->recordActions([
                EditAction::make(),
            ]);
    }
}
