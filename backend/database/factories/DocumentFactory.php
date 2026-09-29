<?php

namespace Database\Factories;

use App\Models\Document;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Document>
 */
class DocumentFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<Document>
     */
    protected $model = Document::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $filename = $this->faker->lexify('arquivo-??????') . '.pdf';
        $documentType = $this->faker->randomElement(Document::DOCUMENT_TYPES);
        $contextType = $this->faker->optional(0.7)->randomElement(Document::CONTEXT_TYPES);

        if ($documentType === 'ppc') {
            $contextType = 'course';
        }

        $contextId = $contextType !== null ? $this->faker->numberBetween(1, 100) : null;

        return [
            'title' => $this->faker->sentence(3),
            'description' => $this->faker->optional()->sentence(),
            'document_type' => $documentType,
            'context_type' => $contextType,
            'context_id' => $contextId,
            'original_name' => $filename,
            'extension' => 'pdf',
            'mime_type' => 'application/pdf',
            'size_bytes' => $this->faker->numberBetween(1024, 204800),
            'disk' => 'local',
            'path' => 'documents/' . $filename,
            'uploaded_by' => User::factory(),
        ];
    }
}
