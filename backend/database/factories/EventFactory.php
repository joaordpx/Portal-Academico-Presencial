<?php

namespace Database\Factories;

use App\Models\Center;
use App\Models\Event;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Event>
 */
class EventFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = $this->faker->sentence(4);

        return [
            'id' => $this->faker->unique()->numberBetween(1, 999999999),
            'title' => $title,
            'description' => $this->faker->paragraphs(3, true),
            'center_id' => Center::factory(),
            'starts_at' => $this->faker->dateTimeBetween('+1 week', '+3 months')->format('Y-m-d'),
            'ends_at' => $this->faker->dateTimeBetween('+1 month', '+4 months')->format('Y-m-d'),
            'registration_ends_at' => $this->faker->dateTimeBetween('now', '+2 months')->format('Y-m-d'),
            'workload_hours' => (string) $this->faker->numberBetween(10, 80),
            'available_spots' => $this->faker->numberBetween(0, 50),
            'is_sold_out' => $this->faker->boolean(15),
            'campus_name' => $this->faker->randomElement(['Campus Central', 'Campus Norte', 'Campus Sul']),
            'event_type' => $this->faker->randomElement(['Curso', 'Palestra', 'Oficina']),
            'image_url' => $this->faker->imageUrl(),
            'details_url' => $this->faker->url(),
            'is_published' => $this->faker->boolean(80),
            'published_at' => now(),
        ];
    }

    /**
     * Indicate that the event is published.
     */
    public function published(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_published' => true,
            'published_at' => now(),
        ]);
    }
}
