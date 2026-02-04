<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\UniversityStat;

class UniversityStatSeeder extends Seeder
{
    public function run()
    {
        $data = [
            ['university_name' => 'Universitas A', 'program_name' => 'Teknik Informatika', 'average_score' => 85.75],
            ['university_name' => 'Universitas B', 'program_name' => 'Ekonomi', 'average_score' => 78.50],
            ['university_name' => 'Universitas C', 'program_name' => 'Kedokteran', 'average_score' => 92.10],
        ];

        foreach ($data as $row) {
            UniversityStat::create($row);
        }
    }
}
