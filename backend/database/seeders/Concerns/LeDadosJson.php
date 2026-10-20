<?php

namespace Database\Seeders\Concerns;

/**
 * Lê os dados reais coletados de unimontes.br (out/2026), guardados em
 * database/seeders/dados/*.json. Servem de carga inicial: depois disso o
 * conteúdo é mantido pelo painel administrativo.
 */
trait LeDadosJson
{
    /** @return list<array<string, mixed>> */
    protected function dados(string $arquivo): array
    {
        return json_decode(
            file_get_contents(database_path("seeders/dados/{$arquivo}.json")),
            true,
            flags: JSON_THROW_ON_ERROR,
        );
    }
}
