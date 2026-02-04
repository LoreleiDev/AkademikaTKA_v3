<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UniversityStat extends Model
{
    protected $table = 'university_stats';

    protected $fillable = [
        'university_name',
        'program_name',
        'average_score',
    ];
}
