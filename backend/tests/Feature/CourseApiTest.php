<?php

namespace Tests\Feature;

use App\Models\Course;
use App\Models\Subject;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CourseApiTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test listing courses.
     *
     * @return void
     */
    public function test_should_list_courses(): void
    {
        // Arrange
        Course::factory(3)->create();

        // Act
        $startTime = microtime(true);
        $response = $this->getJson('/api/courses');
        $responseTime = microtime(true) - $startTime;

        // Assert
        $response->assertStatus(200);

        $response->assertJsonStructure([
            'data' => [
                '*' => [
                    'id',
                    'name',
                    'area',
                    'shift',
                    'min_duration',
                    'type',
                ]
            ],
            'links',
            'meta',
        ]);

        $this->assertLessThan(2.0, $responseTime, "The API response took too long.");
    }

    /**
     * Test filtering courses by area.
     *
     * @return void
     */
    public function test_should_filter_courses_by_area(): void
    {
        // Arrange
        Course::factory()->create(['area' => 'Computação']);
        Course::factory()->create(['area' => 'Saúde']);

        // Act
        $response = $this->getJson('/api/courses?area=Computação');

        // Assert
        $response->assertStatus(200);
        $response->assertJsonCount(1, 'data');
        $response->assertJsonPath('data.0.area', 'Computação');
    }

    /**
     * Test getting course details.
     *
     * @return void
     */
    public function test_should_get_course_details(): void
    {
        // Arrange
        $course = Course::factory()
            ->has(Subject::factory()->count(5))
            ->create();

        // Act
        $response = $this->getJson('/api/courses/' . $course->id);

        // Assert
        $response->assertStatus(200);

        $response->assertJsonStructure([
            'data' => [
                'id',
                'name',
                'area',
                'shift',
                'min_duration',
                'type',
                'market_description',
                'coordinator_email',
                'subjects' => [
                    '*' => [
                        'id',
                        'period',
                        'name',
                    ]
                ],
            ]
        ]);

        $response->assertJsonCount(5, 'data.subjects');
    }

    /**
     * Test getting a non-existent course.
     *
     * @return void
     */
    public function test_should_return_not_found_for_invalid_id(): void
    {
        // Act
        $response = $this->getJson('/api/courses/999');

        // Assert
        $response->assertStatus(404);
    }
}
