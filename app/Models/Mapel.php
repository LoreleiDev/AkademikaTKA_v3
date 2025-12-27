<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Mapel extends Model
{
    protected $fillable = ['name', 'image_url', 'public_id', 'home_image_url', 'home_public_id'];

    public function materis()
    {
        return $this->hasMany(Materi::class);
    }
}
