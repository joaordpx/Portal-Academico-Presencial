<?php

namespace App\Filament\Resources\Cursos\Tables;

use App\Enums\Grau;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ToggleColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;

class CursosTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('nome')
            ->columns([
                TextColumn::make('nome')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('grau')
                    ->badge(),
                TextColumn::make('centro.sigla')
                    ->label('Centro')
                    ->badge()
                    ->color('gray'),
                TextColumn::make('turnos')
                    ->badge()
                    ->color('gray'),
                TextColumn::make('ofertas_count')
                    ->label('Campi')
                    ->counts('ofertas')
                    ->sortable(),
                TextColumn::make('coordenador')
                    ->label('Coordenação')
                    ->toggleable(isToggledHiddenByDefault: true),
                ToggleColumn::make('publicado'),
                TextColumn::make('updated_at')
                    ->label('Atualizado em')
                    ->dateTime('d/m/Y H:i')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                SelectFilter::make('grau')->options(Grau::class),
                SelectFilter::make('centro')->relationship('centro', 'sigla'),
                TernaryFilter::make('publicado'),
            ])
            ->recordActions([
                EditAction::make(),
            ]);
    }
}
