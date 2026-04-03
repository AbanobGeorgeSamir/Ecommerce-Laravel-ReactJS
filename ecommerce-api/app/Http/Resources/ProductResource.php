<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray($request)
    {
        $image = $this->image;

        if ($image && ! str_starts_with($image, 'http://') && ! str_starts_with($image, 'https://')) {
            $image = asset('storage/' . $image);
        }

        return [
            'id' => $this->id,
            'name' => $this->name,
            'price' => (float) $this->price,
            'stock' => $this->stock,
            'description' => $this->description,
            'image' => $image,
            'category_id' => $this->category_id,
            'category' => $this->category ? [
                'id' => $this->category->id,
                'name' => $this->category->name,
            ] : null,
            'created_at' => $this->created_at->format('Y-m-d'),
        ];
    }
}
