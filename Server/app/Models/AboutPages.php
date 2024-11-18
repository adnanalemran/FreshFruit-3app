<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AboutPages extends Model
{
    protected $fillable = ['title', 'description', 'canvas', 'status'];
    use HasFactory;
}
