<?php

namespace App\Filament\Widgets\Busca;

use App\Filament\Widgets\Busca\Concerns\EstatisticaDaBusca;
use App\Support\EstatisticasBusca;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget;

/** A lista mais útil: o que as pessoas procuram e o portal não tem */
class TermosSemResultado extends TableWidget
{
    use EstatisticaDaBusca;

    protected static bool $isDiscovered = false;

    protected static bool $isLazy = false;

    protected static ?int $sort = 6;

    protected int|string|array $columnSpan = 'full';

    public function table(Table $table): Table
    {
        return $table
            ->heading('Termos sem resultado')
            ->description('O que as pessoas procuraram e o portal não encontrou. Um termo frequente aqui pede conteúdo novo ou outra palavra no cadastro.')
            ->query(fn () => EstatisticasBusca::termos($this->dias(), somenteSemResultado: true))
            ->columns([
                TextColumn::make('termo')->searchable()->weight('medium'),
                TextColumn::make('vezes')->label('Buscas')->numeric()->sortable(),
                TextColumn::make('ultima_vez')->label('Última busca')->dateTime('d/m/Y H:i')->sortable(),
            ])
            // Sem a ordenação extra pela chave: com GROUP BY, o MySQL a rejeitaria
            ->defaultKeySort(false)
            ->defaultSort('vezes', 'desc')
            ->paginated([10, 25, 50])
            ->emptyStateHeading('Nenhuma busca sem resultado no período')
            ->emptyStateIcon(Heroicon::OutlinedMagnifyingGlass);
    }
}
