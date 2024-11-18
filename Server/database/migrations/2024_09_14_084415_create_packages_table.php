<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('packages', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->boolean('status')->default(1);
            $table->decimal('price', 10, 2);
            $table->text('description');
            $table->string('subtitle')->nullable();
            $table->string('departure')->nullable();
            $table->integer('day')->nullable();
            $table->integer('age')->nullable();
            $table->string('parson')->nullable();
            $table->string('departureTime')->nullable();
            $table->string('returnTime')->nullable();
            $table->text('Included')->nullable();
            $table->string('destination')->nullable();
            $table->string('main_image')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('packages');
    }
};
