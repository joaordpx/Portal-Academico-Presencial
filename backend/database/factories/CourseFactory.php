<?php

namespace Database\Factories;

use App\Models\Center;
use App\Models\Course;
use App\Models\Department;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Course>
 */
class CourseFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->unique()->sentence(3),
            'type' => $this->faker->randomElement(Course::TYPES),
            'center_id' => Center::factory(),
            'department_id' => Department::factory(),
            'area' => $this->faker->word(),
            'shift' => $this->faker->randomElement(['Manhã', 'Tarde', 'Noite', 'Integral']),
            'min_duration' => $this->faker->numberBetween(1, 10),
            'market_description' => $this->faker->paragraph(),
            'coordinator_email' => $this->faker->unique()->safeEmail(),
        ];
    }
}
