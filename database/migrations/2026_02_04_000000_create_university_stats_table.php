<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('university_stats', function (Blueprint $table) {
            $table->id();
            $table->string('university_name');
            $table->string('program_name')->nullable();
            $table->decimal('average_score', 5, 2)->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('university_stats');
    }
};
