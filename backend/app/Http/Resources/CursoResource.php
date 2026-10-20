<?php

namespace App\Http\Resources;

use App\Models\Curso;
use App\Models\CursoOferta;
use Illuminate\Http\Request;

/**
 * Detalhe de /cursos/{slug} — registro cru do curso. A formatação de
 * apresentação (rótulos, "4 anos", blocos de estágio e TCC) fica no frontend.
 *
 * @mixin Curso
 */
class CursoResource extends CursoResumoResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            ...parent::toArray($request),
            'vagas' => $this->ofertas
                ->filter(fn (CursoOferta $o) => $o->vagas !== null)
                ->sortBy(fn (CursoOferta $o) => [! $o->campus->sede, $o->campus->cidade])
                ->map(fn (CursoOferta $o) => [
                    'campus' => $o->campus->cidade,
                    'quantidade' => $o->vagas,
                    'periodicidade' => $o->periodicidade?->value,
                ])
                ->values(),
            'descricao' => $this->paragrafos($this->descricao),
            'perfilEgresso' => $this->perfil_egresso ?? [],
            'mercadoTrabalho' => $this->mercado_trabalho ?? [],
            'coordenacao' => [
                'coordenador' => $this->coordenador,
                'email' => $this->email_coordenacao,
                'telefone' => $this->telefone_coordenacao,
                'localizacao' => $this->localizacao,
            ],
            'documentos' => [
                'matrizUrl' => $this->matriz_url,
                'ppcUrl' => $this->ppc_url,
            ],
            'regulamentoTccUrl' => $this->regulamento_tcc_url,
            'paginaOficial' => $this->pagina_oficial,
            'documentosExtras' => $this->documentos_extras ?? [],
        ];
    }

    /** @return list<string> */
    private function paragrafos(?string $texto): array
    {
        return array_values(array_filter(array_map('trim', preg_split('/\R{2,}/', $texto ?? ''))));
    }
}
