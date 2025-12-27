<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Materi extends Model
{
    protected $fillable = [
        'mapel_id', 
        'title', 
        'content', 
        'image_url', 
        'public_id'
    ];

    protected $casts = [
        'content' => 'array', // Ini seharusnya mengubah string JSON ke array
    ];

    // Tambahkan ini untuk membersihkan spasi di image_url
    protected $appends = ['clean_image_url'];

    public function mapel()
    {
        return $this->belongsTo(Mapel::class, 'mapel_id');
    }

    // Accessor untuk membersihkan spasi di image_url
    public function getCleanImageUrlAttribute()
    {
        return $this->image_url ? trim($this->image_url) : null;
    }
}