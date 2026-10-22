<?php

namespace App\Models;

use App\Enums\TipoResultadoBusca;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Prunable;
use Illuminate\Support\Str;

/** Uma busca feita no portal — sem nada que identifique quem buscou */
class Busca extends Model
{
    use Prunable;

    /** Dias que um registro fica guardado antes de ser apagado */
    public const RETENCAO_DIAS = 90;

    public const UPDATED_AT = null;

    protected $table = 'buscas';

    protected $fillable = ['termo', 'resultados', 'tipo_clicado', 'posicao_clicada'];

    protected function casts(): array
    {
        return [
            'resultados' => 'integer',
            'posicao_clicada' => 'integer',
            'tipo_clicado' => TipoResultadoBusca::class,
            'created_at' => 'datetime',
        ];
    }

    /** Apagados pelo `model:prune`, agendado diariamente em routes/console.php */
    public function prunable(): Builder
    {
        return static::where('created_at', '<', now()->subDays(self::RETENCAO_DIAS));
    }

    /** "  Matrícula   RU " → "matricula ru", para agrupar variações do mesmo termo */
    public static function normalizarTermo(string $termo): string
    {
        return Str::of($termo)->ascii()->lower()->squish()->limit(100, '')->toString();
    }

    /**
     * Termos que parecem dado pessoal não são guardados: e-mails e sequências
     * longas de dígitos (CPF, telefone, matrícula), mesmo com pontuação.
     */
    public static function pareceDadoPessoal(string $termo): bool
    {
        if (preg_match('/\S+@\S+\.\S+/', $termo)) {
            return true;
        }

        $soDigitos = preg_replace('/[\s.\-\/()]/', '', $termo);

        return (bool) preg_match('/\d{8,}/', $soDigitos);
    }
}
