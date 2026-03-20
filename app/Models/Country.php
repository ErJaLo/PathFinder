<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Country extends Model
{
    public $incrementing = false;
    public $timestamps = false;

    protected $primaryKey = 'code';
    protected $keyType = 'string';

    protected $fillable = [
        'code',
        'name',
        'nationality',
        'img',
    ];

    public function posts()
    {
        return $this->belongsToMany(Post::class, 'post_country', 'country_code', 'post_id', 'code', 'id');
    }

    public function visitors()
    {
        return $this->belongsToMany(User::class, 'user_country', 'country_code', 'user_id', 'code', 'id');
    }
}
