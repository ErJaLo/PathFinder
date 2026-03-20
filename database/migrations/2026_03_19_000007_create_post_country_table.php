<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('post_country', function (Blueprint $table) {
            $table->id();
            $table->foreignId('post_id')->constrained()->cascadeOnDelete();
            $table->string('country_code', 2);
            $table->foreign('country_code')->references('code')->on('countries')->cascadeOnDelete();
            $table->unique(['post_id', 'country_code']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('post_country');
    }
};
