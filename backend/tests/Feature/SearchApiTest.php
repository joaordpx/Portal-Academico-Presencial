<?php

namespace Tests\Feature;

use App\Models\Center;
use App\Models\Course;
use App\Models\Department;
use App\Models\Document;
use App\Models\Subject;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SearchApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_should_return_ranked_results_for_query(): void
    {
        $course = Course::factory()->create([
            'name' => 'Engenharia de Software',
            'area' => 'Computacao',
        ]);

        Subject::factory()->create([
            'course_id' => $course->id,
            'name' => 'Software Basico',
            'period' => 1,
        ]);

        $response = $this->getJson('/api/search?q=software');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data' => [
                '*' => [
                    'id',
                    'entity_type',
                    'title',
                    'description',
                    'score',
                    'data',
                ],
            ],
            'meta' => [
                'total',
                'per_page',
                'current_page',
                'last_page',
            ],
            'links' => [
                'first',
                'last',
                'prev',
                'next',
            ],
        ]);

        $this->assertGreaterThanOrEqual(
            $response->json('data.1.score'),
            $response->json('data.0.score')
        );
    }

    public function test_should_filter_search_by_entity_type(): void
    {
        $course = Course::factory()->create(['name' => 'Computacao Aplicada']);

        Subject::factory()->create([
            'course_id' => $course->id,
            'name' => 'Computacao Grafica',
            'period' => 2,
        ]);

        $response = $this->getJson('/api/search?q=grafica&entity_type=subject');

        $response->assertStatus(200);
        $response->assertJsonCount(1, 'data');
        $response->assertJsonPath('data.0.entity_type', 'subject');
    }

    public function test_should_return_empty_when_query_is_blank(): void
    {
        Course::factory()->count(2)->create();

        $response = $this->getJson('/api/search?q=');

        $response->assertStatus(200);
        $response->assertJsonCount(0, 'data');
        $response->assertJsonPath('meta.total', 0);
    }

    public function test_should_filter_search_for_centers_and_departments(): void
    {
        $center = Center::factory()->create(['name' => 'Centro de Computacao']);
        Department::factory()->create(['center_id' => $center->id, 'name' => 'Departamento de Computacao']);

        $centerResponse = $this->getJson('/api/search?q=centro&entity_type=center');
        $centerResponse->assertStatus(200);
        $centerResponse->assertJsonPath('data.0.entity_type', 'center');

        $departmentResponse = $this->getJson('/api/search?q=departamento&entity_type=department');
        $departmentResponse->assertStatus(200);
        $departmentResponse->assertJsonPath('data.0.entity_type', 'department');
    }

    public function test_should_return_documents_in_global_search(): void
    {
        Document::factory()->create([
            'title' => 'Guia de Matricula 2026',
            'description' => 'Documento com orientacoes da matricula',
            'document_type' => 'notice',
            'original_name' => 'guia-matricula-2026.pdf',
            'extension' => 'pdf',
            'is_public' => true,
        ]);

        $response = $this->getJson('/api/search?q=matricula&entity_type=document');

        $response->assertStatus(200);
        $response->assertJsonCount(1, 'data');
        $response->assertJsonPath('data.0.entity_type', 'document');
        $response->assertJsonPath('data.0.title', 'Guia de Matricula 2026');
        $response->assertJsonPath('data.0.data.document_type', 'notice');
    }

    public function test_should_paginate_search_results(): void
    {
        Course::factory()->count(4)->sequence(
            ['name' => 'Computacao Base 1', 'area' => 'Computacao'],
            ['name' => 'Computacao Base 2', 'area' => 'Computacao'],
            ['name' => 'Computacao Base 3', 'area' => 'Computacao'],
            ['name' => 'Computacao Base 4', 'area' => 'Computacao'],
        )->create();

        $response = $this->getJson('/api/search?q=base&entity_type=course&per_page=2&page=2');

        $response->assertStatus(200);
        $response->assertJsonPath('meta.per_page', 2);
        $response->assertJsonPath('meta.current_page', 2);
        $response->assertJsonCount(2, 'data');
    }

    public function test_should_return_search_suggestions(): void
    {
        Course::factory()->create(['name' => 'Sistemas de Informação']);
        
        $response = $this->getJson('/api/search/suggest?q=Sistemas');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data' => [
                '*' => ['text', 'type']
            ]
        ]);
    }
}
