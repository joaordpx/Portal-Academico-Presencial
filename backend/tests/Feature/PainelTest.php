<?php

namespace Tests\Feature;

use App\Enums\Turno;
use App\Filament\Resources\Campi\Pages\EditCampus;
use App\Filament\Resources\Cursos\Pages\EditCurso;
use App\Filament\Resources\Cursos\RelationManagers\OfertasRelationManager;
use App\Filament\Resources\Editais\Pages\CreateEdital;
use App\Filament\Resources\Locais\Pages\EditLocal;
use App\Models\Campus;
use App\Models\Curso;
use App\Models\Edital;
use App\Models\Local;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class PainelTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
        $this->actingAs(User::factory()->create()->assignRole('editor'));
    }

    /** @return array<string, array{string}> */
    public static function listagens(): array
    {
        return [
            'cursos' => ['/admin/cursos'],
            'centros' => ['/admin/centros'],
            'campi' => ['/admin/campi'],
            'locais' => ['/admin/locais'],
            'editais' => ['/admin/editais'],
            'eventos' => ['/admin/eventos'],
        ];
    }

    #[DataProvider('listagens')]
    public function test_listagem_abre(string $url): void
    {
        $this->get($url)->assertOk();
    }

    public function test_salvar_curso_sem_mudancas_preserva_os_dados(): void
    {
        $curso = Curso::where('slug', 'pedagogia')->firstOrFail();

        Livewire::test(EditCurso::class, ['record' => $curso->getRouteKey()])
            ->assertSchemaStateSet(['nome' => 'Pedagogia'])
            ->call('save')
            ->assertHasNoFormErrors();

        $curso->refresh();
        $this->assertEquals([Turno::Vespertino, Turno::Noturno], $curso->turnos->all());
        $this->assertSame(8, $curso->ofertas()->count());
    }

    public function test_editar_turnos_do_curso(): void
    {
        $curso = Curso::where('slug', 'direito')->firstOrFail();

        Livewire::test(EditCurso::class, ['record' => $curso->getRouteKey()])
            ->fillForm(['turnos' => ['Noturno']])
            ->call('save')
            ->assertHasNoFormErrors();

        $this->assertEquals([Turno::Noturno], $curso->refresh()->turnos->all());
    }

    public function test_ofertas_do_curso_aparecem(): void
    {
        $curso = Curso::where('slug', 'pedagogia')->firstOrFail();

        Livewire::test(OfertasRelationManager::class, ['ownerRecord' => $curso, 'pageClass' => EditCurso::class])
            ->assertOk()
            ->assertCanSeeTableRecords($curso->ofertas);
    }

    public function test_criar_edital(): void
    {
        Livewire::test(CreateEdital::class)
            ->fillForm([
                'titulo' => 'Monitoria 2027/1',
                'tipo' => 'Monitoria',
                'publico' => 'Todos os cursos',
                'campus' => 'Montes Claros',
                'prazo' => '2027-03-10',
            ])
            ->call('create')
            ->assertHasNoFormErrors();

        $this->assertTrue(Edital::where('titulo', 'Monitoria 2027/1')->exists());
    }

    public function test_acessibilidade_so_e_publicada_depois_do_levantamento(): void
    {
        $local = Local::where('slug', 'biblioteca-central')->firstOrFail();

        Livewire::test(EditLocal::class, ['record' => $local->getRouteKey()])
            ->fillForm(['acessibilidade' => ['levantada' => false, 'rampa' => true]])
            ->call('save')
            ->assertHasNoFormErrors();
        $this->getJson('/api/locais/biblioteca-central')->assertJsonPath('acessibilidade', null);

        Livewire::test(EditLocal::class, ['record' => $local->getRouteKey()])
            ->fillForm(['acessibilidade' => ['levantada' => true, 'rampa' => true, 'elevador' => true]])
            ->call('save')
            ->assertHasNoFormErrors();
        $this->getJson('/api/locais/biblioteca-central')
            ->assertJsonPath('acessibilidade.rampa', true)
            ->assertJsonMissingPath('acessibilidade.levantada');
    }

    public function test_salvar_campus_sem_mudancas(): void
    {
        $campus = Campus::where('slug', 'janauba')->firstOrFail();

        Livewire::test(EditCampus::class, ['record' => $campus->getRouteKey()])
            ->call('save')
            ->assertHasNoFormErrors();

        $this->assertCount(2, $campus->refresh()->horarios);
    }
}
