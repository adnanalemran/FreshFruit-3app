<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDestinationsTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('destinations', function (Blueprint $table) {
            $table->id(); // Auto-incrementing ID
            $table->string('title'); // Title of the destination
            $table->boolean('status')->default(1);
            $table->text('description'); // Main description
            $table->text('description2')->nullable(); // Optional second description
            $table->string('image')->nullable(); // Store the filename of the main image
            $table->timestamps(); // Automatically manages created_at and updated_at columns
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::dropIfExists('destinations');
    }
}
