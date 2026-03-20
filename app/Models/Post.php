<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'content',
        'experience_date',
        'image',
        'latitude',
        'longitude',
        'country_code',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'experience_date' => 'date',
            'latitude' => 'decimal:7',
            'longitude' => 'decimal:7',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function categories()
    {
        return $this->belongsToMany(Category::class, 'post_category');
    }

    public function countries()
    {
        return $this->belongsToMany(Country::class, 'post_country', 'post_id', 'country_code', 'id', 'code');
    }

    public function mainCountry()
    {
        return $this->belongsTo(Country::class, 'country_code', 'code');
    }

    public function ratings()
    {
        return $this->hasMany(Rating::class);
    }

    public function reports()
    {
        return $this->hasMany(Report::class);
    }

    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    public function scopeByCategory($query, int $categoryId)
    {
        return $query->whereHas('categories', fn ($q) => $q->where('categories.id', $categoryId));
    }

    public function scopeSearch($query, string $term)
    {
        return $query->where(fn ($q) => $q->where('title', 'like', "%{$term}%")->orWhere('content', 'like', "%{$term}%"));
    }
}
