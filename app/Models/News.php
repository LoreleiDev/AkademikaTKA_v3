<?php

namespace App\Models;

use Illuminate\Support\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class News extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'category',
        'description',
        'image_url',
        'public_id',
        'date',
        'start_date',
        'end_date',
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
    ];

    public function getStatusAttribute()
    {
        $now = Carbon::now();

        if ($this->start_date && $this->end_date) {
            if ($now->lt($this->start_date)) {
                return 'upcoming';
            } elseif ($now->between($this->start_date, $this->end_date)) {
                return 'active';
            } else {
                return 'expired';
            }
        }


        return 'active';
    }


    public function scopeActive($query)
    {
        $now = Carbon::now();
        return $query->where(function ($q) use ($now) {
            $q->whereNull('start_date')
                ->orWhere('start_date', '<=', $now);
        })->where(function ($q) use ($now) {
            $q->whereNull('end_date')
                ->orWhere('end_date', '>=', $now);
        });
    }


    public function scopeExpired($query)
    {
        $now = Carbon::now();
        return $query->whereNotNull('end_date')
            ->where('end_date', '<', $now);
    }


    public function scopeUpcoming($query)
    {
        $now = Carbon::now();
        return $query->whereNotNull('start_date')
            ->where('start_date', '>', $now);
    }
}
