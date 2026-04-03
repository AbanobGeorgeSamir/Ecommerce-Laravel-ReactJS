<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ProductFactory extends Factory
{

    public function definition(): array
    {
        $name = $this->faker->words(3, true);

        return [
            'name' => ucfirst($name),
            'slug' => Str::slug($name) . '-' . $this->faker->unique()->numberBetween(1, 999),
            'description' => $this->faker->paragraphs(2, true),
            'price' => $this->faker->randomFloat(2, 10, 1000),
            'stock' => $this->faker->numberBetween(0, 100),
            'image' => null,

            'category_id' => Category::pluck('id')->random() ?: Category::factory(),
        ];
    }
}
